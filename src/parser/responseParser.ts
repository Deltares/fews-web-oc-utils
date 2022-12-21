export interface ResponseParser<T> {
    parse(response: Response): Promise<T>;
}
