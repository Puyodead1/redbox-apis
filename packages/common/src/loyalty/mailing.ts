import { SMTPClient } from "emailjs";
import { getStore } from "./utils";
import dotenv from "dotenv";
dotenv.config({ path: "../../.env" });

// --- Transporter Setup ---
const client = new SMTPClient({
  user: process.env.SMTP_USERNAME,
  password: process.env.SMTP_PASSWORD,
  host: process.env.SMTP_HOSTNAME,
  port: Number(process.env.SMTP_PORT),
  ssl: process.env.SMTP_SSL === "true",
  tls: process.env.SMTP_TLS === "true",
});

// --- Utility Functions ---
function formatDate(isoString: string): string {
  const date = new Date(isoString);
  return date
    .toLocaleString("en-US", {
      year: "numeric",
      month: "numeric",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
      hour12: true,
    })
    .replace(",", "");
}

function fromCardBIN(bin?: string | number): string {
  if (!bin) return "Promo";
  const binStr = bin.toString();

  if (/^4/.test(binStr)) return "Visa";
  if (/^5[1-5]/.test(binStr)) return "Mastercard";
  if (/^3[47]/.test(binStr)) return "American Express";
  if (/^6(?:011|5)/.test(binStr)) return "Discover";
  if (/^35/.test(binStr)) return "JCB";
  if (/^(?:2131|1800)/.test(binStr)) return "JCB (Old)";

  return "Other";
}

// --- Main Functions ---
export async function sendSignup(
  email: string,
  password: string,
  kioskId: string | number,
) {
  const store = await getStore(kioskId);
  try {
    const store = await getStore(kioskId);

    const message = await client.sendAsync({
      from: `Redbox Perks <${process.env.SMTP_USERNAME}>`,
      to: email,
      subject: `Welcome to Redbox Perks!`,
      text: `You're in! Thanks for signing up at your local Redbox kiosk.\nYour temporary password for your Redbox account is: ${password}\n\nYou can access your online account by clicking here: https://${process.env.BASE_DOMAIN || "redbox.com"}/login\n\nIf you didn't create this account, please reply to this email immediately to let us know.\n\nThanks for being a part of Redbox!`,
      attachment: [
        {
          data: `
            <p>You're in! Thanks for signing up at your local Redbox kiosk.</p>
            <p><strong>Your temporary password for your Redbox account is: <code>${password}</code></strong></p>
            <p>You can access your online account by <a href="https://${process.env.BASE_DOMAIN || "redbox.com"}/login">clicking here</a>.</p>
            <p>If you didn't create this account, please reply to this email immediately to let us know.</p>
            <br><p>As a special thanks for signing up, you'll receive a FREE 1-night disc rental on your next purchase. Thanks for being a part of Redbox!</p>
            <small>Your sign-up was made at the following kiosk address: <strong>${store!.Address}, ${store!.City}, ${store!.State} ${store!.ZipCode}</strong> (Kiosk #${kioskId})</small>
          `,
          alternative: true,
        },
      ],
    });
    console.log("Email sent successfully to ${email}:", message);
    return message;
  } catch (error) {
    console.log("Error sending email:", error);
  }
}

// --- Main Function to Send Receipt ---
export async function sendReceipt(orderId: string | number, data: any = {}) {
  if (!data?.Email) return false;
  const store = data.KioskId ? await getStore(data.KioskId) : null;
  let transactionDetails: {
    subtotal?: string;
    tax?: string;
    total?: string;
    discount?: string;
    adjustedSubtotal?: string;
  } = {};

  if (data?.ShoppingCart?.Groups) {
    transactionDetails = {
      subtotal: data.ShoppingCart.Groups.reduce(
        (sum: number, group: any) => sum + group.Totals.Subtotal,
        0,
      ).toFixed(2),
      tax: data.ShoppingCart.Groups.reduce(
        (sum: number, group: any) => sum + group.Totals.TaxAmount,
        0,
      ).toFixed(2),
      total: data.ShoppingCart.Groups.reduce(
        (sum: number, group: any) => sum + group.Totals.GrandTotal,
        0,
      ).toFixed(2),

      discount: data.ShoppingCart.Discounts.reduce(
        (sum: number, item: any) => sum + item.Amount,
        0,
      ).toFixed(2),
      adjustedSubtotal: data.ShoppingCart.Groups.reduce(
        (sum: number, group: any) => sum + group.Totals.DiscountedSubtotal,
        0,
      ).toFixed(2),
    };
  }

  try {
    let html = `
    <html>
    <head>
        <title></title>
        <meta http-equiv="content-type" content="text/html; charset=UTF-8">
        <style type="text/css">
            .Details, .DetailsTop{text-align:right;width:130px;}.DetailsTop{vertical-align: top;}.customer-table{margin-top:10px;}.customer-table td{ padding: 0px;}.HeaderItem{font-size: medium;font-weight: bold;}.HeaderItem td{}.LineItem{font-size: small;}.ThickHr{width: 100%;height: 4px;border-top: 3px solid #000000;border-color: #B1101A;}.ThinHr{width: 100%;height:1px;border-top: 2px solid #000000; }
        </style>
    </head>
    <body>
        <p>Thank you for using redbox! The receipt below is for your first night's rental. If you keep your rented disc(s) for any additional nights, redbox will process those charges after all disc(s) have been returned. If you return your rented disc(s) by
            9:00 PM tomorrow, you won't receive any additional charges and this will be your final receipt.</p>
        <p>Please keep this receipt for your records.</p>
        <table class="customer-table">
            <tr>
                <td><b>Billed To:</b></td>
                <td>${data.Email.toUpperCase()}</td>
            </tr>
            <tr>
                <td><b>Transaction ID:</b></td>
                <td>${orderId}</td>
            </tr>
            <tr>
                <td><b>Receipt Date:</b></td>
                <td>${formatDate(data?.TransactionDate || new Date().toISOString())}</td>
            </tr>
            <tr>
                <td><b>Order Total:</b></td>
                <td>${transactionDetails?.total || "0.00"}</td>
            </tr>
            <tr>
                <td><b>Payment Card:</b></td>
                <td>${fromCardBIN(data?.CreditCard?.BIN)}....${data?.CreditCard?.LastFour || "0000"}</td>
            </tr>
            <tr>
                <td><b>Redbox Location:</b></td>
                <td>${store?.Banner || "Unknown"} <a href="${data.KioskId ? "http://www.redbox.com/movies/kiosk/" + data.KioskId : "http://www.redbox.com/"}">(see available movies)</a></tr>
            <tr>
                <td/>
                <td>${store?.Address || "Address not found"}</td>
            </tr>
            <tr>
                <td/>
                <td>${store!.City && store!.State && store!.ZipCode ? store!.City + ", " + store!.State + " " + store!.ZipCode : ""}</td>
            </tr>
        </table>
        <table id="TransactionTable" style="width:100%;" cellSpacing="0" cellPadding="0" border="0">
            <tr>
                <td colSpan="5" rowSpan="1">
                    <hr class="ThinHr">
                </td>
            </tr>
            <tr style="border:solid 2px #060" class="HeaderItem">
                <td style="width:65%">Title</td>
                <td align="left">Barcode</td>
                <td align="left">Transaction</td>
                <td align="left">Amount</td>
                <td> </td>
            </tr>
            <tr>
                <td colSpan="5" rowSpan="1">
                    <hr class="ThinHr">
                </td>
            </tr>
            --- INSERT LINE ITEMS HERE ---
            <tr>
                <td style="color: transparent">-</td> <!-- added by brian to create new-line -->
            </tr>
            <tr>
                <td colspan="2"></td>
                <td>Subtotal:</td>
                <td align="left">${transactionDetails?.subtotal || "0.00"}</td>
            </tr>
            <tr>
                <td colspan="2"></td>
                <td>Promo Savings:</td>
                <td align="left">${transactionDetails?.discount || "0.00"}</td>
            </tr>
            <tr>
                <td colspan="2"></td>
                <td colSpan="2">
                    <hr>
                </td>
            </tr>
            <tr>
                <td colspan="2">Reserve it online to guarantee it's there: <a href="http://www.redbox.com">www.redbox.com</a></td>
                </td>
                <td>Adjusted Subtotal:</td>
                <td align="left">${transactionDetails?.adjustedSubtotal || "0.00"}</td>
            </tr>
            <tr>
                <td colspan="2"></td>
                <td>Tax:</td>
                <td align="left">${transactionDetails?.tax || "0.00"}</td>
            </tr>
            <tr>
                <td colspan="2"></td>
                <td colSpan="2">
                    <hr>
                </td>
            </tr>
            <tr>
                <td colspan="2"></td>
                <td>TOTAL CHARGE:</td>
                <td align="left">${transactionDetails?.total || "0.00"}</td>
            </tr>
        </table><b>Questions? Comments? Talk to redbox!</b>
        <hr class="ThinHr" />
        <table>
            <tr>
                <td>Get answers:</td>
                <td><a href="http://www.redbox.com/help">http://www.redbox.com/help</a></td>
            </tr>
            <tr>
                <td>Email redbox:</td>
                <td><a href="http://www.redbox.com/askquestionhelp">http://www.redbox.com/askquestionhelp</a></td>
            </tr>
            <tr>
                <td>Call redbox:</td>
                <td>1.866.REDBOX3 (1.866.733.2693)</td>
            </tr>
        </table>
    </body>
    </html>
    `;

    let lineItems = "";
    if (data?.ShoppingCart?.Groups) {
      data.ShoppingCart.Groups.forEach((group: any) => {
        group.Items.forEach((item: any) => {
          lineItems += `
            <tr class="LineItem">
              <td>${item.ProductName}</td>
              <td align="left">${item.Barcode}</td>
              <td align="left">${group.GroupType === 1 ? "Rental" : "Purchase"}</td>
              <td align="left">$${group.GroupType === 1 ? item.Pricing.InitialNight.toFixed(2) : item.Pricing.Purchase.toFixed(2)}</td>
              <td> </td>
            </tr>
          `;
        });
      });
    }
    html = html.replace("--- INSERT LINE ITEMS HERE ---", lineItems);

    const message = {
      from: `Redbox Receipts <${process.env.SMTP_USERNAME}>`,
      to: data.Email,
      subject: `Redbox Receipt for ${orderId}`,
      text: `Here is your receipt for the order ID: ${orderId}`,
      attachment: [
        { data: html, alternative: true },
      ],
    };
    const result = await client.sendAsync(message);
    console.log("Email sent successfully:", result);
    return result;
  } catch (error) {
    console.log("Error sending receipt:", error);
    throw error;
  }
}