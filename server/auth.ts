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
      console.error('Firebase Admin not initialized, attempting initialization...');
      try {
        admin.initializeApp({
          projectId: process.env.VITE_FIREBASE_PROJECT_ID,
          credential: admin.credential.applicationDefault()
        });
        console.log('Firebase Admin initialized successfully');
      } catch (initError) {
        console.error('Firebase Admin initialization error:', initError);
        return res.status(500).json({ message: 'Authentication service unavailable' });
      }
    }

    const decodedToken = await admin.auth().verifyIdToken(token);
    console.log('Token verified successfully for user:', decodedToken.email, 'uid:', decodedToken.uid);

    // Set user info from Firebase token
    req.user = {
      id: parseInt(decodedToken.uid) || 0,
      username: decodedToken.email || '',
      password: '', // Not used for Firebase auth
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
    name: "qxt.sid",
    rolling: true,
  };

  app.set("trust proxy", 1);
  app.use(session(sessionSettings));
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(verifyFirebaseToken);

  app.get("/api/user", (req, res) => {
    if (!req.user) {
      return res.sendStatus(401);
    }
    const { password, ...safeUser } = req.user;
    res.json(safeUser);
  });
}