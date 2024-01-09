import { skipExtension } from "./index.js";
import { describe, it, expect } from "vitest";

describe("#validate filename", () => {
    it("get file name without .csv", () => {
        expect(skipExtension("sabbir.csv")).toBe("sabbir");
        expect(skipExtension("ExampleTable")).toBe("ExampleTable");
    });
});
