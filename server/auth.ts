import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Express, Request, Response, NextFunction } from "express";
import session from "express-session";
import { scrypt, randomBytes, timingSafeEqual } from "crypto";
import { promisify } from "util";
import { storage } from "./storage";
import { User as SelectUser } from "@shared/schema";
import admin from "firebase-admin";

// Initialize Firebase Admin with proper error handling
try {
  admin.initializeApp({
    projectId: process.env.VITE_FIREBASE_PROJECT_ID,
    credential: admin.credential.applicationDefault()
  });
  console.log('Firebase Admin initialized successfully');
} catch (error) {
  console.error('Firebase Admin initialization error:', error);
}

declare global {
  namespace Express {
    interface User extends SelectUser {}
  }
}

const scryptAsync = promisify(scrypt);

async function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const buf = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${buf.toString("hex")}.${salt}`;
}

async function comparePasswords(supplied: string, stored: string) {
  const [hashed, salt] = stored.split(".");
  const hashedBuf = Buffer.from(hashed, "hex");
  const suppliedBuf = (await scryptAsync(supplied, salt, 64)) as Buffer;
  return timingSafeEqual(hashedBuf, suppliedBuf);
}

// Update the verifyFirebaseToken middleware with better error handling
async function verifyFirebaseToken(req: Request, res: Response, next: NextFunction) {
  // Skip Firebase verification for traditional login and registration routes
  if (req.path === '/api/login' || req.path === '/api/register') {
    return next();
  }

  const authHeader = req.headers.authorization;
  console.log('Token verification attempt:', {
    hasAuthHeader: !!authHeader,
    headerType: authHeader?.split(' ')[0] || 'none',
    tokenLength: authHeader?.split(' ')[1]?.length || 0
  });

  if (!authHeader?.startsWith('Bearer ')) {
    console.log('No Bearer token found, continuing to next middleware');
    return next();
  }

  try {
    const token = authHeader.split('Bearer ')[1];
    console.log('Attempting to verify token of length:', token.length);

    // Add error handling for Firebase Admin initialization
    if (!admin.apps.length) {
      console.error('Firebase Admin not initialized');
      return res.status(500).json({ message: 'Authentication service unavailable' });
    }

    const decodedToken = await admin.auth().verifyIdToken(token);
    console.log('Token verified successfully for:', {
      email: decodedToken.email,
      uid: decodedToken.uid
    });

    // Check if user exists in our database
    let user = await storage.getUserByEmail(decodedToken.email || '');

    // If user doesn't exist, create a new one
    if (!user) {
      console.log('Creating new user from Google sign-in:', decodedToken.email);
      try {
        // Clear any existing session
        if (req.session) {
          await new Promise((resolve, reject) => {
            req.session.destroy((err) => {
              if (err) reject(err);
              resolve(true);
            });
          });
        }

        user = await storage.createUser({
          username: decodedToken.email?.split('@')[0] || '',
          email: decodedToken.email || '',
          fullName: decodedToken.name || '',
          password: '', // Not used for Google auth
          role: 'player',
          rating: 1500
        });
        console.log('New user created successfully:', {
          email: user.email,
          id: user.id
        });
      } catch (createError) {
        console.error('Error creating new user:', createError);
        return res.status(500).json({ message: 'Failed to create user account' });
      }
    } else {
      console.log('Existing user found:', {
        email: user.email,
        id: user.id
      });
    }

    // Set user info from database and create new session
    req.login(user, (err) => {
      if (err) {
        console.error('Error setting user session:', err);
        return res.status(500).json({ message: 'Failed to create session' });
      }
      console.log('User session created successfully for:', user.email);
      next();
    });
  } catch (error: any) {
    console.error('Error verifying Firebase token:', {
      code: error.code,
      message: error.message,
      errorObject: JSON.stringify(error)
    });
    if (error.code === 'auth/id-token-expired') {
      return res.status(401).json({ message: 'Authentication expired' });
    } else if (error.code === 'auth/invalid-credential') {
      return res.status(401).json({ message: 'Invalid authentication' });
    }
    return res.status(401).json({ message: 'Authentication failed' });
  }
}

export function setupAuth(app: Express) {
  if (!process.env.SESSION_SECRET) {
    throw new Error("SESSION_SECRET must be set");
  }

  const sessionSettings: session.SessionOptions = {
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: storage.sessionStore,
    cookie: {
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
      sameSite: "lax",
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
      path: "/",
      domain: process.env.NODE_ENV === "production" ? ".replit.app" : undefined
    },
    name: "qxt.sid"
  };

  app.set("trust proxy", 1);
  app.use(session(sessionSettings));
  app.use(passport.initialize());
  app.use(passport.session());

  // Set up passport serialization
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id: number, done) => {
    try {
      const user = await storage.getUser(id);
      done(null, user);
    } catch (error) {
      done(error);
    }
  });

  // Add Firebase token verification after session setup
  app.use(verifyFirebaseToken);

  // Traditional login route
  app.post("/api/login", async (req, res) => {
    try {
      console.log('Traditional login attempt for username:', req.body.username);
      const { username, password } = req.body;
      const user = await storage.getUserByUsername(username);

      if (!user || !(await comparePasswords(password, user.password))) {
        console.log('Login failed: Invalid credentials for username:', username);
        return res.status(401).json({ message: "Invalid username or password" });
      }

      req.login(user, (err) => {
        if (err) {
          console.error('Login error:', err);
          return res.status(500).json({ message: "Login failed" });
        }
        const { password, ...safeUser } = user;
        console.log('Login successful for user:', username);
        res.json(safeUser);
      });
    } catch (error) {
      console.error('Login route error:', error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Registration endpoint
  app.post("/api/register", async (req, res, next) => {
    try {
      console.log('Traditional registration attempt for username:', req.body.username);

      // Check for existing user by username
      const existingUsername = await storage.getUserByUsername(req.body.username);
      if (existingUsername) {
        console.log('Registration failed: Username already exists:', req.body.username);
        return res.status(400).json({ message: "Username already exists" });
      }

      // Check for existing user by email
      const existingEmail = await storage.getUserByEmail(req.body.email);
      if (existingEmail) {
        console.log('Registration failed: Email already exists:', req.body.email);
        return res.status(400).json({ message: "Email already exists" });
      }

      const hashedPassword = await hashPassword(req.body.password);
      const user = await storage.createUser({
        ...req.body,
        password: hashedPassword,
        role: 'player',
        rating: 1500
      });

      console.log('User registered successfully:', user.email);

      // Log the user in after registration
      req.login(user, (err) => {
        if (err) {
          console.error('Auto-login after registration failed:', err);
          return next(err);
        }
        const { password, ...safeUser } = user;
        res.status(201).json(safeUser);
      });
    } catch (error) {
      console.error('Registration error:', error);
      next(error);
    }
  });

  app.post("/api/logout", (req, res, next) => {
    console.log('Logout requested for user:', req.user?.email);

    req.logout((err) => {
      if (err) {
        console.error('Logout error:', err);
        return next(err);
      }

      req.session.destroy((err) => {
        if (err) {
          console.error('Session destruction error:', err);
          return next(err);
        }
        res.clearCookie("qxt.sid");
        console.log('User logged out and session cleared successfully');
        res.sendStatus(200);
      });
    });
  });

  app.get("/api/user", (req, res) => {
    if (!req.user) {
      return res.status(401).json({ message: "Not authenticated" });
    }
    const { password, ...safeUser } = req.user;
    res.json(safeUser);
  });
}