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
    { symbol: "ORCL", name: "Oracle", logo: "https://logo.clearbit.com/oracle.com" },
    { symbol: "INTC", name: "Intel", logo: "https://logo.clearbit.com/intel.com" },
    { symbol: "ADBE", name: "Adobe", logo: "https://logo.clearbit.com/adobe.com" },
    { symbol: "SAP", name: "SAP", logo: "https://logo.clearbit.com/sap.com" },
    { symbol: "PYPL", name: "PayPal", logo: "https://logo.clearbit.com/paypal.com" },
    { symbol: "UBER", name: "Uber", logo: "https://logo.clearbit.com/uber.com" },
    { symbol: "CRM", name: "Salesforce", logo: "https://logo.clearbit.com/salesforce.com" },
    { symbol: "SHOP", name: "Shopify", logo: "https://logo.clearbit.com/shopify.com" },
    { symbol: "PEP", name: "PepsiCo", logo: "https://logo.clearbit.com/pepsico.com" },
    { symbol: "KO", name: "Coca-Cola", logo: "https://logo.clearbit.com/coca-colacompany.com" },
    { symbol: "DIS", name: "Disney", logo: "https://logo.clearbit.com/disney.com" }
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

// async function displayStocks() {
//     const container = document.getElementById("stocksContainer");
//     container.innerHTML = "";
//     for (const company of companies) {
//         const data = await fetchStock(company.symbol);
//         const percentChange = ((data.c - data.pc) / data.pc * 100).toFixed(2);
//         const card = document.createElement("div");
//         card.classList.add("stock-card");
//         card.innerHTML = `
//          <img src="${company.logo}" class="stock-logo" alt="${company.name}">
//           <div class="stock-details">
//           <h3>${company.name} (${company.symbol})</h3>
//           <p class="${data.c >= data.pc ? 'price-up' : 'price-down'}">
//             $${data.c.toFixed(2)} (${percentChange}%)
//           </p>
//           </div>
//           <button class="view-btn">View More</button>
//          <div class="more-info">
//           <p><strong>Current Price:</strong> $${data.c.toFixed(2)}</p>
//          <p><strong>Change:</strong> ${(data.c - data.pc).toFixed(2)}</p>
//           <p><strong>% Change:</strong> ${percentChange}%</p>
//            <canvas id="chart-${company.symbol}" width="400" height="200"></canvas>
//            <div id="news-${company.symbol}" class="news-section">
//               <p><strong>Latest News:</strong></p>
//               <ul class="news-list"></ul>
//            </div>
//           </div>
//         `;
        
//         container.appendChild(card);
//         loadStockChart(company.symbol);
//         loadNews(company.symbol);  // 👈 Added line
//         const viewBtn = card.querySelector(".view-btn");
//         viewBtn.addEventListener("click", () => {
//             card.classList.toggle("expanded");
//             viewBtn.textContent = card.classList.contains("expanded") ? "Hide" : "View More";
//         });
//     }
//     const now = new Date();
//     document.getElementById("lastUpdated").textContent = 
//     `Last updated at ${now.toLocaleTimeString()}`;
// }


async function displayStocks() {
  const container = document.getElementById("stocksContainer");
  container.innerHTML = "";

  for (let i = 0; i < companies.length; i++) {
    const company = companies[i];
    const data = await fetchStock(company.symbol);
    const percentChange = ((data.c - data.pc) / data.pc * 100).toFixed(2);

    const card = document.createElement("div");
    card.classList.add("stock-card");

    const chartApiKey = i < 10
      ? "3127e11a4fea46469190cc7c0d1eab3d"
      : "765d59d693b34948a506fc14e69d508d";

    card.setAttribute("data-name", `${company.name} ${company.symbol}`.toLowerCase());

    card.innerHTML = `
      <img src="${company.logo}" class="stock-logo" alt="${company.name}">
      <div class="stock-details">
        <h3>${company.name} (${company.symbol})</h3>
        <p class="${data.c >= data.pc ? 'price-up' : 'price-down'}">
          $${data.c.toFixed(2)} (${percentChange}%)
        </p>
      </div>
      <button class="view-btn">View More</button>
      <div class="more-info" style="display:none;">
        <p><strong>Current Price:</strong> $${data.c.toFixed(2)}</p>
        <p><strong>Change:</strong> ${(data.c - data.pc).toFixed(2)}</p>
        <p><strong>% Change:</strong> ${percentChange}%</p>
        <canvas id="chart-${company.symbol}" width="400" height="200"></canvas>
      </div>
    `;

    const viewBtn = card.querySelector(".view-btn");
    const moreInfo = card.querySelector(".more-info");

    viewBtn.addEventListener("click", () => {
      if (!card.classList.contains("expanded")) {
        loadStockChart(company.symbol, chartApiKey);
      }
      card.classList.toggle("expanded");
      moreInfo.style.display = card.classList.contains("expanded") ? "block" : "none";
      viewBtn.textContent = card.classList.contains("expanded") ? "Hide" : "View More";
    });

    container.appendChild(card);
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
    const apiKey = "3127e11a4fea46469190cc7c0d1eab3d"; // New Twelve Data API Key
    const interval = "5min";
    const url = `https://api.twelvedata.com/time_series?symbol=${symbol}&interval=${interval}&apikey=${apiKey}`;

    const response = await fetch(url);
    const data = await response.json();

    if (!data.values || !Array.isArray(data.values)) {
      throw new Error("Invalid chart data");
    }

    const labels = data.values.map(val => val.datetime).reverse();
    const prices = data.values.map(val => parseFloat(val.close)).reverse();

    const canvas = document.getElementById(`chart-${symbol}`);
    if (!canvas) {
      throw new Error(`Canvas for ${symbol} not found`);
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
          backgroundColor: "rgba(0, 0, 255, 0.1)",
          fill: true,
          pointRadius: 3,               // Show points on graph
          pointHoverRadius: 5,
          pointBackgroundColor: "blue"
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { display: true },
          tooltip: {
            enabled: true,
            mode: 'nearest',
            intersect: false
          }
        },
        scales: {
          x: { display: false },
          y: { display: true }
        },
        elements: {
          point: {
            pointStyle: 'circle'
          }
        }
      }
    });

  } catch (error) {
    console.error(`Chart error for ${symbol}:`, error);
    const canvas = document.getElementById(`chart-${symbol}`);
    if (canvas) {
      canvas.outerHTML = `<p style="color:red;">Unable to load chart for ${symbol}.</p>`;
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

// 🆕 News Fetching Function
async function loadNews(symbol) {
  try {
    const today = new Date().toISOString().split("T")[0];
    const past = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0];
    const url = `https://finnhub.io/api/v1/company-news?symbol=${symbol}&from=${past}&to=${today}&token=${apiKey}`;

    const res = await fetch(url);
    const articles = await res.json();

    const newsContainer = document.querySelector(`#news-${symbol} .news-list`);
    if (!newsContainer || !Array.isArray(articles)) return;

    newsContainer.innerHTML = articles.slice(0, 3).map(article => `
      <li><a href="${article.url}" target="_blank">${article.headline}</a></li>
    `).join("");

  } catch (err) {
    console.error("News fetch error:", err);
  }
}




// const finnhubApiKey = "d28ejfpr01qjsuf31jj0d28ejfpr01qjsuf31jjg"; // For stock price and news
// const chartApiKey = "765d59d693b34948a506fc14e69d508d"; // For chart from Twelve Data

// const companies = [
//     { symbol: "AAPL", name: "Apple", logo: "https://logo.clearbit.com/apple.com" },
//     { symbol: "MSFT", name: "Microsoft", logo: "https://logo.clearbit.com/microsoft.com" },
//     { symbol: "TSLA", name: "Tesla", logo: "https://logo.clearbit.com/tesla.com" },
//     { symbol: "GOOGL", name: "Google", logo: "https://logo.clearbit.com/google.com" },
//     { symbol: "AMZN", name: "Amazon", logo: "https://logo.clearbit.com/amazon.com" },
//     { symbol: "META", name: "Meta", logo: "https://logo.clearbit.com/meta.com" },
//     { symbol: "NFLX", name: "Netflix", logo: "https://logo.clearbit.com/netflix.com" },
//     { symbol: "NVDA", name: "Nvidia", logo: "https://logo.clearbit.com/nvidia.com" },
//     { symbol: "BABA", name: "Alibaba", logo: "https://logo.clearbit.com/alibaba.com" },
//     { symbol: "ORCL", name: "Oracle", logo: "https://logo.clearbit.com/oracle.com" },
//     { symbol: "INTC", name: "Intel", logo: "https://logo.clearbit.com/intel.com" },
//     { symbol: "ADBE", name: "Adobe", logo: "https://logo.clearbit.com/adobe.com" },
//     { symbol: "SAP", name: "SAP", logo: "https://logo.clearbit.com/sap.com" },
//     { symbol: "PYPL", name: "PayPal", logo: "https://logo.clearbit.com/paypal.com" },
//     { symbol: "UBER", name: "Uber", logo: "https://logo.clearbit.com/uber.com" },
//     { symbol: "CRM", name: "Salesforce", logo: "https://logo.clearbit.com/salesforce.com" },
//     { symbol: "SHOP", name: "Shopify", logo: "https://logo.clearbit.com/shopify.com" },
//     { symbol: "PEP", name: "PepsiCo", logo: "https://logo.clearbit.com/pepsico.com" },
//     { symbol: "KO", name: "Coca-Cola", logo: "https://logo.clearbit.com/coca-colacompany.com" },
//     { symbol: "DIS", name: "Disney", logo: "https://logo.clearbit.com/disney.com" }
// ];

// async function fetchStock(symbol) {
//     const url = `https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${finnhubApiKey}`;
//     const res = await fetch(url);
//     return await res.json();
// }

// async function getUsdToInrRate() {
//     const res = await fetch("https://api.exchangerate.host/latest?base=USD&symbols=INR");
//     const data = await res.json();
//     return data.rates.INR;
// }

// async function displayStocks() {
//     const container = document.getElementById("stocksContainer");
//     container.innerHTML = "";

//     for (const company of companies) {
//         const data = await fetchStock(company.symbol);
//         const percentChange = ((data.c - data.pc) / data.pc * 100).toFixed(2);

//         const card = document.createElement("div");
//         card.classList.add("stock-card");

//         card.innerHTML = `
//             <img src="${company.logo}" class="stock-logo" alt="${company.name}">
//             <div class="stock-details">
//                 <h3>${company.name} (${company.symbol})</h3>
//                 <p class="${data.c >= data.pc ? 'price-up' : 'price-down'}">
//                     $${data.c.toFixed(2)} (${percentChange}%)
//                 </p>
//             </div>
//             <button class="view-btn">View More</button>
//             <div class="more-info">
//                 <p><strong>Current Price:</strong> $${data.c.toFixed(2)}</p>
//                 <p><strong>Change:</strong> ${(data.c - data.pc).toFixed(2)}</p>
//                 <p><strong>% Change:</strong> ${percentChange}%</p>
//                 <canvas id="chart-${company.symbol}" class="stock-chart" width="400" height="200"></canvas>
//                 <div id="news-${company.symbol}" class="news-section">
//                     <p><strong>Latest News:</strong></p>
//                     <ul class="news-list"></ul>
//                 </div>
//             </div>
//         `;

//         container.appendChild(card);
//         loadNews(company.symbol);

//         const viewBtn = card.querySelector(".view-btn");
//         viewBtn.addEventListener("click", () => {
//             card.classList.toggle("expanded");
//             viewBtn.textContent = card.classList.contains("expanded") ? "Hide" : "View More";
//             if (card.classList.contains("expanded")) {
//                 loadStockChart(company.symbol);
//             }
//         });
//     }

//     const now = new Date();
//     document.getElementById("lastUpdated").textContent = `Last updated at ${now.toLocaleTimeString()}`;
// }

// async function loadStockChart(symbol) {
//     try {
//         const url = `https://api.twelvedata.com/time_series?symbol=${symbol}&interval=5min&apikey=${chartApiKey}`;

//         const response = await fetch(url);
//         const data = await response.json();

//         if (!data.values || !Array.isArray(data.values)) throw new Error("Invalid chart data");

//         const labels = data.values.map(val => val.datetime).reverse();
//         const prices = data.values.map(val => parseFloat(val.close)).reverse();

//         const canvas = document.getElementById(`chart-${symbol}`);
//         if (!canvas) throw new Error("Canvas not found");

//         const ctx = canvas.getContext("2d");

//         // Destroy existing chart if it exists
//         const existingChart = Chart.getChart(ctx);
//         if (existingChart) existingChart.destroy();

//         new Chart(ctx, {
//             type: "line",
//             data: {
//                 labels,
//                 datasets: [{
//                     label: `${symbol} Price`,
//                     data: prices,
//                     borderColor: "blue",
//                     backgroundColor: "rgba(0, 0, 255, 0.1)",
//                     fill: true,
//                     pointRadius: 4,
//                     pointHoverRadius: 6,
//                     pointBackgroundColor: "blue",
//                     pointBorderColor: "#fff",
//                     tension: 0.3
//                 }]
//             },
//             options: {
//                 responsive: true,
//                 plugins: {
//                     legend: { display: true }
//                 },
//                 scales: {
//                     x: { display: false },
//                     y: { display: true }
//                 }
//             }
//         });
//     } catch (error) {
//         console.error("Chart load error:", error);
//         const canvas = document.getElementById(`chart-${symbol}`);
//         if (canvas) {
//             canvas.outerHTML = `<p style="color:red;">Unable to load chart.</p>`;
//         }
//     }
// }

// document.getElementById("refreshBtn").addEventListener("click", displayStocks);
// document.getElementById("darkModeBtn").addEventListener("click", () => {
//     document.body.classList.toggle("dark-mode");
// });

// window.onload = () => {
//     displayStocks();
//     setInterval(displayStocks, 60000); // Refresh every 1 min
// };

// function closeModal() {
//     document.getElementById("stockModal").style.display = "none";
// }

// async function loadNews(symbol) {
//     try {
//         const today = new Date().toISOString().split("T")[0];
//         const past = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0];
//         const url = `https://finnhub.io/api/v1/company-news?symbol=${symbol}&from=${past}&to=${today}&token=${finnhubApiKey}`;

//         const res = await fetch(url);
//         const articles = await res.json();

//         const newsContainer = document.querySelector(`#news-${symbol} .news-list`);
//         if (!newsContainer || !Array.isArray(articles)) return;

//         newsContainer.innerHTML = articles.slice(0, 3).map(article => `
//             <li><a href="${article.url}" target="_blank">${article.headline}</a></li>
//         `).join("");
//     } catch (err) {
//         console.error("News fetch error:", err);
//     }
// }