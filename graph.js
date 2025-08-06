const FINNHUB_API_KEY = "d28ejfpr01qjsuf31jj0d28ejfpr01qjsuf31jjg";
let stockChartInstance = null;

const params = new URLSearchParams(window.location.search);
const symbol = params.get("symbol");
document.getElementById("stockTitle").innerText = `Price History: ${symbol}`;

async function fetchChartDataFinnhub(symbol) {
  const now = Math.floor(Date.now() / 1000);
  const oneMonthAgo = now - 30 * 24 * 60 * 60;

  const url = `https://finnhub.io/api/v1/stock/candle?symbol=${symbol}&resolution=D&from=${oneMonthAgo}&to=${now}&token=${FINNHUB_API_KEY}`;
  console.log("Fetching candle data:", url);

  const res = await fetch(url);
  const data = await res.json();
  console.log("API response:", data);

  if (data.s !== "ok") {
    alert("No historical data available for " + symbol);
    return;
  }

  const labels = data.t.map(t => new Date(t * 1000).toLocaleDateString());
  const prices = data.c;
  drawChart(labels, prices, symbol);
}

function drawChart(labels, prices, symbol) {
  const ctx = document.getElementById("stockChart").getContext("2d");
  if (stockChartInstance) stockChartInstance.destroy();

  stockChartInstance = new Chart(ctx, {
    type: "line",
    data: {
      labels,
      datasets: [{
        label: `${symbol} Price ($)`,
        data: prices,
        borderColor: "blue",
        borderWidth: 2,
        fill: false,
        tension: 0.1
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { display: true },
        title: { display: true, text: `${symbol} Stock Price (Last 30 Days)` }
      },
      scales: {
        x: { title: { display: true, text: 'Date' } },
        y: { title: { display: true, text: 'Price ($)' } }
      }
    }
  });
}

fetchChartDataFinnhub(symbol);
