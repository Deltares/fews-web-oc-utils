import 'cross-fetch/polyfill';
import PiRestService from "../../src/restservice/piRestService";
import DataRequestResult from "../../src/restservice/dataRequestResult";

const baseUrl = process.env.TEST_URL || "";

describe("pi rest service", function () {
    it("get locations", async function () {
        const provider = new PiRestService(baseUrl);
        const res = await provider.getData<DataRequestResult<any>>(baseUrl + "/rest/fewspiservice/v1/locations?documentFormat=PI_JSON");
        expect(res.data).not.toBeNull()

    });
})