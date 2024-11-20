import { Joi } from "celebrate";

export const PricingSchema = Joi.object({
    InitialNight: Joi.number().required(),
    ExtraNight: Joi.number().required(),
    NonReturn: Joi.number().required(),
    Purchase: Joi.number().required(),
    Expiration: Joi.number().required(),
    NonReturnDays: Joi.number().required(),
    PriceSetId: Joi.number().required(),
    ProductPriceId: Joi.number().optional(),
    InitialDays: Joi.number().optional(),
    DefaultInitialNight: Joi.number().optional(),
    DefaultExtraNight: Joi.number().optional(),
}).meta({ className: "Pricing" });

export const BlurayUpsellSchema = Joi.object({
    ProductGroupId: Joi.number().required(),
    Offer: Joi.string().required(),
    TitleId: Joi.number().required(),
    TypeId: Joi.number().optional(),
}).meta({ className: "BlurayUpsell" });

export const LineItemSchema = Joi.object({
    ProductId: Joi.number().required(),
    SubscriptionId: Joi.string().required(),
    Barcode: Joi.string().required(),
    VendStatus: Joi.number().required(),
    ProductFamily: Joi.string().required(),
    ProductType: Joi.string().required(),
    ProductName: Joi.string().required(),
    Pricing: PricingSchema.required(),
    BlurayUpsell: BlurayUpsellSchema.required(),
    SourceType: Joi.number().optional(),
    OfferCode: Joi.string().required(),
    TivoQueryId: Joi.string().required(),
    TempPassword: Joi.string().required(),
}).meta({ className: "LineItem" });

export const TotalsSchema = Joi.object({
    TaxRate: Joi.number().required(),
    Subtotal: Joi.number().required(),
    DiscountedSubtotal: Joi.number().required(),
    TaxAmount: Joi.number().required(),
    GrandTotal: Joi.number().required(),
}).meta({ className: "Totals" });

export const LineItemGroupSchema = Joi.object({
    GroupType: Joi.number().required(),
    Items: Joi.array().items(LineItemSchema),
    Totals: TotalsSchema.required(),
}).meta({ className: "LineItemGroup" });

export const DiscountSchema = Joi.object({
    ProductId: Joi.number().required(),
    DiscountType: Joi.number().required(),
    PromotionCode: Joi.string().required(),
    PromotionCodeValue: Joi.string().optional(),
    PromotionIntentCode: Joi.string().optional(),
    RedemptionPoints: Joi.number().optional(),
    Amount: Joi.number().required(),
    Status: Joi.number().required(),
    ApplyOnlyToProduct: Joi.boolean().optional(),
}).meta({ className: "Discount" });

export const ShoppingCartSchema = Joi.object({
    Groups: Joi.array().items(LineItemGroupSchema),
    Discounts: Joi.array().items(DiscountSchema),
}).meta({ className: "ShoppingCart" });

export const CreditCardSchema = Joi.object({
    FirstName: Joi.string().required(),
    LastName: Joi.string().required(),
    Number: Joi.string().required(),
    PostalCode: Joi.string().required(),
    ExpirationMonth: Joi.string().required(),
    ExpirationYear: Joi.string().required(),
    KeyId: Joi.number().optional(),
    CardId: Joi.string().required(),
    CardType: Joi.number().required(),
    Track2: Joi.string().required(),
    IsEncrypted: Joi.boolean().required(),
    BIN: Joi.string().required(),
    LastFour: Joi.string().required(),
    KSN: Joi.string().required(),
    ICEncryptedData: Joi.string().required(),
    ReaderSerialNumber: Joi.string().required(),
    CardSourceType: Joi.number().valid(0, 1, 2, 3, 4, 5, 6).optional(),
    EmvEnabledTerminal: Joi.boolean().required(),
    ContactlessEnabled: Joi.boolean().required(),
    FallbackType: Joi.number().optional(),
}).meta({ className: "CreditCard" });

export const AuthorizeRequestSchema = Joi.object({
    TransactionDate: Joi.date().required(),
    CreditCard: CreditCardSchema.required(),
    ShoppingCart: ShoppingCartSchema.required(),
    CustomerProfileNumber: Joi.string().required(),
    AuthAcceptFlag: Joi.boolean().optional(),
    AuthRuleId: Joi.number().optional(),
    AuthAmount: Joi.number().optional(),
    SkipAuthRule: Joi.boolean().optional(),
}).meta({ className: "AuthorizeRequest" });
