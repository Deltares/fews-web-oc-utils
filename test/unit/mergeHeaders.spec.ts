import { mergeHeaders } from "../../src/request/mergeHeaders.js"

describe("mergeHeaders", () => {
    it("should merge two sets of headers correctly; one overlapping property", () => {
        const headers1 = new Headers();
        headers1.set("Content-Type", "application/json");
        headers1.set("Authorization", "Bearer token1");

        const headers2 = new Headers();
        headers2.set("Authorization", "Bearer token2");
        headers2.set("X-Custom-Header", "custom value");

        const mergedHeaders = mergeHeaders(headers1, headers2);

        expect(mergedHeaders.get("Content-Type")).toBe("application/json");
        expect(mergedHeaders.get("Authorization")).toBe("Bearer token2");
        expect(mergedHeaders.get("X-Custom-Header")).toBe("custom value");
    });

    it("should merge two disjoint sets of headers correctly", () => {
        const headers1 = new Headers({"Content-Type": "application/json"});

        const headers2 = new Headers({"Authorization": "Bearer token"});

        const mergedHeaders = mergeHeaders(headers1, headers2);

        expect(mergedHeaders.get("Content-Type")).toBe("application/json");
        expect(mergedHeaders.get("Authorization")).toBe("Bearer token");
        expect(mergedHeaders).not.toBe(headers1);
        expect(mergedHeaders).not.toBe(headers2);
    });
});
