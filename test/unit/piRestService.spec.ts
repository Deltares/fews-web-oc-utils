import 'cross-fetch/polyfill';
import fetchMock from "fetch-mock";
import {PiRestService} from "../../src";

import expectedLocations from './mock/locations.json'

async function transformRequest(request: Request): Promise<Request> {
    const requestInit: RequestInit = {
        // Only some of the properties of RequestInit are used by fetch-mock, such as 'headers'.
        headers: { 'Content-Type': "application/json" },
    }
    const newRequest = new Request(request, requestInit)
    return newRequest
}

async function transformRequestWithToken(request: Request): Promise<Request> {
    const requestInit: RequestInit = {
        // Only some of the properties of RequestInit are used by fetch-mock, such as 'headers'.
        headers: { 
            'Content-Type': "application/json",
            'Authorization': "Bearer testtoken"
        },
    }
    const newRequest = new Request(request, requestInit)
    return newRequest
}

const baseUrl = process.env.TEST_URL || "";

describe("pi rest service", function () {

    afterAll(function () {
        fetchMock.restore();
    });

    it("Get Locations", async function () {
        fetchMock.get("https://mock.dev/fewswebservices/rest/fewspiservice/v1/locations?documentFormat=PI_JSON", {
            status: 200,
            body: JSON.stringify(expectedLocations)
        });
        const provider = new PiRestService(baseUrl, transformRequestWithToken)
        const res = await provider.getData("https://mock.dev/fewswebservices/rest/fewspiservice/v1/locations?documentFormat=PI_JSON" )
        expect(res.data).not.toBeNull();
        expect(res.data).toStrictEqual(expectedLocations);
        expect(res.errorMessage).toBe(undefined)
        expect(res.responseCode).toStrictEqual(200)
        const requestInit = {} as RequestInit;
        requestInit.headers = { 'Content-Type': "application/json" };
        const resWithRequestInit = await provider.getDataWithRequestInit("https://mock.dev/fewswebservices/rest/fewspiservice/v1/locations?documentFormat=PI_JSON", requestInit )
        expect(resWithRequestInit.data).not.toBeNull();
        expect(fetchMock.lastCall()?.request?.headers.get('Content-Type')).toBe("application/json")
        expect(resWithRequestInit.data).toStrictEqual(expectedLocations);
        const transformProvider = new PiRestService(baseUrl, transformRequest)
        const resWithTransformedRequest = await transformProvider.getData("https://mock.dev/fewswebservices/rest/fewspiservice/v1/locations?documentFormat=PI_JSON" )
        expect(resWithTransformedRequest.data).not.toBeNull();
        expect(fetchMock.lastCall()?.request?.headers.get('Content-Type')).toBe("application/json")
        expect(resWithTransformedRequest.data).toStrictEqual(expectedLocations);
    })
    it("Get Locations Not Found", async function () {
        fetchMock.get("https://mock.dev/fewswebservices/rest/fewspiservice/v1/locations", {
            status: 400, body: JSON.stringify("not found")
        });
        const provider = new PiRestService(baseUrl)
        const res = await provider.getData("https://mock.dev/fewswebservices/rest/fewspiservice/v1/locations")
        expect(res.errorMessage).toBe("Bad Request")
        expect(res.responseCode).toStrictEqual(400)
    })
    it("Get Locations Invalid JSON response", async function () {
        fetchMock.get("https://mock.dev/fewswebservices/rest/fewspiservice/v1/locations?invalid", {
            status: 200, body: "{"
        });
        const provider = new PiRestService(baseUrl)
        try {
            await provider.getData("https://mock.dev/fewswebservices/rest/fewspiservice/v1/locations?invalid")
        } catch (error: any) {
            expect(error.message).toContain(" When loading https://mock.dev/fewswebservices/rest/fewspiservice/v1/locations?invalid")
        }
    });
})
