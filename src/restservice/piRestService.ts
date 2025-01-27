import DataRequestResult from "./dataRequestResult.js";
import {RequestOptions} from "./requestOptions.js";
import {ResponseParser} from "../parser/responseParser.js";
import {DefaultParser} from "../parser/defaultParser.js";

export interface TransformRequestFunction {
    (request: Request): Promise<Request>;
}

export class PiRestService {
    private readonly webserviceUrl: string;
    private transformRequest: TransformRequestFunction;

    constructor(webserviceUrl: string, transformRequestFn?: TransformRequestFunction) {
        this.webserviceUrl = webserviceUrl;
        if (transformRequestFn !== undefined) {
            this.transformRequest = transformRequestFn
        } else {
            async function transformRequestFn(request: Request): Promise<Request> {
                return request
            }
            this.transformRequest = transformRequestFn
        }
    }

    public async getDataWithParser<T>(url: string, requestOption: RequestOptions, parser: ResponseParser<T>): Promise<DataRequestResult<T>> {
        const requestUrl = requestOption.relativeUrl ? this.webserviceUrl + url : url;
        const dataRequestResult = {} as DataRequestResult<T>;
        const requestParameters = {} as RequestInit;
        requestParameters.method = "GET";
        const request = new Request(requestUrl, requestParameters);
        const res = await fetch(await this.transformRequest(request));
        if (!res.ok) throw new Error('Fetch Error', { cause: res })
        return await this.processResponse(dataRequestResult, res, requestUrl, parser);
    }

    public async postDataWithParser<T>(url: string, requestOption: RequestOptions, parser: ResponseParser<T>, body: any, headers: HeadersInit): Promise<DataRequestResult<T>> {
        const requestUrl = requestOption.relativeUrl ? this.webserviceUrl + url : url;
        const dataRequestResult = {} as DataRequestResult<T>;
        const requestParameters = {} as RequestInit;
        requestParameters.method = "POST";
        requestParameters.body = body;
        requestParameters.headers = headers;
        const request = new Request(requestUrl, requestParameters);
        const res = await fetch(await this.transformRequest(request));
        if (!res.ok) throw new Error('Fetch Error', { cause: res })
        return await this.processResponse(dataRequestResult, res, requestUrl, parser);
    }

    public async getData<T>(url: string): Promise<DataRequestResult<T>> {
        const requestOption = new RequestOptions()
        requestOption.relativeUrl = !url.startsWith("http")
        return this.getDataWithParser(url, requestOption, new DefaultParser());
    }

    public async postData<T>(url: string, body: any, headers: HeadersInit = { "Content-Type": "application/json" }): Promise<DataRequestResult<T>> {
        const requestOption = new RequestOptions()
        requestOption.relativeUrl = !url.startsWith("http")
        return this.postDataWithParser(url, requestOption, new DefaultParser(), body, headers);
    }

    private async processResponse<T>(dataRequestResult: DataRequestResult<T>, res: Response, url: string, parser: ResponseParser<T>): Promise<DataRequestResult<T>> {
        dataRequestResult.responseCode = res.status;
        dataRequestResult.contentType = res.headers.get('content-type')
        try {
            dataRequestResult.data = await parser.parse(res);
        } catch (e: any) {
            throw new Error(`Parse Error for response ${url}.`, { cause: e });
        }
        return dataRequestResult;
    }
}
