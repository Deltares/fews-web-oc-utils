import 'cross-fetch/polyfill';
import {DefaultParser, PiRestService, RequestOptions} from "../../src";
import DataRequestResult from "../../src/restservice/dataRequestResult";

const baseUrl = process.env.TEST_URL || "";

describe("pi rest service", function () {
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
