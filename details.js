const apiKey = "d28ejfpr01qjsuf31jj0d28ejfpr01qjsuf31jjg";

const urlParams = new URLSearchParams(window.location.search);
const symbol = urlParams.get("symbol");
const name = urlParams.get("name");
document.getElementById("companyTitle").innerText = `${name} (${symbol})`;

async function fetchStockDetails() {
    const quoteUrl = `https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${apiKey}`;
    const candleUrl = `https://finnhub.io/api/v1/stock/candle?symbol=${symbol}&resolution=D&from=${Math.floor(Date.now()/1000 - 30*24*60*60)}&to=${Math.floor(Date.now()/1000)}&token=${apiKey}`;
    
    const [quoteRes, candleRes] = await Promise.all([fetch(quoteUrl), fetch(candleUrl)]);
    const quote = await quoteRes.json();
    const candle = await candleRes.json();

    const minPrice = Math.min(...candle.l);
    const maxPrice = Math.max(...candle.h);
    const volume = candle.v.reduce((a,b) => a+b, 0);
    const percentChange = ((quote.c - quote.pc) / quote.pc * 100).toFixed(2);

    document.getElementById("minPrice").innerText = `Min Price: $${minPrice.toFixed(2)}`;
    document.getElementById("maxPrice").innerText = `Max Price: $${maxPrice.toFixed(2)}`;
    document.getElementById("volume").innerText = `Total Volume: ${volume}`;
    document.getElementById("percentChange").innerText = `Change: ${percentChange}%`;

    new Chart(document.getElementById('stockChart').getContext('2d'), {
        type: 'line',
        data: {
            labels: candle.t.map(t => new Date(t * 1000).toLocaleDateString()),
            datasets: [{
                label: 'Price',
                data: candle.c,
                borderColor: 'rgba(0,123,255,1)',
                fill: false,
                tension: 0.2
            }]
        }
    });
}
fetchStockDetails();
