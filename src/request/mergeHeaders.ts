/**
 * Merges two sets of headers into a single set of headers. The properties in the second set of headers take precedence over the properties in the first set of headers.
 * @param {Headers} headers1 - The first set of headers. Properties in this set of headers are overridden by the same properties in the second set of headers, if present.
 * @param {Headers} headers2 - The second set of headers. Properties in this set of headers take precedence over properties in the first set of headers.
 * @returns The merged set of headers.
 */
export function mergeHeaders(headers1: Headers, headers2: Headers): Headers {
    const mergedHeaders = new Headers()
    headers1.forEach((value, key) => {
      mergedHeaders.set(key, value)
    })
    headers2.forEach((value, key) => {
      mergedHeaders.set(key, value)
    })
    return mergedHeaders
  }