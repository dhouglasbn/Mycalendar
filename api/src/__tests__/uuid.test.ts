import { v4 as uuid } from "uuid";

describe("uuid", () => {
    it("Should be able to create a uuid key", () => {
        const id = uuid();

        expect(id).toHaveLength(36);
    })
})