import {ResponseParser} from "../parser/responseParser.js";

export class PlainTextParser<T> implements ResponseParser<T> {
    async parse(response: Response): Promise<T> {
        const text = await response.text()
        return text as never;
    }
}
