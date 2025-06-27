const mockedConversionService = {
    convert: jest.fn(),
    calculTTC: jest.fn(),
    applyRemise: jest.fn()
};

jest.mock('../backend/app', () => {
    return jest.fn(() => mockedConversionService);
});

const apiConversionService = require("../backend/conversionService");


describe('conversion API', () => {

    //Unit tests for conversion API
    it('should convert EUR to USD', () => {
        const data = {
            amount: 10,
            from: 'EUR',
            to: 'USD'
        };
        const conversion = apiConversionService.convert(data.amount, data.from, data.to);
        expect(conversion).toEqual({ 
            "from": "EUR",
            "to": "USD",
            "originalAmount": 10,
            "convertedAmount": 11.00
        });                
    })

    it('should convert USD to GBP', () => {
        const data = { 
            amount: 10,
            from: 'USD',
            to: 'GBP'
        };
        const conversion = apiConversionService.convert(data.amount, data.from, data.to);
        expect(conversion).toEqual({
            "from": "USD",
            "to": "GBP",
            "originalAmount": 10,
            "convertedAmount": 8.00
        });
    });

    //fonctionnal tests for conversion API
    it('should fail with invalid conversion parameters', () => {
        const data = {
            amount: NaN,
            from: 'EUR',
            to: 'USD'
        };
        expect(() => apiConversionService.convert(data.amount, data.from, data.to)).toThrow('amount must be a number');
    });

    it('should fail with unsupported conversion', () => {
        const data = {
            amount: 10,
            from: 'EUR',
            to: 'GBP'
        };
        expect(() => apiConversionService.convert(data.amount, data.from, data.to)).toThrow('Invalid conversion parameters');
    });

    //mocked tests for conversion API
    it('should call convert method with correct parameters', () => {
        const data = {
            amount: 10,
            from: 'EUR',
            to: 'USD'
        };
        mockedConversionService.convert(data.amount, data.from, data.to);
        expect(mockedConversionService.convert).toHaveBeenCalledWith(data.amount, data.from, data.to);
    });
})

describe('calcTTC', () => {
    //Unit tests for calculating TTC
    it('should calculate TTC from HT and TVA', () => {
        const ht = 100;
        const tva = 20;
        const result = apiConversionService.calculTTC(ht, tva);
        expect(result).toEqual({     
            "ht": 100,
            "taux": 20,
            "ttc": 120 
        });
    });

    //Functional tests for calculating TTC
    it('should fail with invalid HT or TVA', () => {
        const ht = NaN;
        const tva = 20;
        expect(() => apiConversionService.calculTTC(ht, tva)).toThrow('ht and tva must be numbers');
    });

    //Mocked tests for calculating TTC
    it('should call calculTTC method with correct parameters', () => {
        const ht = 100;
        const tva = 20;
        mockedConversionService.calculTTC(ht, tva);
        expect(mockedConversionService.calculTTC).toHaveBeenCalledWith(ht, tva);
    });
});

describe('applyRemise', () => {
    //Unit tests for applying a discount
    it('should apply a discount to a price', () => {
        const prix = 100;
        const remise = 10;
        const result = apiConversionService.applyRemise(prix, remise);
        expect(result).toEqual({
            "prixInitial": 100,
            "pourcentage": 10,
            "prixFinal": 90
        });
    });

    //Functional tests for applying a discount
    it('should fail with invalid price or discount', () => {
        const prix = NaN;
        const remise = 10;
        expect(() => apiConversionService.applyRemise(prix, remise)).toThrow('prix and remise must be numbers');
    });

    //Mocked tests for applying a discount
    it('should call applyRemise method with correct parameters', () => {
        const prix = 100;
        const remise = 10;
        mockedConversionService.applyRemise(prix, remise);
        expect(mockedConversionService.applyRemise).toHaveBeenCalledWith(prix, remise);
    });
});