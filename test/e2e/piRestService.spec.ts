import 'cross-fetch/polyfill'
import { describe, expect, it } from 'vitest'

import { DefaultParser } from '../../src/parser/defaultParser.js'
import { PlainTextParser } from '../../src/parser/plainTextParser.js'
import { PiRestService } from '../../src/restservice/piRestService.js'
import { RequestOptions } from '../../src/restservice/requestOptions.js'
import DataRequestResult from '../../src/restservice/dataRequestResult.js'

const baseUrl = process.env.DOCKER_URL || ''

describe('pi rest service: GET', function () {
  it('get locations', async function () {
    const provider = new PiRestService(baseUrl)
    const res = await provider.getData<DataRequestResult<unknown>>(
      baseUrl + '/rest/fewspiservice/v1/locations?documentFormat=PI_JSON'
    )
    expect(res.data).not.toBeNull()
  })
  it('get locations with default parser and absolute url', async function () {
    const provider = new PiRestService(baseUrl)
    const requestOptions = new RequestOptions()
    requestOptions.relativeUrl = false
    const res = await provider.getDataWithParser<DataRequestResult<unknown>>(
      baseUrl + '/rest/fewspiservice/v1/locations?documentFormat=PI_JSON',
      requestOptions,
      new DefaultParser()
    )
    expect(res.data).not.toBeNull()
  })
  it('get locations with default parser and relative url', async function () {
    const provider = new PiRestService(baseUrl)
    const requestOptions = new RequestOptions()
    const res = await provider.getDataWithParser<DataRequestResult<unknown>>(
      '/rest/fewspiservice/v1/locations?documentFormat=PI_JSON',
      requestOptions,
      new DefaultParser()
    )
    expect(res.data).not.toBeNull()
  })
})

describe('pi rest service: POST', function () {
  it('post timeseries/edit', async function () {
    const provider = new PiRestService(baseUrl)
    const res = await provider.postData<DataRequestResult<unknown>>(
      baseUrl +
        '/rest/fewspiservice/v1/timeseries/edit?timeSeriesSetIndex=0&locationId=test',
      JSON.stringify({
        test: 'teste2e'
      })
    )
    const c = res.data
    expect(res.data).not.toBeNull()
    // add expect to check if data is not undefined
    // expect(res.data).not.toBeUndefined()
  })
})

describe('pi rest service localhost: POST timeseries/edit', function () {
  it('post timeseries/edit', async function () {
    const headers = {
      'Content-Type': 'application/json'
    }
    const provider = new PiRestService(baseUrl)
    const res = await provider.postData<DataRequestResult<unknown>>(
      '/rest/fewspiservice/v1/timeseries/edit?timeSeriesSetIndex=42&locationId=test',
      JSON.stringify({
        test: 'teste2e'
      }),
      headers
    )
    const c = res.data
    expect(res.data).not.toBeNull()
    // add expect to check if data is not undefined
    // expect(res.data).not.toBeUndefined()
  })
})

describe('pi rest service localhost: POST timeseries in PI XML format', function () {
  it('post timeseries/edit', async function () {
    const headers = {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
    const piXmlContent =
      '<?xml version="1.0" encoding="UTF-8"?>\n' +
      '<TimeSeries xmlns="http://www.wldelft.nl/fews/PI" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.wldelft.nl/fews/PI https://fewsdocs.deltares.nl/schemas/version1.0/pi-schemas/pi_timeseries.xsd" version="1.27" xmlns:fs="http://www.wldelft.nl/fews/fs">\n' +
      '    <timeZone>0.0</timeZone>\n' +
      '    <series>\n' +
      '        <header>\n' +
      '            <type>instantaneous</type>\n' +
      '            <moduleInstanceId>Coastal_Process_Astro</moduleInstanceId>\n' +
      '            <locationId>5028N331W</locationId>\n' +
      '            <parameterId>H.astronomical</parameterId>\n' +
      '            <qualifierId>HighTide</qualifierId>\n' +
      '            <timeStep unit="nonequidistant"/>\n' +
      '            <startDate date="2021-06-24" time="08:00:00"/>\n' +
      '            <endDate date="2021-06-25" time="09:00:00"/>\n' +
      '            <missVal>-999.0</missVal>\n' +
      '            <stationName>Torquay Astro</stationName>\n' +
      '            <lat>50.46667804024676</lat>\n' +
      '            <lon>-3.533324439637471</lon>\n' +
      '            <x>291274.0</x>\n' +
      '            <y>64107.0</y>\n' +
      '            <units>m</units>\n' +
      '        </header>\n' +
      '    </series>\n' +
      '</TimeSeries>    \n'
    const piXmlEncoded =
      'piTimeSeriesXmlContent=' + encodeURIComponent(piXmlContent)
    const requestOption = new RequestOptions()
    const provider = new PiRestService(baseUrl)
    const res = await provider.postDataWithParser<DataRequestResult<string>>(
      '/rest/fewspiservice/v1/timeseries',
      requestOption,
      new PlainTextParser(),
      piXmlEncoded,
      headers
    )
    expect(res.data).not.toBeNull()
    // expect(res.data).not.toBeUndefined()
    // expect(res.responseCode).toBe(200)
    // expect(res.contentType).toBe("application/xml")
  })
})

describe('pi rest service localhost: POST timeseries in PI JSON format', function () {
  it('post timeseries/edit', async function () {
    const headers = {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
    const diagnosticsResponse = `<?xml version="1.0" encoding="UTF-8"?>
<Diag xmlns="http://www.wldelft.nl/fews/PI" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.wldelft.nl/fews/PI https://fewsdocs.deltares.nl/schemas/version1.0/pi-schemas/pi_diag.xsd" version="1.2">
    <line level="3" description="Import.Info: 0 time series imported, 1 time series rejected"/>
</Diag>`
    const piJsonContent = `{
              "version" : "1.23",
              "timeZone" : "0.0",
              "timeSeries" : [ {
                "header" : {
                  "type" : "instantaneous",
                  "moduleInstanceId" : "ImportObserved",
                  "locationId" : "63306260000",
                  "parameterId" : "T.obs.mean",
                  "timeStep" : {
                    "unit" : "nonequidistant"
                  },
                  "startDate" : {
                    "date" : "2013-01-01",
                    "time" : "00:00:00"
                  },
                  "endDate" : {
                    "date" : "2013-02-01",
                    "time" : "00:00:00"
                  },
                  "missVal" : "-999.0",
                  "stationName" : "DE BILT",
                  "lat" : "52.1",
                  "lon" : "5.18",
                  "x" : "5.18",
                  "y" : "52.1",
                  "z" : "15.0",
                  "units" : "oC"
                },
                "events" : [ {
                  "date" : "2013-01-01",
                  "time" : "00:00:00",
                  "value" : "2",
                  "flag" : "0"
                }, {
                  "date" : "2013-02-01",
                  "time" : "00:00:00",
                  "value" : "1.7",
                  "flag" : "0"
                }]
              } ]
            }`

    const piJsonEncoded =
      'piTimeSeriesJsonContent=' + encodeURIComponent(piJsonContent)
    const requestOption = new RequestOptions()
    const provider = new PiRestService(baseUrl)
    const res = await provider.postDataWithParser<DataRequestResult<string>>(
      '/rest/fewspiservice/v1/timeseries',
      requestOption,
      new PlainTextParser(),
      piJsonEncoded,
      headers
    )
    // The response will be xml. Get it as plain text using plain text parser.
    expect(res.data).not.toBeNull()
    // expect(res.data).not.toBeUndefined()
    // expect(res.responseCode).toBe(200)
    // expect(res.contentType).toBe("application/xml")
    // expect(res.data).toEqual(diagnosticsResponse)
  })
})
