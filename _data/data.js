const fetch = require('node-fetch');
const fs = require('fs');
const priceFilePath = 'price.txt', red = 'rgba(227, 82, 65)', green = 'rgba(125, 233, 178)'; 

module.exports = function() {
    return fetch('https://api.coincap.io/v2/rates/bitcoin')
    .then(res => res.json())
    .then(json => process(json.data))
    .catch(err => console.log(err));
}

function process({rateUsd}) {
    const previousRateUsd = getPreviousRate();
    const isPriceIncreased = rateUsd >= previousRateUsd;
    
    save(rateUsd);

    return {
        rate: new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(rateUsd),
        backgroundColor: isPriceIncreased ? green : red
    };
}

function getPreviousRate() {
    return fs.existsSync(priceFilePath) ? fs.readFileSync(priceFilePath) : 0;
}

function save(rateUsd) {
    fs.writeFileSync(priceFilePath, rateUsd);
}