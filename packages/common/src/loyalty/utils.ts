import { getPrisma } from "@redbox-apis/db";
import { User } from "./types";

// --- Users Database --- //

// Search for user in Prisma database
export async function getUser(
  key?: string,
  value?: any,
): Promise<User | User[] | null> {
  try {
    const prisma = await getPrisma();
    if (!key && !value) return (await prisma.user.findMany()) as User[]; // return all users if no key/value is provided

    const user = await prisma.user.findUnique({
      where: {
        [key as string]: value,
      } as any,
    });

    return user as User | null;
  } catch (error) {
    console.error(error);
    return [];
  }
}

// Update a specific user in the database (based on their profile number)
export async function updateUser(user: User): Promise<User | null> {
  const prisma = await getPrisma();

  try {
    const { cpn, ...dataNoCPN } = user;
    const updatedUser = await prisma.user.update({
      where: { cpn },
      data: dataNoCPN,
    });

    return updatedUser as User;
  } catch (error) {
    return null;
  }
}

// Create a user in the database and return the user object
export async function createUser(user: User): Promise<User | null> {
  const prisma = await getPrisma();

  try {
    const newUser = await prisma.user.create({
      data: {
        ...user,
      },
    });

    return newUser as User;
  } catch (error) {
    return null;
  }
}

// Search for a user by its email
export async function getUserByEmail(
  emailAddress: string,
): Promise<User | undefined> {
  return (await getUser("emailAddress", emailAddress)) as User | undefined;
}

// Search for a user by its phone number
export async function getUserByPhoneNumber(
  phoneNumber: string,
): Promise<User | undefined> {
  return (await getUser("phoneNumber", phoneNumber)) as User | undefined;
}

// Search for a user by its profile number
export async function getUserByProfileNumber(
  cpn: string,
): Promise<User | undefined> {
  return (await getUser("cpn", cpn)) as User | undefined;
}

// Creates a user ID, checks for one that's unused
export async function createCPN(): Promise<string> {
  let userCpn: string | null = null;

  while (!userCpn) {
    let newCpn = Math.random().toString().slice(2, 12); // create a 10-digit user id
    const existingUser = await getUser("cpn", newCpn);

    if (!existingUser) {
      userCpn = newCpn;
    }
  }

  return userCpn;
}

// --- Stores Database --- //

// Uses the Redbox database (thanks Puyo) to find the store address from ID
import { IStore, stores, banners } from "@redbox-apis/db";
export async function getStore(
  kioskId: string | number,
): Promise<(IStore & { Banner: string }) | null> {
  const store = stores.find((s: any) => s.Id === Number(kioskId));
  if (!store) return null;

  return {
    ...store,
    Banner:
      banners.find((b: any) => b.Id === Number(store.BannerId))?.Name ||
      "Unknown",
  };
}
