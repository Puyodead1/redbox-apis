import stateData from "./states.json";
import storeData from "./stores.json";

interface IStore {
    Id: number;
    Address: string;
    City: string | null;
    State: string | null;
    ZipCode: string | null;
    DueTime: string | null;
    MarketName: string | null;
    KaseyaMarketName: string | null;
    BannerId: string | null;
    StateId: string | null;
}

interface IState {
    Id: number;
    Description: string;
}

export const stores: IStore[] = storeData as any;

export const states: IState[] = stateData as any;
