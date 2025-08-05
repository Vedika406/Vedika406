
// const FINNHUB_API_KEY = "d2906u1r01qvka4revn0d2906u1r01qvka4revng";

// // List of company symbols
// const companies = [
//   "AAPL", "MSFT", "GOOGL", "AMZN", "TSLA",
//   "NFLX", "META", "NVDA", "INTC", "ADBE"
// ];

// // Fetch stock quotes & logos
// async function fetchStocksFinnhub() {
//   const table = document.getElementById("stockTable");
//   table.innerHTML = "";

//   for (const symbol of companies) {
//     try {
//       // Fetch quote
//       const quoteRes = await fetch(`https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${FINNHUB_API_KEY}`);
//       const quote = await quoteRes.json();

//       // Fetch company profile (logo)
//       const profileRes = await fetch(`https://finnhub.io/api/v1/stock/profile2?symbol=${symbol}&token=${FINNHUB_API_KEY}`);
//       const profile = await profileRes.json();

//       // Create row
//       const row = document.createElement("tr");
//       row.innerHTML = `
//         <td><img src="${profile.logo}" width="40" height="40" /></td>
//         <td>${symbol}</td>
//         <td>$${quote.c.toFixed(2)}</td>
//         <td style="color:${quote.dp >= 0 ? 'green' : 'red'}">${quote.dp.toFixed(2)}%</td>
//         <td>${quote.v ? quote.v.toLocaleString() : "N/A"}</td>
//         <td><button onclick="fetchChartDataFinnhub('${symbol}')">📊 Graph</button></td>
//       `;
//       table.appendChild(row);

//     } catch (err) {
//       console.error(`Error fetching data for ${symbol}:`, err);
//     }
//   }
// }

// // Fetch historical data for Chart.js (last 7 days)
// async function fetchChartDataFinnhub(symbol) {
//   const now = Math.floor(Date.now() / 1000);
//   const oneWeekAgo = now - 7 * 24 * 60 * 60;

//   const url = `https://finnhub.io/api/v1/stock/candle?symbol=${symbol}&resolution=D&from=${oneWeekAgo}&to=${now}&token=${FINNHUB_API_KEY}`;
//   const res = await fetch(url);
//   const data = await res.json();

//   if (data.s !== "ok") {
//     console.error("Error fetching historical data:", data);
//     return;
//   }

//   const labels = data.t.map(timestamp => new Date(timestamp * 1000).toLocaleDateString());
//   const prices = data.c;

//   drawChart(labels, prices, symbol);
// }

// // Chart.js setup
// function drawChart(labels, prices, symbol) {
//   const ctx = document.getElementById('stockChart').getContext('2d');
//   new Chart(ctx, {
//     type: 'line',
//     data: {
//       labels: labels,
//       datasets: [{
//         label: `Price History: ${symbol}`,
//         data: prices,
//         borderColor: 'blue',
//         fill: false
//       }]
//     },
//     options: {
//       responsive: true,
//       scales: {
//         y: {
//           beginAtZero: false
//         }
//       }
//     }
//   });

//   document.getElementById("chartContainer").style.display = "block";
// }

// // Initial calls
// fetchStocksFinnhub();
// fetchChartDataFinnhub("AAPL");



const FINNHUB_API_KEY = "d2906u1r01qvka4revn0d2906u1r01qvka4revng";

// Predefined stock symbols
const companies = [
  "AAPL", "MSFT", "GOOGL", "AMZN", "TSLA",
  "NFLX", "META", "NVDA", "INTC", "ADBE"
];

// Fetch stock details and display in table
async function fetchStocksFinnhub() {
  const table = document.getElementById("stockTable");
  table.innerHTML = "";

  for (const symbol of companies) {
    try {
      // Fetch stock quote
      const quoteRes = await fetch(`https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${FINNHUB_API_KEY}`);
      const quote = await quoteRes.json();

      // Fetch stock profile (logo)
      const profileRes = await fetch(`https://finnhub.io/api/v1/stock/profile2?symbol=${symbol}&token=${FINNHUB_API_KEY}`);
      const profile = await profileRes.json();

      // Create table row
      const row = document.createElement("tr");
      row.innerHTML = `
        <td><img src="${profile.logo}" width="40" height="40" alt="${symbol} logo"/></td>
        <td>${symbol}</td>
        <td>$${quote.c.toFixed(2)}</td>
        <td style="color:${quote.dp >= 0 ? 'green' : 'red'}">${quote.dp.toFixed(2)}%</td>
        <td>${quote.v ? quote.v.toLocaleString() : "N/A"}</td>
        <td><button onclick="redirectToGraph('${symbol}')">📊 Graph</button></td>
      `;
      table.appendChild(row);

    } catch (err) {
      console.error(`Error fetching data for ${symbol}:`, err);
    }
  }
}

// Redirect to graph page
function redirectToGraph(symbol) {
  window.location.href = `graph.html?symbol=${symbol}`;
}

// Call on page load
fetchStocksFinnhub();
