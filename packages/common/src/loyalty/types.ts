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