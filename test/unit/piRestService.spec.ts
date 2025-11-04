import 'cross-fetch/polyfill'
import fetchMock from 'fetch-mock'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

import { PiRestService } from '../../src/restservice/piRestService.js'
import { PlainTextParser } from '../../src/parser/plainTextParser.js'
import { RequestOptions } from '../../src/restservice/requestOptions.js'

import expectedLocations from './mock/locations.json'

async function transformRequest(request: Request): Promise<Request> {
  const requestInit: RequestInit = {
    // Only some of the properties of RequestInit are used by fetch-mock, such as 'headers'.
    headers: { 'Content-Type': 'application/json' }
  }
  const newRequest = new Request(request, requestInit)
  return newRequest
}

async function transformRequestWithToken(request: Request): Promise<Request> {
  const requestInit: RequestInit = {
    // Only some of the properties of RequestInit are used by fetch-mock, such as 'headers'.
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer testtoken'
    }
  }
  const newRequest = new Request(request, requestInit)
  return newRequest
}

const baseUrl = process.env.TEST_URL || ''

describe('pi rest service: GET', function () {
  beforeAll(() => fetchMock.mockGlobal())

  afterAll(() => {
    fetchMock.hardReset()
  })

  it('Get Locations', async function () {
    fetchMock.route(
      'https://mock.dev/fewswebservices/rest/fewspiservice/v1/locations?documentFormat=PI_JSON',
      {
        status: 200,
        body: JSON.stringify(expectedLocations)
      }
    )
    const provider = new PiRestService(baseUrl, transformRequestWithToken)
    const res = await provider.getData(
      'https://mock.dev/fewswebservices/rest/fewspiservice/v1/locations?documentFormat=PI_JSON'
    )
    expect(res.data).not.toBeNull()
    expect(res.data).toStrictEqual(expectedLocations)
    expect(res.responseCode).toStrictEqual(200)
    expect(
      fetchMock.callHistory.lastCall()?.request?.headers.get('Content-Type')
    ).toBe('application/json')
    const transformProvider = new PiRestService(baseUrl, transformRequest)
    const resWithTransformedRequest = await transformProvider.getData(
      'https://mock.dev/fewswebservices/rest/fewspiservice/v1/locations?documentFormat=PI_JSON'
    )
    expect(resWithTransformedRequest.data).not.toBeNull()
    expect(
      fetchMock.callHistory.lastCall()?.request?.headers.get('Content-Type')
    ).toBe('application/json')
    expect(resWithTransformedRequest.data).toStrictEqual(expectedLocations)
  })
  it('Get Locations Not Found', async function () {
    const mockReponse = {
      status: 400,
      body: JSON.stringify('not found')
    }
    fetchMock.route(
      'https://mock.dev/fewswebservices/rest/fewspiservice/v1/locations',
      mockReponse
    )
    const provider = new PiRestService(baseUrl)
    try {
      const res = provider.getData(
        'https://mock.dev/fewswebservices/rest/fewspiservice/v1/locations'
      )
      await expect(res).rejects.toThrow('Fetch Error');
    } catch (error: any) {
      expect(error).toBeInstanceOf(Error)
      expect(error.message).toBe('Fetch Error')

      // The cause will be a Response
      const response = error.cause as Response
      expect(response).toBeInstanceOf(Response)
      expect(response.status).toBe(400)

      const text = await response.text()
      expect(text).toBe('"not found"')
    }
  })
  it('Get Locations Invalid JSON response', async function () {
    fetchMock.route(
      'https://mock.dev/fewswebservices/rest/fewspiservice/v1/locations?invalid',
      {
        status: 200,
        body: '{'
      }
    )
    const provider = new PiRestService(baseUrl)
    const res = provider.getData(
      'https://mock.dev/fewswebservices/rest/fewspiservice/v1/locations?invalid'
    )
    await expect(res).rejects.toThrow(
      'Parse Error for response https://mock.dev/fewswebservices/rest/fewspiservice/v1/locations?invalid'
    )
  })
})

describe('pi rest service json body: POST', function () {
  beforeAll(() => {
    fetchMock.mockGlobal()

    fetchMock.post(
      'https://mock.dev/fewswebservices/rest/fewspiservice/v1/timeseries/edit',
      {
        status: 200,
        body: JSON.stringify({ responseCode: 200 })
      }
    )
  })

  afterAll(() => {
    fetchMock.hardReset()
  })

  it('Post timeseries/edit', async function () {
    const provider = new PiRestService(baseUrl)
    const res = await provider.postData(
      'https://mock.dev/fewswebservices/rest/fewspiservice/v1/timeseries/edit',
      JSON.stringify({ test: 'test' })
    )
    expect(res.data).not.toBeNull()
    expect(res.data).toStrictEqual({ responseCode: 200 })
    // check if headers are equal to default
    expect(
      fetchMock.callHistory.lastCall()?.request?.headers.get('Content-Type')
    ).toBe('application/json')
  })

  it('Post timeseries/edit with given headers', async function () {
    const provider = new PiRestService(baseUrl)
    const headers = {
      'Content-Type': 'application/ld+json'
    }
    const res = await provider.postData(
      'https://mock.dev/fewswebservices/rest/fewspiservice/v1/timeseries/edit',
      JSON.stringify({ test: 'test' }),
      headers
    )
    expect(res.data).not.toBeNull()
    expect(res.data).toStrictEqual({ responseCode: 200 })
    expect(
      fetchMock.callHistory.lastCall()?.request?.headers.get('Content-Type')
    ).toBe('application/ld+json')
  })
})

describe('pi rest service json urlencoded: POST', function () {
  beforeAll(() => {
    fetchMock.mockGlobal()
  })

  afterAll(() => {
    fetchMock.hardReset()
  })

  it('Post timeseries url encoded json post with text parser', async function () {
    fetchMock.post(
      'https://mock.dev/fewswebservices/rest/fewspiservice/v1/timeseries',
      {
        status: 200,
        body: '{}'
      }
    )
    const provider = new PiRestService(baseUrl)
    const headers = {
      'Content-Type': 'application/xml'
    }
    const requestOption = new RequestOptions()
    requestOption.relativeUrl = false
    const res = await provider.postDataWithParser(
      'https://mock.dev/fewswebservices/rest/fewspiservice/v1/timeseries',
      requestOption,
      new PlainTextParser(),
      JSON.stringify({ test: 'test' }),
      headers
    )
    expect(res.data).not.toBeNull()
    expect(res.data).toStrictEqual('{}')
    expect(res.responseCode).toBe(200)
    expect(
      fetchMock.callHistory.lastCall()?.request?.headers.get('Content-Type')
    ).toBe('application/xml')
  })
})
