import DataRequestResult from "./dataRequestResult.js";
import {ResponseParser} from "../parser/responseParser.js";
import {DefaultParser} from "../parser/defaultParser.js";
import {RequestOptions} from "./requestOptions.js";

export interface TransformRequestFunction {
    (request: Request): Promise<Request>;
}

export class PiRestService {
    private readonly webserviceUrl: string;
    private transformRequest: TransformRequestFunction;
    private _oauth2Token: string | undefined = undefined;

    set oauth2Token(value: string) {
        this._oauth2Token = value;
    }

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
        if (this._oauth2Token !== undefined) {
            requestParameters.headers = {"Authorization": "Bearer " + this._oauth2Token}
        }
        const request = new Request(requestUrl, requestParameters);
        const res = await fetch(await this.transformRequest(request));
        return await this.processResponse(dataRequestResult, res, requestUrl, parser);
    }

    public async getData<T>(url: string): Promise<DataRequestResult<T>> {
        const requestOption = new RequestOptions()
        requestOption.relativeUrl = !url.startsWith("http")
        return this.getDataWithParser(url, requestOption, new DefaultParser());
    }

    private async processResponse<T>(dataRequestResult: DataRequestResult<T>, res: Response, url: string, parser: ResponseParser<T>): Promise<DataRequestResult<T>> {
        dataRequestResult.responseCode = res.status;
        if (res.status != 200) {
            dataRequestResult.errorMessage = res.statusText;
            return dataRequestResult;
        }
        try {
            dataRequestResult.data = await parser.parse(res);
        } catch (e: any) {
            e.message += `\n When loading ${url}.`
            throw e;
        }
        return dataRequestResult;
    }

    public async getDataWithRequestInit<T>(url: string, requestInit: RequestInit): Promise<DataRequestResult<T>> {
        const dataRequestResult = {} as DataRequestResult<T>;
        if (this._oauth2Token !== undefined) {
            const authorizationHeader = {"Authorization": "Bearer " + this._oauth2Token};
            requestInit.headers = {...authorizationHeader, ...requestInit.headers};
        }
        const request = new Request(url, requestInit);
        const res = await fetch(await this.transformRequest(request));
        return await this.processResponse(dataRequestResult, res, url, new DefaultParser());
    }
}
