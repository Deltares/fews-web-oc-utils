export default interface DataRequestResult<T> {
    responseCode: number;
    errorMessage: string;
    data: T;

}
