let walletPublicKey = null;

// Redirecionar para a página inicial
document.getElementById("home-button").onclick = () => {
    window.location.href = "/";
};

// Conectar à carteira Phantom
document.getElementById("connect-wallet-button").onclick = async () => {
    if (window.solana && window.solana.isPhantom) {
        try {
            const response = await window.solana.connect();
            walletPublicKey = response.publicKey.toString();
            alert(`Connected to wallet: ${walletPublicKey}`);
        } catch (error) {
            console.error(error);
            alert("Failed to connect wallet.");
        }
    } else {
        alert("Phantom Wallet not found. Please install it.");
    }
};

// Realizar o swap usando a API da Raydium
document.getElementById("swap-button").onclick = async () => {
    if (!walletPublicKey) {
        alert("Please connect your wallet first.");
        return;
    }

    const fromToken = document.getElementById("from-token").value;
    const toToken = document.getElementById("to-token").value;
    const amount = parseFloat(document.getElementById("from-amount").value);

    if (!amount || amount <= 0) {
        alert("Please enter a valid amount.");
        return;
    }

    try {
        const response = await fetch("https://api.raydium.io/v2/swap", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                wallet: walletPublicKey,
                fromToken,
                toToken,
                amount: amount.toFixed(6),
                slippage: 1, // 1% de tolerância
            }),
        });

        const data = await response.json();
        if (data.success) {
            alert(`Swap successful! Transaction ID: ${data.txId}`);
        } else {
            alert(`Swap failed: ${data.error}`);
        }
    } catch (error) {
        console.error(error);
        alert("An error occurred during the swap.");
    }
};
