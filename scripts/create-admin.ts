import { scrypt, randomBytes } from "crypto";
import { promisify } from "util";
import { storage } from "../server/storage";

const scryptAsync = promisify(scrypt);

async function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const buf = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${buf.toString("hex")}.${salt}`;
}

async function createAdmin() {
  const password = "admin123";
  const hashedPassword = await hashPassword(password);
  
  try {
    const admin = await storage.createUser({
      username: "admin",
      password: hashedPassword,
      role: "admin",
      fullName: "System Administrator",
      email: "admin@qxtworld.com"
    });
    console.log("Admin user created successfully:", admin.username);
  } catch (error) {
    console.error("Failed to create admin:", error);
  }
}

createAdmin().catch(console.error);
