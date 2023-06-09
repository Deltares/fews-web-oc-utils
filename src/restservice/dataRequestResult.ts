export default interface DataRequestResult<T> {
    responseCode: number;
    contentType: string | null;
    errorMessage: string;
    data: T;

}
