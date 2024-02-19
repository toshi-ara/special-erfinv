import { erfinv, erfcinv } from "../dist/esm/index.js";


describe("erfinv / erfcinv functions", () => {
    let digits = 15;

    it("Check erfinv function", () => {
        // results by erfinv function in Julia SpecialFunction package
        expect(erfinv(0.001)).toBeCloseTo(0.0008862271574665522, digits);
        expect(erfinv(0.01)).toBeCloseTo(0.008862501280950598, digits);
        expect(erfinv(0.1)).toBeCloseTo(0.08885599049425769, digits);
        expect(erfinv(0.2)).toBeCloseTo(0.17914345462129166, digits);
        expect(erfinv(0.4)).toBeCloseTo(0.37080715859355795, digits);
        expect(erfinv(0.7)).toBeCloseTo(0.7328690779592167, digits);
        expect(erfinv(0.85)).toBeCloseTo(1.0179024648320276, digits);
        expect(erfinv(0.9)).toBeCloseTo(1.1630871536766738, digits);
        expect(erfinv(0.95)).toBeCloseTo(1.3859038243496802, digits - 1);
        expect(erfinv(0.99)).toBeCloseTo(1.8213863677184527, digits - 1);
        expect(erfinv(0.999)).toBeCloseTo(2.3267537655135273, digits - 1);
    });

    it("Check erfcinv function", () => {
        // results by erfcinv function in Julia SpecialFunction package
        expect(erfcinv(0.001)).toBeCloseTo(2.326753765513528, digits - 1);
        expect(erfcinv(0.01)).toBeCloseTo(1.8213863677184527, digits - 1);
        expect(erfcinv(0.1)).toBeCloseTo(1.1630871536766738, digits);
        expect(erfcinv(0.2)).toBeCloseTo(0.9061938024368231, digits);
        expect(erfcinv(0.4)).toBeCloseTo(0.5951160814499948, digits);
        expect(erfcinv(0.7)).toBeCloseTo(0.2724627147267544, digits);
        expect(erfcinv(0.85)).toBeCloseTo(0.13372692166481973, digits);
        expect(erfcinv(0.9)).toBeCloseTo(0.08885599049425767, digits);
        expect(erfcinv(0.95)).toBeCloseTo(0.04434038791000554, digits);
        expect(erfcinv(0.99)).toBeCloseTo(0.008862501280950607, digits);
        expect(erfcinv(0.999)).toBeCloseTo(0.000886227157466553, digits);
    });
});

