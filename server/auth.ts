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

  const sessionSettings: session.SessionOptions = {
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: new PostgresStore({
      pool: storage.pool,
      tableName: 'session',  // Changed from 'sessions' to match PostgreSQL naming
      createTableIfMissing: true,
      pruneSessionInterval: 60
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

  // Simple session-based auth endpoints
  app.post("/api/logout", (req, res, next) => {
    req.session.destroy((err) => {
      if (err) return next(err);
      res.clearCookie("qxt.sid");
      res.sendStatus(200);
    });
  });

  app.get("/api/user", (req, res) => {
    if (!req.session.user) {
      return res.status(401).json({ message: "Not authenticated" });
    }
    res.json(req.session.user);
  });
}