import { ResponseParser } from "../parser/responseParser";

export class DefaultParser<T> implements ResponseParser<T> {
    async parse(response: Response): Promise<T> {
        const result: T = await response.json();
        return result
    }
}
