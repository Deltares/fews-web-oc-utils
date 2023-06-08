import 'cross-fetch/polyfill';
import {DefaultParser} from "../../src/parser/defaultParser.js";
import {PiRestService} from "../../src/restservice/piRestService.js";
import {RequestOptions} from "../../src/restservice/requestOptions.js";
import DataRequestResult from "../../src/restservice/dataRequestResult.js";

const baseUrl = process.env.TEST_URL || "";

describe("pi rest service: GET", function () {
    it("get locations", async function () {
        const provider = new PiRestService(baseUrl);
        const res = await provider.getData<DataRequestResult<unknown>>(baseUrl + "/rest/fewspiservice/v1/locations?documentFormat=PI_JSON");
        expect(res.data).not.toBeNull()

    })
    it("get locations with default parser and absolute url", async function () {
        const provider = new PiRestService(baseUrl);
        const requestOptions = new RequestOptions();
        requestOptions.relativeUrl = false
        const res = await provider.getDataWithParser<DataRequestResult<unknown>>(baseUrl + "/rest/fewspiservice/v1/locations?documentFormat=PI_JSON", requestOptions, new DefaultParser());
        expect(res.data).not.toBeNull()
    })
    it("get locations with default parser and relative url", async function () {
        const provider = new PiRestService(baseUrl);
        const requestOptions = new RequestOptions();
        const res = await provider.getDataWithParser<DataRequestResult<unknown>>(  "/rest/fewspiservice/v1/locations?documentFormat=PI_JSON", requestOptions, new DefaultParser());
        expect(res.data).not.toBeNull()
    })
})

describe("pi rest service: POST", function () {
    it("post timeseries/edit", async function () {
        const provider = new PiRestService(baseUrl)
        const res = await provider.postData<DataRequestResult<unknown>>(baseUrl + "/rest/fewspiservice/v1/timeseries/edit?timeSeriesSetIndex=0&locationId=test", JSON.stringify({
            "test": "teste2e",
        }));
        const c = res.data
        expect(res.data).not.toBeNull()
        // add expect to check if data is not undefined
        // expect(res.data).not.toBeUndefined()
    }
    )
})