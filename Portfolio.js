const mongoose = require('mongoose');

const stockSchema = new mongoose.Schema({
    symbol: {
        type: String,
        required: true
    },
    shares: {
        type: Number,
        required: true
    },
    purchasePrice: {
        type: Number,
        required: true
    },
    currentPrice: {
        type: Number,
        required: true
    },
    lastUpdated: {
        type: Date,
        default: Date.now
    }
});

const portfolioSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    stocks: [stockSchema],
    totalValue: {
        type: Number,
        default: 0
    },
    lastUpdated: {
        type: Date,
        default: Date.now
    }
});

// Method to calculate total portfolio value
portfolioSchema.methods.calculateTotalValue = function() {
    this.totalValue = this.stocks.reduce((total, stock) => {
        return total + (stock.shares * stock.currentPrice);
    }, 0);
    return this.totalValue;
};

module.exports = mongoose.model('Portfolio', portfolioSchema); 