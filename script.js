


// const FINNHUB_API_KEY = "d28ejfpr01qjsuf31jj0d28ejfpr01qjsuf31jjg";

// // Expanded stock list
// let companies = [
//   "AAPL", "MSFT", "GOOGL", "AMZN", "TSLA",
//   "META", "NVDA", "NFLX", "AMD", "INTC",
//   "BABA", "PYPL", "SHOP", "SQ", "UBER",
//   "DIS", "NKE", "PEP", "KO", "V", "MA",
//   "WMT", "PFE", "MRNA", "JPM", "BA",
//   "ORCL", "CSCO", "COST", "T", "GE"
// ];

// // Fetch stock data
// async function fetchStocks() {
//   const table = document.getElementById("stockTable");
//   table.innerHTML = "";

//   for (const symbol of companies) {
//     try {
//       // Stock quote
//       const quoteRes = await fetch(
//         `https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${FINNHUB_API_KEY}`
//       );
//       const quote = await quoteRes.json();

//       // Company profile
//       const profileRes = await fetch(
//         `https://finnhub.io/api/v1/stock/profile2?symbol=${symbol}&token=${FINNHUB_API_KEY}`
//       );
//       const profile = await profileRes.json();

//       const row = document.createElement("tr");
//       row.innerHTML = `
//         <td><img src="${profile.logo}" width="40" height="40" alt="${symbol} logo" /></td>
//         <td>${symbol}</td>
//         <td>$${quote.c ? quote.c.toFixed(2) : "N/A"}</td>
//         <td style="color:${quote.dp >= 0 ? "green" : "red"}">${quote.dp ? quote.dp.toFixed(2) : "0"}%</td>
//         <td><button onclick="redirectToGraph('${symbol}')">📊 Graph</button></td>
//       `;
//       table.appendChild(row);
//     } catch (err) {
//       console.error(`Error fetching data for ${symbol}:`, err);
//     }
//   }
// }

// // Search functionality
// function searchStock() {
//   const symbol = document.getElementById("searchSymbol").value.toUpperCase();
//   if (!symbol) return;
//   companies = [symbol];
//   fetchStocks();
// }

// // Redirect to stock graph page
// function redirectToGraph(symbol) {
//   window.location.href = `graph.html?symbol=${symbol}`;
// }

// // Dark mode toggle
// document.getElementById("darkModeToggle").addEventListener("click", () => {
//   document.body.classList.toggle("dark-mode");
// });

// // Refresh button (manual refresh only)
// document.getElementById("refreshBtn").addEventListener("click", () => {
//   fetchStocks();
// });

// // Initial fetch when page loads
// fetchStocks();


const apiKey = "d28ejfpr01qjsuf31jj0d28ejfpr01qjsuf31jjg";
const companies = [
    { symbol: "AAPL", name: "Apple", logo: "https://logo.clearbit.com/apple.com" },
    { symbol: "MSFT", name: "Microsoft", logo: "https://logo.clearbit.com/microsoft.com" },
    { symbol: "TSLA", name: "Tesla", logo: "https://logo.clearbit.com/tesla.com" },
    { symbol: "GOOGL", name: "Google", logo: "https://logo.clearbit.com/google.com" },
    { symbol: "AMZN", name: "Amazon", logo: "https://logo.clearbit.com/amazon.com" },
    { symbol: "META", name: "Meta", logo: "https://logo.clearbit.com/meta.com" },
    { symbol: "NFLX", name: "Netflix", logo: "https://logo.clearbit.com/netflix.com" },
    { symbol: "NVDA", name: "Nvidia", logo: "https://logo.clearbit.com/nvidia.com" },
    { symbol: "BABA", name: "Alibaba", logo: "https://logo.clearbit.com/alibaba.com" },
    { symbol: "ORCL", name: "Oracle", logo: "https://logo.clearbit.com/oracle.com" }
];

async function fetchStock(symbol) {
    const url = `https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${apiKey}`;
    const res = await fetch(url);
    return await res.json();
}

async function getUsdToInrRate() {
    const res = await fetch("https://api.exchangerate.host/latest?base=USD&symbols=INR");
    const data = await res.json();
    return data.rates.INR;
}

async function displayStocks() {
    const container = document.getElementById("stocksContainer");
    container.innerHTML = "";
    for (const company of companies) {
        const data = await fetchStock(company.symbol);
        const percentChange = ((data.c - data.pc) / data.pc * 100).toFixed(2);
        const card = document.createElement("div");
        card.classList.add("stock-card");
        card.innerHTML = `
         <img src="${company.logo}" class="stock-logo" alt="${company.name}">
          <div class="stock-details">
          <h3>${company.name} (${company.symbol})</h3>
          <p class="${data.c >= data.pc ? 'price-up' : 'price-down'}">
            $${data.c.toFixed(2)} (${percentChange}%)
          </p>
          </div>
          <button class="view-btn">View More</button>
         <div class="more-info">
          <p><strong>Current Price:</strong> $${data.c.toFixed(2)}</p>
         <p><strong>Change:</strong> ${(data.c - data.pc).toFixed(2)}</p>
          <p><strong>% Change:</strong> ${percentChange}%</p>
           <canvas id="chart-${company.symbol}" width="400" height="200"></canvas>
          </div>
          

          `;
        
        container.appendChild(card);
        loadStockChart(company.symbol);
        const viewBtn = card.querySelector(".view-btn");
        viewBtn.addEventListener("click", () => {
         card.classList.toggle("expanded");
        viewBtn.textContent = card.classList.contains("expanded") ? "Hide" : "View More";
});

    }
    const now = new Date();
    document.getElementById("lastUpdated").textContent = 
    `Last updated at ${now.toLocaleTimeString()}`;

}

async function viewDetails(symbol, name) {
    const data = await fetchStock(symbol);
    const percentChange = ((data.c - data.pc) / data.pc * 100).toFixed(2);

    document.getElementById("modalCompanyName").textContent = `${name} (${symbol})`;
    document.getElementById("modalPrice").textContent = `$${data.c.toFixed(2)}`;
    document.getElementById("modalChange").textContent = `${(data.c - data.pc).toFixed(2)}`;
    document.getElementById("modalPercentChange").textContent = `${percentChange}%`;

    document.getElementById("stockModal").style.display = "block";
}

async function loadStockChart(symbol) {
  try {
    const apiKey = "0f9a9131ac6e48b9a5d3e25ecfe8d630";
    const interval = "5min";
    const url = `https://api.twelvedata.com/time_series?symbol=${symbol}&interval=${interval}&apikey=${apiKey}`;

    const response = await fetch(url);
    const data = await response.json();

    if (!data.values || !Array.isArray(data.values)) {
      throw new Error("Invalid data");
    }

    const labels = data.values.map(val => val.datetime).reverse();
    const prices = data.values.map(val => parseFloat(val.close)).reverse();

    const canvas = document.getElementById(`chart-${symbol}`);
    if (!canvas) {
      throw new Error("Canvas element not found");
    }

    const ctx = canvas.getContext("2d");

    new Chart(ctx, {
      type: "line",
      data: {
        labels: labels,
        datasets: [{
          label: `${symbol} Price`,
          data: prices,
          borderColor: "blue",
          backgroundColor: "rgba(0,0,255,0.1)",
          fill: true
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { display: true }
        },
        scales: {
          x: { display: false },
          y: { display: true }
        }
      }
    });

  } catch (error) {
    console.error("Chart load error:", error);
    const canvas = document.getElementById(`chart-${symbol}`);
    if (canvas) {
      canvas.outerHTML = `<p style="color:red;">Unable to load chart.</p>`;
    }
  }
}



document.getElementById("refreshBtn").addEventListener("click", displayStocks);
document.getElementById("darkModeBtn").addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");
});
window.onload = () => {
    displayStocks(); // Load once initially
    setInterval(displayStocks, 60000); // Refresh every 60000 ms (1 minute)
};

function closeModal() {
    document.getElementById("stockModal").style.display = "none";
}
