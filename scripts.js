let prices = [];
let currentIndex = 0;

async function fetchCryptoPrices() {
    try {
        const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,solana,pax-gold&vs_currencies=usd');
        const data = await response.json();
        prices = [
            `BTC: $${data.bitcoin.usd.toFixed(2)}`,
            `SOL: $${data.solana.usd.toFixed(2)}`,
            `PAXG: $${data['pax-gold'].usd.toFixed(2)}`
        ];
        updatePrice();
    } catch (error) {
        document.getElementById('crypto-prices').innerHTML = 'Error loading prices';
    }
}

function updatePrice() {
    if (prices.length > 0) {
        const priceElement = document.getElementById('crypto-prices');
        priceElement.innerHTML = prices[currentIndex];
        currentIndex = (currentIndex + 1) % prices.length;
    }
}

function copyContract() {
    const contract = document.getElementById('token-contract').textContent.replace('Token Contract: ', '');
    navigator.clipboard.writeText(contract).then(() => {
        alert('Token contract copied to clipboard!');
    });
}

setInterval(updatePrice, 10000); // Muda o preço a cada 10 segundos
setInterval(fetchCryptoPrices, 60000); // Atualiza os preços a cada 1 minuto
window.onload = fetchCryptoPrices;
