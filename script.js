const API_KEY = "c80b860793msh2be7c48efc30fdfp1b8a0fjsn3b8c28ba9f70";
const API_HOST = "apidojo-yahoo-finance-v1.p.rapidapi.com";

const logoMap = {
  "TCS.BO": "https://companieslogo.com/img/orig/TCS.BO_BIG-043b6d2f.png",
  "RELIANCE.BO": "https://companieslogo.com/img/orig/RELIANCE.BO_BIG-ad85f5c4.png",
  "INFY.BO": "https://companieslogo.com/img/orig/INFY.BO_BIG-b17772d0.png"
};

const companies = Object.keys(logoMap);

// Home page fetch
if (document.getElementById("stockTable")) {
  async function fetchStocks() {
    const url = `https://${API_HOST}/market/v2/get-quotes?region=IN&symbols=${companies.join(",")}`;
    const res = await fetch(url, {
      headers: {
        "X-RapidAPI-Key": API_KEY,
        "X-RapidAPI-Host": API_HOST
      }
    });
    const data = await res.json();
    displayStocks(data.quoteResponse.result);
  }

  function displayStocks(stocks) {
    const table = document.getElementById("stockTable");
    table.innerHTML = "";
    stocks.forEach(stock => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td><img src="${logoMap[stock.symbol] || 'https://via.placeholder.com/40'}" width="40" /></td>
        <td><a href="details.html?symbol=${stock.symbol}">${stock.symbol}</a></td>
        <td>₹${stock.regularMarketPrice?.toFixed(2)}</td>
        <td style="color:${stock.regularMarketChangePercent >= 0 ? 'green' : 'red'}">
          ${stock.regularMarketChangePercent?.toFixed(2)}%
        </td>
        <td>${stock.regularMarketVolume?.toLocaleString() || "N/A"}</td>
      `;
      table.appendChild(row);
    });
  }

  function searchCompany() {
    const input = document.getElementById("stockInput");
    const symbol = input.value.toUpperCase();
    if (symbol) {
      window.location.href = `details.html?symbol=${symbol}`;
    }
  }

  fetchStocks();
  setInterval(fetchStocks, 30000);
}

// Details page fetch
async function fetchDetails(symbol) {
  const url = `https://${API_HOST}/market/v2/get-quotes?region=IN&symbols=${symbol}`;
  const res = await fetch(url, {
    headers: {
      "X-RapidAPI-Key": API_KEY,
      "X-RapidAPI-Host": API_HOST
    }
  });
  const data = await res.json();
  const stock = data.quoteResponse.result[0];
  document.getElementById("companyName").textContent = stock.shortName;
  document.getElementById("companyLogo").src = logoMap[symbol] || "https://via.placeholder.com/100";
  document.getElementById("price").textContent = stock.regularMarketPrice?.toFixed(2);
  document.getElementById("change").textContent = `${stock.regularMarketChangePercent?.toFixed(2)}%`;
  document.getElementById("volume").textContent = stock.regularMarketVolume?.toLocaleString();

  // Graph (mock example)
  drawChart([1, 2, 3, 4, 5, 6, 7], [stock.regularMarketPrice - 20, stock.regularMarketPrice - 10, stock.regularMarketPrice, stock.regularMarketPrice + 5, stock.regularMarketPrice + 10, stock.regularMarketPrice + 2, stock.regularMarketPrice]);

  // News (you can use News API instead)
  document.getElementById("newsList").innerHTML = `
    <li>Stock is in news for its recent performance</li>
    <li>Analysts predict growth in the coming months</li>
  `;
}

function drawChart(labels, values) {
  const ctx = document.getElementById("stockChart").getContext("2d");
  new Chart(ctx, {
    type: 'line',
    data: {
      labels: labels.map((_, i) => `Day ${i + 1}`),
      datasets: [{
        label: 'Price (INR)',
        data: values,
        borderColor: 'blue',
        fill: false
      }]
    },
    options: {
      responsive: true
    }
  });
}
