
let portfolio = JSON.parse(localStorage.getItem('portfolio')) || [];

// DOM Elements
const stockForm = document.getElementById('stockForm');
const stockList = document.getElementById('stockList');
const totalValueElement = document.getElementById('totalValue');
const dailyChangeElement = document.getElementById('dailyChange');


const USD_TO_INR = 83.0; rate or fetch it from an API

// Event Listeners
stockForm.addEventListener('submit', handleAddStock);

// Initialize the portfolio display
updatePortfolioDisplay();

// Format currency in Indian Rupees
function formatCurrency(amount) {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(amount);
}

// Handle form submission
async function handleAddStock(e) {
    e.preventDefault();
    
    const symbol = document.getElementById('stockSymbol').value.toUpperCase();
    const shares = parseFloat(document.getElementById('shares').value);
    const purchasePrice = parseFloat(document.getElementById('purchasePrice').value);
    
    try {
        const currentPrice = await getStockPrice(symbol);
        
        const stock = {
            symbol,
            shares,
            purchasePrice,
            currentPrice,
            lastUpdated: new Date().toISOString()
        };
        
        portfolio.push(stock);
        savePortfolio();
        updatePortfolioDisplay();
        stockForm.reset();
    } catch (error) {
        alert('Error fetching stock price. Please try again.');
    }
}

// Get current stock price (mock function - replace with real API in production)
async function getStockPrice(symbol) {
    // This is a mock function. In a real application, you would use a stock API
    // For example: Alpha Vantage, Yahoo Finance, or IEX Cloud
    return Math.random() * 1000;
}

// Save portfolio to localStorage
function savePortfolio() {
    localStorage.setItem('portfolio', JSON.stringify(portfolio));
}

// Update portfolio display
async function updatePortfolioDisplay() {
    stockList.innerHTML = '';
    let totalValue = 0;
    let totalCost = 0;
    
    for (const stock of portfolio) {
        try {
            stock.currentPrice = await getStockPrice(stock.symbol);
            const value = stock.shares * stock.currentPrice * USD_TO_INR; // Convert to INR
            const cost = stock.shares * stock.purchasePrice * USD_TO_INR; // Convert to INR
            const gainLoss = value - cost;
            const gainLossPercent = (gainLoss / cost) * 100;
            
            totalValue += value;
            totalCost += cost;
            
            const stockElement = document.createElement('div');
            stockElement.className = 'stock-item';
            stockElement.innerHTML = `
                <div>
                    <h3>${stock.symbol}</h3>
                    <p>Shares: ${stock.shares}</p>
                </div>
                <div>
                    <p>Current Price: ${formatCurrency(stock.currentPrice * USD_TO_INR)}</p>
                    <p>Value: ${formatCurrency(value)}</p>
                </div>
                <div>
                    <p class="${gainLoss >= 0 ? 'positive' : 'negative'}">
                        ${gainLoss >= 0 ? '+' : ''}${formatCurrency(gainLoss)} (${gainLossPercent.toFixed(2)}%)
                    </p>
                </div>
                <button onclick="removeStock('${stock.symbol}')">Remove</button>
            `;
            
            stockList.appendChild(stockElement);
        } catch (error) {
            console.error(`Error updating ${stock.symbol}:`, error);
        }
    }
    
    const totalGainLoss = totalValue - totalCost;
    const totalGainLossPercent = (totalGainLoss / totalCost) * 100;
    
    totalValueElement.textContent = formatCurrency(totalValue);
    dailyChangeElement.textContent = 
        `${totalGainLoss >= 0 ? '+' : ''}${formatCurrency(totalGainLoss)} (${totalGainLossPercent.toFixed(2)}%)`;
    dailyChangeElement.className = totalGainLoss >= 0 ? 'positive' : 'negative';
}

// Remove stock from portfolio
function removeStock(symbol) {
    portfolio = portfolio.filter(stock => stock.symbol !== symbol);
    savePortfolio();
    updatePortfolioDisplay();
}

// Update prices every 5 minutes
setInterval(updatePortfolioDisplay, 300000); 