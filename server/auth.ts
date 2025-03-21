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

// Update the verifyFirebaseToken middleware with more detailed logging
async function verifyFirebaseToken(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  console.log('Verifying Firebase token, auth header present:', !!authHeader);

  if (!authHeader?.startsWith('Bearer ')) {
    console.log('No Bearer token found, continuing to next middleware');
    return next();
  }

  try {
    const token = authHeader.split('Bearer ')[1];
    console.log('Attempting to verify token of length:', token.length);

    // Add error handling for Firebase Admin initialization
    if (!admin.apps.length) {
      console.error('Firebase Admin not initialized, attempting initialization...');
      try {
        admin.initializeApp({
          projectId: process.env.VITE_FIREBASE_PROJECT_ID,
          credential: admin.credential.applicationDefault()
        });
        console.log('Firebase Admin initialized successfully');
      } catch (initError) {
        console.error('Firebase Admin initialization error:', initError);
        return next();
      }
    }

    const decodedToken = await admin.auth().verifyIdToken(token);
    console.log('Token verified successfully for user:', decodedToken.email, 'uid:', decodedToken.uid);

    // Set user info from Firebase token
    req.user = {
      id: parseInt(decodedToken.uid) || 0,
      username: decodedToken.email || '',
      password: '', // Required by type but not used for Firebase auth
      role: 'player',
      fullName: decodedToken.name || '',
      email: decodedToken.email || '',
      rating: 1500,
      createdAt: new Date()
    };
    console.log('User object set from Firebase token:', { 
      email: req.user.email, 
      role: req.user.role 
    });
    next();
  } catch (error) {
    console.error('Error verifying Firebase token:', error);
    if (error.code === 'auth/id-token-expired') {
      console.log('Token expired, client should refresh');
    } else if (error.code === 'auth/invalid-credential') {
      console.error('Invalid credential configuration');
    }
    // Don't send error to client, just continue to next middleware
    next();
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
    name: "qxt.sid",
    rolling: true,
  };

  app.set("trust proxy", 1);
  app.use(session(sessionSettings));
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(verifyFirebaseToken);

  passport.use(
    new LocalStrategy(async (username, password, done) => {
      try {
        const user = await storage.getUserByUsername(username);
        if (!user || !(await comparePasswords(password, user.password))) {
          return done(null, false);
        }
        return done(null, user);
      } catch (error) {
        return done(error);
      }
    })
  );

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

  app.post("/api/login", passport.authenticate("local"), (req, res) => {
    res.json(req.user);
  });

  app.post("/api/register", async (req, res, next) => {
    try {
      const existingUser = await storage.getUserByUsername(req.body.username);
      if (existingUser) {
        return res.status(400).json({ message: "Username already exists" });
      }

      const hashedPassword = await hashPassword(req.body.password);
      const user = await storage.createUser({
        ...req.body,
        password: hashedPassword,
      });

      req.login(user, (err) => {
        if (err) return next(err);
        const { password, ...safeUser } = user;
        res.status(201).json(safeUser);
      });
    } catch (error) {
      next(error);
    }
  });

  app.post("/api/logout", (req, res, next) => {
    req.logout((err) => {
      if (err) return next(err);
      req.session.destroy((err) => {
        if (err) return next(err);
        res.clearCookie("qxt.sid");
        res.sendStatus(200);
      });
    });
  });

  app.get("/api/user", (req, res) => {
    if (!req.user) {
      return res.sendStatus(401);
    }
    const { password, ...safeUser } = req.user;
    res.json(safeUser);
  });
}