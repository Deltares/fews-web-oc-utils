import {ResponseParser} from "../parser/responseParser.js";

export class DefaultParser<T> implements ResponseParser<T> {
    async parse(response: Response): Promise<T> {
        return await response.json() as T
    }
}
