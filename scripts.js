let prices = [];
let currentIndex = 0;

async function fetchCryptoPrices() {
    try {
        // Requisição para a API do CoinGecko para pegar os preços do Bitcoin (BTC), Solana (SOL) e Paxos Gold (PAXG)
        const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,solana,pax-gold&vs_currencies=usd');
        const data = await response.json();
        
        // Verifica se a resposta da API contém os dados esperados e preenche o array `prices`
        if (data.bitcoin && data.solana && data['pax-gold']) {
            prices = [
                `BTC: $${data.bitcoin.usd.toFixed(2)}`,
                `SOL: $${data.solana.usd.toFixed(2)}`,
                `PAXG: $${data['pax-gold'].usd.toFixed(2)}`
            ];
            updatePrice(); // Atualiza o preço exibido
        } else {
            document.getElementById('crypto-prices').innerHTML = 'Data is incomplete from API';
        }
    } catch (error) {
        document.getElementById('crypto-prices').innerHTML = 'Error loading prices';
        console.error('Error fetching prices:', error);
    }
}

function updatePrice() {
    if (prices.length > 0) {
        const priceElement = document.getElementById('crypto-prices');
        priceElement.innerHTML = prices[currentIndex]; // Exibe o preço atual
        currentIndex = (currentIndex + 1) % prices.length; // Muda o índice para o próximo preço na lista
    }
}

function copyContract() {
    const contract = document.getElementById('token-contract').textContent.replace('Token Contract: ', ''); // Remove o texto extra "Token Contract: "
    navigator.clipboard.writeText(contract).then(() => {
        alert('Token contract copied to clipboard!');
    }).catch(error => {
        console.error('Failed to copy:', error);
        alert('Failed to copy token contract.');
    });
}

// Configura os intervalos para a atualização dos preços e mudanças no display
setInterval(updatePrice, 10000); // Muda o preço a cada 10 segundos
setInterval(fetchCryptoPrices, 60000); // Atualiza os preços a cada 1 minuto
window.onload = fetchCryptoPrices; // Carrega os preços ao inicializar a página

