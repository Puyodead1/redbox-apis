export interface User {
  cpn: string;
  signupDate: string;
  firstName: string | null;
  emailAddress: string | null;
  phoneNumber: string | null;
  password: string;
  pin: string | null;
  hashed: boolean;
  disabled?: boolean;
  loyalty: {
    pointBalance: number;
    currentTier: string;
    tierCounter: number;
  };
  promoCodes: any[];
}

export interface Store {
  Id: number;
  Address: string;
  City: string;
  State: string;
  ZipCode: string;
  DueTime: string;
  MarketName: string;
  KaseyaMarketName: string;
  BannerId: string;
  StateId: string;

  Banner?: string;
}

export interface Banner {
  Id: number;
  Name: string;
}