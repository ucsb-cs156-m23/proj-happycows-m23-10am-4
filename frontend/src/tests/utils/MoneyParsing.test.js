import { parseMoney } from 'main/utils/MoneyParsing.js';

describe('parseMoney function', () => {
    it('should return "0" if the value is less than to 0.01', () => {
        expect(parseMoney(0)).toBe("0");
        expect(parseMoney(-2.3)).toBe("0");
        expect(parseMoney(-100)).toBe("0");
        expect(parseMoney(0.02)).toBe("0.020");
        expect(parseMoney(0.01)).toBe("0.010");
        expect(parseMoney(0.005)).toBe("0");
    });

    it('should correctly format values using SI prefixes', () => {
        expect(parseMoney(1000)).toBe("1.000K");
        expect(parseMoney(1552)).toBe("1.552K");
        expect(parseMoney(1552000)).toBe("1.552M");
        expect(parseMoney(45645000000)).toBe("45.645B");
        expect(parseMoney(45645_000_000_000)).toBe("45.645T");
        expect(parseMoney(45645_000_000_000_000)).toBe("45.645P");
        expect(parseMoney(45645_000_000_000_000_000)).toBe("45.645E");
        expect(parseMoney(45645_000_000_000_000_000_000)).toBe("45.645Z");
        expect(parseMoney(45645_000_000_000_000_000_000_000)).toBe("45.645Y");
        expect(parseMoney(123456_000_000_000_000_000_000_000_000)).toBe("123.456R");
        expect(parseMoney(123456_000_000_000_000_000_000_000_000_000)).toBe("123.456Q");
    });

    it('should return the input value formatted to 3 decimal places if no prefix applies', () => {

        expect(parseMoney(999)).toBe("999.000");
        expect(parseMoney(123.23)).toBe("123.230");
    });
});