export interface DataRequestResult<T> {
    responseCode: number;
    contentType: string | null;
    data: T;
}
