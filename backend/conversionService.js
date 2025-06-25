const EUR_TO_USD = 1.1;
const USD_TO_GBP = 0.8;

// Fonctions métier
function convert(amount, from, to) {
    if (isNaN(amount)) {
        throw new Error('amount must be a number');
    }
    if (from === 'EUR' && to === 'USD') {
        return {
            from,
            to,
            originalAmount: amount,
            convertedAmount: +(amount * EUR_TO_USD).toFixed(2)
        };
    } else if (from === 'USD' && to === 'GBP') {
        return {
            from,
            to,
            originalAmount: amount,
            convertedAmount: +(amount * USD_TO_GBP).toFixed(2)
        };
    } else {
        throw new Error('Invalid conversion parameters');
    }
}

function calculTTC(ht, tva) {
    if (isNaN(ht) || isNaN(tva)) {
        throw new Error('ht and tva must be numbers');
    }
    return {ht, taux: tva, ttc: +(ht * (1 + tva / 100)).toFixed(2)};
}

function applyRemise(prix, remise) {
    if (isNaN(prix) || isNaN(remise)) {
        throw new Error('prix and remise must be numbers');
    }
    return {prixInitial: prix, pourcentage: remise, prixFinal: +(prix * (1 - remise / 100)).toFixed(2)};
}

module.exports = { convert, calculTTC, applyRemise };