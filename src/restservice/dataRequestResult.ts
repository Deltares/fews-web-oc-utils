export default interface DataRequestResult<T> {
    responseCode: number;
    contentType: string | null;
    data: T;

}
