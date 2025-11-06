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
  SubscriptionId: Joi.string().optional(),
  Barcode: Joi.string().required(),
  VendStatus: Joi.number().required(),
  ProductFamily: Joi.string().required(),
  ProductType: Joi.string().required(),
  ProductName: Joi.string().required(),
  Pricing: PricingSchema.required(),
  BlurayUpsell: BlurayUpsellSchema.optional(),
  SourceType: Joi.number().optional(),
  OfferCode: Joi.string().optional(),
  TivoQueryId: Joi.string().optional(),
  TempPassword: Joi.string().optional(),
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
  FirstName: Joi.string().optional(),
  LastName: Joi.string().optional(),
  Number: Joi.string().optional(),
  PostalCode: Joi.string().required(),
  ExpirationMonth: Joi.string().optional(),
  ExpirationYear: Joi.string().optional(),
  KeyId: Joi.number().optional(),
  CardId: Joi.string().optional(),
  CardType: Joi.number().required(),
  Track2: Joi.string().allow("").optional(),
  IsEncrypted: Joi.boolean().required(),
  BIN: Joi.string().optional(),
  LastFour: Joi.string().optional(),
  KSN: Joi.string().optional(),
  ICEncryptedData: Joi.string().optional(),
  ReaderSerialNumber: Joi.string().optional(),
  CardSourceType: Joi.number().valid(0, 1, 2, 3, 4, 5, 6).optional(),
  EmvEnabledTerminal: Joi.boolean().required(),
  ContactlessEnabled: Joi.boolean().required(),
  FallbackType: Joi.number().optional(),
  IsTechnicalFallback: Joi.boolean().optional(),
}).meta({ className: "CreditCard" });

export const DiscOfferSchema = Joi.object({
  Barcode: Joi.string().required(),
  OfferCode: Joi.string().required(),
}).meta({ className: "DiscOffer" });

export const RedeemedOfferSchema = Joi.object({
  OfferId: Joi.number().required(),
  CampaignId: Joi.number().optional(),
  StoredOfferId: Joi.number().optional(),
}).meta({ className: "RedeemedOffer" });

export const MessageBaseSchema = Joi.object({
  MessageId: Joi.string().required(),
  KioskId: Joi.number().required(),
}).meta({ className: "MessageBase" });

export const ReturnRequestSchema = MessageBaseSchema.keys({
  Barcode: Joi.string().required(),
  Deck: Joi.number().required(),
  FailedSecurityRead: Joi.boolean().required(),
  ReturnDate: Joi.date().iso().required(),
  ReturnType: Joi.number().required(),
  Slot: Joi.number().required(),
}).meta({ className: "ReturnRequest" });

export const ReconcileRequestSchema = MessageBaseSchema.keys({
  ReferenceNumber: Joi.number().optional(),
  Blocklisted: Joi.boolean().required(),
  Email: Joi.string().email().required(),
  TransactionDate: Joi.date().optional(),
  CreditCard: CreditCardSchema.required(),
  ParentTransactionId: Joi.number().optional(),
  ShoppingCart: ShoppingCartSchema.required(),
  IsOffline: Joi.boolean().required(),
  PlayPassPromptAccepted: Joi.boolean().required(),
  PlayPassPointsEarned: Joi.number().optional(),
  CustomerProfileNumber: Joi.string().required(),
  UtcOffset: Joi.string().required(),
  DiscOfferCodes: Joi.array().items(DiscOfferSchema).required(),
  IsEarlyId: Joi.boolean().required(),
  IsEarlyIdApple: Joi.boolean().required(),
  IsEarlyIdGoogle: Joi.boolean().required(),
  RedeemedCustomerOffer: RedeemedOfferSchema.required(),
}).meta({ className: "ReconcileRequest" });

export const AuthorizeRequestSchema = MessageBaseSchema.keys({
  TransactionDate: Joi.date().required(),
  CreditCard: CreditCardSchema.required(),
  ShoppingCart: ShoppingCartSchema.required(),
  CustomerProfileNumber: Joi.string().optional(),
  AuthAcceptFlag: Joi.boolean().optional(),
  AuthRuleId: Joi.number().optional(),
  AuthAmount: Joi.number().optional(),
  SkipAuthRule: Joi.boolean().optional(),
}).meta({ className: "AuthorizeRequest" });

// Base service config
export const ServiceConfigSchema = Joi.object({
  port: Joi.number().required(),
  host: Joi.string().required(),
}).meta({ className: "ServiceConfig" });

export const DbConfigSchema = Joi.object({}).meta({ className: "DbConfig" });

export const UserSchema = Joi.object({
  username: Joi.string().required(),
  password: Joi.string().required(),
}).meta({ className: "User" });

export const LoginInfoSchema = Joi.object({
  desktop: Joi.array().items(UserSchema).required(),
  field: Joi.array().items(UserSchema).required(),
}).meta({ className: "LoginInfo" });

export const AlternativeNameSchema = Joi.object({
  type: Joi.string()
    .valid("dns", "dn", "email", "ip", "url", "guid", "upn", "id")
    .required(),
  value: Joi.string().required(),
}).meta({ className: "AlternativeName" });

export const CaCertificateConfigSchema = Joi.object({
  common_name: Joi.string().required(),
  organization: Joi.string().required(),
  organizational_unit: Joi.string(),
  country: Joi.string().length(2).required(),
  state: Joi.string(),
  locality: Joi.string(),
  validity_years: Joi.number().required(),
  alternative_names: Joi.array().items(AlternativeNameSchema).optional(),
  crl_distribution_points: Joi.array().items(Joi.string()).optional(),
}).meta({ className: "CaCertificateConfig" });

export const CrlConfigSchema = Joi.object({
  validity_years: Joi.number().required(),
}).meta({ className: "CrlConfig" });

export const CAConfigSchema = Joi.object({
  rootCaConfig: CaCertificateConfigSchema.required(),
  brokerConfig: CaCertificateConfigSchema.required(),
  deviceConfig: CaCertificateConfigSchema.required(),
  crlConfig: CrlConfigSchema.required(),
}).meta({ className: "CaConfig" });

export const AppConfigSchema = Joi.object({
  adServerConfig: ServiceConfigSchema.required(),
  dataServiceConfig: ServiceConfigSchema.required(),
  dbConfig: DbConfigSchema.required(),
  iotCertificateServiceConfig: ServiceConfigSchema.required(),
  kioskInventoryServiceConfig: ServiceConfigSchema.required(),
  proxyServiceConfig: ServiceConfigSchema.required(),
  reelsConfig: ServiceConfigSchema.required(),
  transactionServiceConfig: ServiceConfigSchema.required(),
  mqttConfig: ServiceConfigSchema.required(),
  loginInfo: LoginInfoSchema.required(),
  caConfig: CAConfigSchema.required(),
}).meta({ className: "AppConfig" });

export const KioskBaseRequestSchema = Joi.object({
  MessageId: Joi.string(),
  KioskId: Joi.number(),
  SendToTable: Joi.boolean().optional(),
}).meta({ className: "KioskBaseRequest" });
