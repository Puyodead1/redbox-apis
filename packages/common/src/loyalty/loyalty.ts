import { User } from "./types";
import { EncryptionService, EncryptionType } from "../";
import {
  readUsers,
  saveUsers,
  updateUser,
  createCPN,
  getUserByProfileNumber,
} from "./utils";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
dotenv.config({ path: "../../.env" });

type Tier = "Member" | "Star" | "Superstar" | "Legend";

/*
    Earn 150 points per night when you rent a disc
    Earn 50+ points for every $1.00 spent when you buy a used disc (based on tier):
    - 50 points for Member
    - 50 points for Star
    - 75 points for Superstar
    - 100 points for Legend
    2,000 points = 1 free 1-night disc rental

    Source: https://www.redbox.com/perks
*/
const TIER_MULTIPLIER: { [key: string]: number } = {
  // points per $1.00 spent based on tier (for used disc purchases)
  Member: Number(process.env.EARNING_MEMBER || 50),
  Star: Number(process.env.EARNING_STAR || 50),
  Superstar: Number(process.env.SUPERSTAR || 75),
  Legend: Number(process.env.EARNING_LEGEND || 100),
};
const POINTS_PER_NIGHT: { [key: string]: number } = {
  Accrual: Number(process.env.RENTAL_POINTS_PER_NIGHT || 150), // 150 points per night
  Redemption: Number(process.env.RENTAL_REDEMPTION_GOAL || 2000), // 2,000 points per night
};

export function estimateAccrual(
  user: User,
  data: any = {},
  excludeRentals = false,
) {
  let items: { productId: string | number; points: number }[] = [];
  if (!data || !data.Groups) return items;

  data.Groups.forEach((group: any) => {
    const groupType = group.GroupType;
    if (groupType === 1 && excludeRentals === true) return; // don't include rentals if not wanted

    if (!group.Items) return; // no items to process
    group.Items.forEach((item: any) => {
      let points = 0;

      if (groupType === 1) {
        // Rentals
        const rentalDays = item?.Pricing?.InitialDays || 1;
        points = POINTS_PER_NIGHT["Accrual"] * rentalDays;
      }

      if (groupType === 2) {
        // Used disc purchases
        const tierPoints =
          TIER_MULTIPLIER[user?.loyalty?.currentTier || "Member"] || 50; // fallback to Member (shouldn't happen)
        points = Math.round((item?.Pricing?.Purchase || 0.0) * tierPoints);
      }

      if (!item.ProductId) return; // extra error handling for invalid products
      items.push({
        productId: item.ProductId,
        points: points,
      });
    });
  });

  return items;
}

export function estimateRedemption(data: any = {}) {
  let items: { productId: string | number; points: number }[] = [];
  data.Groups.forEach((group: any) => {
    const groupType = group.GroupType;

    group.Items.forEach((item: any) => {
      let points = 0;

      if (groupType === 1) {
        // Rentals (only worked for rentals)
        const rentalDays = item.Pricing.InitialDays || 1;
        points = POINTS_PER_NIGHT["Redemption"] * rentalDays;
      }

      items.push({
        productId: item.ProductId,
        points: points,
      });
    });
  });

  return items;
}

export function calculateTier(purchases: number): Tier {
  if (purchases >= Number(process.env.TIER_LEGEND_PURCHASES || 50))
    return "Legend"; // 50+ purchases minimum (default)
  if (purchases >= Number(process.env.TIER_SUPERSTAR_PURCHASES || 20))
    return "Superstar"; // 20+ purchases minimum (default)
  if (purchases >= Number(process.env.TIER_STAR_PURCHASES || 10)) return "Star"; // 10+ purchases minimum (default)
  if (purchases >= Number(process.env.TIER_MEMBER_PURCHASES || 0))
    return "Member"; // No minimum requirement (default)

  return "Member"; // Default to Member if all else fails (should never happen)
}

export async function initialRewards(user: User, data: any = {}) {
  if (!data) return;
  const accrual = estimateAccrual(user, data, true); // exclude rentals since those are credited later, they could only receive points immediately for purchased discs, returned ones will receive points later
  let earningPoints = 0;
  let losingPoints = 0;

  accrual.forEach((rental) => {
    earningPoints += rental.points; // add points for each permanent disc purchase
  });

  data.Discounts.forEach((discount: any) => {
    if (discount.RedemptionPoints && discount.RedemptionPoints > 0) {
      losingPoints += discount.RedemptionPoints; // redeemed points were lost immediately as well
    }
  });

  user.loyalty.pointBalance += earningPoints; // update points with added for purchases
  user.loyalty.pointBalance -= losingPoints; // remove points that were redeemed
  user.loyalty.tierCounter += accrual.length; // count the amount of purchases they have
  user.loyalty.currentTier = calculateTier(user.loyalty.tierCounter); // calculate the users tier based on their amount of purchases
  await updateUser(user);
}

export async function updateRewards(barcode: string, transaction: any) {
  if (!barcode || !transaction) return; // no data to process

  const item = transaction.items.Rental.find(
    (item: any) => item.returnedDate && item.Barcode == barcode.toString(),
  ); // find the barcode in the transaction
  if (!item) return;

  const user = await getUserByProfileNumber(transaction?.customerProfileNumber);
  if (user) {
    // if there's a rewards account
    const rentalDate = new Date(transaction.transactionDate); // time they rented the disc
    const returnDate = new Date(item.returnedDate); // time they returned the disc

    // If the rental was returned on the same day, count as 1 night
    let NIGHTS_COUNT = Math.max(
      1,
      Math.ceil(
        (returnDate.getTime() - rentalDate.getTime()) / (1000 * 60 * 60 * 24),
      ),
    );

    user.loyalty.pointBalance += POINTS_PER_NIGHT["Accrual"] * NIGHTS_COUNT; // update points with added
    user.loyalty.tierCounter += NIGHTS_COUNT; // add amount of nights
    user.loyalty.currentTier = calculateTier(user.loyalty.tierCounter); // calculate their new rewards tier

    transaction.discounts.forEach((discount: any) => {
      if (
        discount.ProductId === item.ProductId &&
        discount.RedemptionPoints &&
        discount.RedemptionPoints > 0
      ) {
        user.loyalty.pointBalance -= POINTS_PER_NIGHT["Accrual"] * NIGHTS_COUNT; // if a rental was redeemed for points, they wouldn't get points for it, so take them off
      }
    });

    await updateUser(user);
  }
}

export async function createAccount(
  data: any,
): Promise<{ success: boolean; reason?: string; data?: any }> {
  const users = await readUsers();

  const tempPassword = Array.from({ length: 10 }, () =>
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_-+=<>?".charAt(
      Math.floor(Math.random() * 70),
    ),
  ).join("");
  const encService = new EncryptionService();
  const pin = data.Pin
    ? encService.decrypt(data.Pin, EncryptionType.LOCAL)
    : null;

  if (data.Email && users.find((user) => user.emailAddress === data.Email)) {
    // if email address already in use
    return {
      success: false,
      reason:
        "It looks like this email address is already associated with an account.",
    };
  }

  if (
    data.MobilePhoneNumber &&
    users.find((user) => user.phoneNumber === data.MobilePhoneNumber)
  ) {
    // if mobile number already in use
    return {
      success: false,
      reason:
        "It looks like this phone number is already associated with an account.",
    };
  }

  if (pin && (pin.length !== 4 || isNaN(Number(pin)))) {
    // if the PIN entered is invalid (through some XHR attack)
    return {
      success: false,
      reason: "You entered an invalid PIN, please try again.",
    };
  }

  const newUser = {
    cpn: await createCPN(),
    signupDate: new Date().toISOString(),
    firstName: null,
    emailAddress: data.Email || null,
    phoneNumber: data.MobilePhoneNumber || null,
    password: await bcrypt.hash(tempPassword, 10), // hash the password w/ bcrypt
    pin: pin ? await bcrypt.hash(pin, 10) : null, // hash the PIN w/ bcrypt
    hashed: true, // migrate to bcrypt for hashing (safe storage of passwords)
    loyalty: {
      pointBalance: Number(process.env.NEW_POINT_BALANCE || 2000), // Get a FREE 1-night disc rental for signing up.
      currentTier: process.env.NEW_TIER_DEFAULT || "Member", // this is their tier (calculated based on purchases)
      tierCounter: 0, // this is their purchase count
    },
    promoCodes: [],
  };

  users.push(newUser);
  let result = {
    success: true,
    data: {
      ...newUser,
      tempPassword: tempPassword, // include the decrypted, temporary password here for the output
    },
  };

  await saveUsers(users);
  return result;
}
