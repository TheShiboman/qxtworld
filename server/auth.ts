import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Express } from "express";
import session from "express-session";
import connectPg from "connect-pg-simple";
import { storage } from "./storage";
import { User as SelectUser } from "@shared/schema";

declare global {
  namespace Express {
    interface User extends SelectUser {}
  }
}

const PostgresStore = connectPg(session);

export function setupAuth(app: Express) {
  if (!process.env.SESSION_SECRET) {
    throw new Error("SESSION_SECRET must be set");
  }

  if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
    throw new Error("Google OAuth credentials must be set");
  }

  const sessionSettings: session.SessionOptions = {
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: new PostgresStore({
      pool: storage.pool,
      tableName: 'sessions',
      createTableIfMissing: true
    }),
    cookie: {
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
      sameSite: "lax",
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
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

  // Set up Google OAuth2.0 strategy
  passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "/api/auth/google/callback",
    proxy: true
  }, async (accessToken, refreshToken, profile, done) => {
    try {
      let user = await storage.getUserByEmail(profile.emails?.[0]?.value || '');

      if (!user) {
        // Create new user if they don't exist
        user = await storage.createUser({
          email: profile.emails?.[0]?.value || '',
          username: profile.displayName.toLowerCase().replace(/\s+/g, ''),
          fullName: profile.displayName,
          password: '', // Not used with OAuth
          role: 'player'
        });
      }

      return done(null, user);
    } catch (error) {
      return done(error);
    }
  }));

  // Auth routes
  app.get('/api/auth/google',
    passport.authenticate('google', {
      scope: ['profile', 'email'],
      prompt: 'select_account'
    })
  );

  app.get('/api/auth/google/callback',
    passport.authenticate('google', {
      failureRedirect: '/auth',
      failureMessage: true
    }),
    (req, res) => {
      res.redirect('/');
    }
  );

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
      return res.status(401).json({ message: "Not authenticated" });
    }
    const { password, ...safeUser } = req.user;
    res.json(safeUser);
  });
}