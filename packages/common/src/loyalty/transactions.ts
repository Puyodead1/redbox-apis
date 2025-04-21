import path from 'path';
import fs from 'fs';
import dotenv from 'dotenv';

dotenv.config({ path: "../../.env" });
const dbPath = process.env.DATABASE_PATH || 'database';
const database = path.isAbsolute(dbPath) ? dbPath : path.join(__dirname, "../../../../", dbPath);

export async function createTransNumber(): Promise<string> {
    const transactions = JSON.parse(await fs.promises.readFile(path.join(database, 'transactions.json'), "utf8"));
    let orderId: string | null = null;

    while (!orderId) {
        let newId = Math.random().toString().slice(2, 12); // create a 10-digit order number
        if (!transactions[newId]) {
            orderId = newId;
        }
    }

    return orderId;
}

export async function logTransaction(orderId: string | number, trans: any = {}): Promise<any> {
    let data = JSON.parse(await fs.promises.readFile(path.join(database, 'transactions.json'), "utf8"));
    let items: { Rental: any[]; Purchased: any[] } = {
        Rental: [],
        Purchased: []
    };

    if (trans?.ShoppingCart?.Groups) {
        trans.ShoppingCart.Groups.forEach((group: any) => {
            if(!group.Items) return;

            if(group.GroupType === 1) { // Rentals
                items.Rental.push(...group.Items);
            }

            if(group.GroupType === 2) { // Purchases
                items.Purchased.push(...group.Items);
            }
        });
    }

    data[orderId] = {
        email: trans?.Email,
        kioskId: trans?.KioskId,
        transactionDate: trans?.TransactionDate || new Date().toISOString(),
        customerProfileNumber: trans?.CustomerProfileNumber,
        items: items,
        discounts: trans?.ShoppingCart?.Discounts || [],
        cardInformation: trans?.CreditCard || {}
    };

    await fs.promises.writeFile(path.join(database, 'transactions.json'), JSON.stringify(data, null, 2), "utf8");
    return data;
}

export async function returnedDisc(kioskId: string | number, barcode: string, date: string): Promise<any | null> {
    const data = JSON.parse(await fs.promises.readFile(path.join(database, 'transactions.json'), "utf8"));
    if(!barcode || !date) return [];
    
    // Find all transactions containing the disc barcode and hasn't been returned yet (at the same kiosk)
    const transactions = Object.values(data).filter((transaction: any) =>
        transaction.items.Rental.some((item: any) => item.Barcode === barcode.toString() && !item.returnedDate && transaction.kioskId === kioskId)
    );
    
    // If no transactions are found, log and exit
    if (transactions.length === 0) {
        console.log('The barcode ' + barcode + ' was returned, but there are no transactions associated for it.')
        return null;
    }
    
    // Get the most recent transaction
    const latestTransaction: any = transactions.reduce((latest: any, current: any) => 
        new Date(current.transactionDate) > new Date(latest.transactionDate) ? current : latest
    );
    
    transactions.forEach((transaction: any) => {
        transaction.items.Rental.forEach((item: any) => {
            if (transaction === latestTransaction) { // if it's the latest transaction
                item.returnedDate = date; // use the return date
            } else { // if it's some old, uncaught transaction
                item.returnedDate = latestTransaction.transactionDate; // Use the newest transaction as the return date for the old transactions (we're doing this cause if the server is down then it won't mark transactions as complete, so this is just a safety mechanism if there's other old transactions with the same DVD)
            }
        });
    });
    
    await fs.promises.writeFile(path.join(database, 'transactions.json'), JSON.stringify(data, null, 2), 'utf8');
    return transactions; // will be used for rewards later
}
