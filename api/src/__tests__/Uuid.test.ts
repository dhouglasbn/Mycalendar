import { v4 as uuid } from "uuid";

describe("uuid", () => {
    it("Should be able to create a uuid key", () => {
        // atribuindo uma chave uuid com a função respectiva
        const id = uuid();

        // espera-se que minha id tenha um comprimento de 36 caracteres(v4)
        expect(id).toHaveLength(36);
    })
})