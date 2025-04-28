import { getPrisma } from "@redbox-apis/db";
import path from "path";
import fs from "fs";


export async function createTransNumber(): Promise<string> {
  const prisma = await getPrisma();
  let orderId: string | null = null;

  while (!orderId) {
    let newId = Math.random().toString().slice(2, 12); // create a 10-digit order number
    const existing = await prisma.transaction.findUnique({
      where: {
        transactionId: newId,
      },
    });

    if (!existing) {
      orderId = newId;
    }
  }

  return orderId;
}

export async function logTransaction(
  orderId: string | number,
  trans: any = {},
): Promise<any> {
  const prisma = await getPrisma();
  let items: { Rental: any[]; Purchased: any[] } = {
    Rental: [],
    Purchased: [],
  };

  if (trans?.ShoppingCart?.Groups) {
    trans.ShoppingCart.Groups.forEach((group: any) => {
      if (!group.Items) return;

      if (group.GroupType === 1) {
        // Rentals
        items.Rental.push(...group.Items);
      }

      if (group.GroupType === 2) {
        // Purchases
        items.Purchased.push(...group.Items);
      }
    });
  }

  await prisma.transaction.create({
    data: {
      transactionId: orderId.toString(),
      email: trans?.Email,
      kioskId: trans?.KioskId ? Number(trans.KioskId) : null,
      transactionDate: trans?.TransactionDate || new Date().toISOString(),
      customerProfileNumber: trans?.CustomerProfileNumber,
      items: items,
      discounts: trans?.ShoppingCart?.Discounts || [],
      cardInformation: trans?.CreditCard || {},
    },
  });
  return true;
}

export async function returnedDisc(
  kioskId: string | number,
  barcode: string,
  date: string,
): Promise<any | null> {
  const prisma = await getPrisma();
  if (!barcode || !date) return [];

  // Find all transactions containing the disc barcode and hasn't been returned yet (at the same kiosk)
  const data = await prisma.transaction.findMany();
  const transactions = data.filter((transaction: any) =>
    transaction.items.Rental.some(
      (item: any) =>
        item.Barcode === barcode.toString() &&
        !item.returnedDate &&
        transaction.kioskId === kioskId,
    ),
  );

  // If no transactions are found, log and exit
  if (transactions.length === 0) {
    console.log(
      "The barcode " +
        barcode +
        " was returned, but there are no transactions associated for it.",
    );
    return null;
  }

  // Get the most recent transaction
  const latestTransaction: any = transactions.reduce(
    (latest: any, current: any) =>
      new Date(current.transactionDate) > new Date(latest.transactionDate)
        ? current
        : latest,
  );

  for (const transaction of transactions) {
    (transaction.items as any).Rental.forEach((item: any) => {
      if (item.Barcode === barcode.toString() && !item.returnedDate) {
        // this is important or else all items will be marked as returned
        if (transaction.transactionId === latestTransaction.transactionId) {
          // if it's the latest transaction
          item.returnedDate = date; // use the return date
        } else {
          // if it's some old, uncaught transaction
          item.returnedDate = latestTransaction.transactionDate; // Use the newest transaction as the return date for the old transactions (we're doing this cause if the server is down then it won't mark transactions as complete, so this is just a safety mechanism if there's other old transactions with the same DVD)
        }
      }
    });

    await prisma.transaction.update({
      where: { transactionId: transaction.transactionId },
      data: {
        items: transaction.items as any, // fuck you ts, i know what im doing... leave me aloneee
      },
    });
  }

  return transactions; // will be used for rewards later
}
