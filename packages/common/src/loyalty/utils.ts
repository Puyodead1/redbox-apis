import { User, Store, Banner } from "./types";
import path from "path";
import fs from "fs";
import dotenv from "dotenv";

dotenv.config({ path: "../../.env" });
const dbPath = process.env.DATABASE_PATH || "database";
const database = path.isAbsolute(dbPath) ? dbPath : path.join(__dirname, "../../../../", dbPath);

// --- Users Database --- //

// Read users from users.json
export async function readUsers(): Promise<User[]> {
  const data = await fs.promises.readFile(path.join(database, "users.json"), "utf8");
  
  try {
    return JSON.parse(data);
  } catch {
    return [];
  }
}

// Save users to users.json
export async function saveUsers(users: User[]): Promise<void> {
  await fs.promises.writeFile(path.join(database, "users.json"), JSON.stringify(users, null, 2), "utf8");
}

// Update a specific user in the database (based on their profile number)
export async function updateUser(user: User): Promise<User | null> {
  const users = await readUsers();
  const userIndex = users.findIndex((u) => u.cpn === user.cpn);
  
  if (userIndex === -1) {
    return null;
  }

  users[userIndex] = user;
  await saveUsers(users);

  return user;
}

// Search for a user by its email
export async function getUserByEmail(emailAddress: string): Promise<User | undefined> {
  const users = await readUsers();
  return users.find((user) => user.emailAddress === emailAddress);
}

// Search for a user by its phone number
export async function getUserByPhoneNumber(phoneNumber: string): Promise<User | undefined> {
  const users = await readUsers();
  return users.find((user) => user.phoneNumber === phoneNumber);
}

// Search for a user by its profile number
export async function getUserByProfileNumber(cpn: string): Promise<User | undefined> {
  const users = await readUsers();
  return users.find((user) => user.cpn === cpn);
}

// Creates a user ID, checks for one that's unused
export async function createCPN(): Promise<string> {
  const users = await readUsers();
  let userCpn: string | null = null;

  while (!userCpn) {
    let newCpn = Math.random().toString().slice(2, 12); // create a 10-digit user id
    if (users.find((user) => user.cpn === newCpn) == null) {
      userCpn = newCpn;
    }
  }

  return userCpn;
}


// --- Stores Database --- //

// Uses the Redbox database (thanks Puyo) to find the store address from ID
export async function getStore(kioskId: string | number): Promise<Store | null> {
  const [stores, banners]: [Store[], Banner[]] = await Promise.all([
    fs.promises.readFile(path.join(database, "src", "stores.json"), "utf8").then(JSON.parse),
    fs.promises.readFile(path.join(database, "src", "banners.json"), "utf8").then(JSON.parse)
  ]);

  const store = stores.find((s) => s.Id === Number(kioskId));
  if (!store) return null;

  store.Banner = banners.find((b) => b.Id === Number(store.BannerId))?.Name || "Unknown";

  return store;
}