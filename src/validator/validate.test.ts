import { validFileName } from "./index.js";
import { describe, it, expect } from "vitest";

describe("#validate filename", () => {
    it("get file name without .csv", () => {
        expect(validFileName("sabbir.csv")).toBe("sabbir");
        expect(validFileName("ExampleTable")).toBe("ExampleTable");
    });
});
