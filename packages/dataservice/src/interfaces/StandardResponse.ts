export default interface StandardResponse {
    Success: boolean;
    Errors: Error[];
    StatusCode: number;
}

interface Error {
    Code: string;
    Message: string;
}
