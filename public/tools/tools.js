var tools = {
    sum: function (a, b) {
        return a+b
    },
    sumArray: function (numbers) {
        let sum = 0;
        for (let i = 0; i < numbers.length; i++) {
            sum += numbers[i];
        }
        return sum;
    },

    meanArray: function (numbers) {
        let sum = 0;
        for (let i = 0; i < numbers.length; i++) {
            sum += numbers[i];
        }
        return sum / numbers.length;
    },
    
    pDiff: function (a, b) {
        var difference = Number(b) - Number(a);
        var percentage = (difference / Number(a)) * 100;
        return Number(percentage.toFixed(2));
    },

    getEMA: function (prices, period) {
        let ema = [];
        let k = 2 / (period + 1);
        ema[0] = prices[0]; // First EMA value is the first price
    
        for (let i = 1; i < prices.length; i++) {
            ema[i] = prices[i] * k + ema[i - 1] * (1 - k);
        }

    
        return ema;
    },

    getMacd: function(data, period=12, signalPeriod=26) {
        
        const emaShort = this.getEMA(data, period);
        const emaLong = this.getEMA(data, signalPeriod);
        
    
        let macdLine = emaShort.map((value, index) => value - emaLong[index]);
        let signalLine = this.getEMA(macdLine, 9);

        return { macdLine, signalLine };
    },

    getHa: function (bars) {
        let candles = [];
        let previousHAOpen = (bars[0].OpenPrice + bars[0].ClosePrice) / 2;
        let previousHAClose = (bars[0].OpenPrice + bars[0].HighPrice + bars[0].LowPrice + bars[0].ClosePrice) / 4;
    
        for (let bar of bars) {
            let HAClose = (bar.OpenPrice + bar.HighPrice + bar.LowPrice + bar.ClosePrice) / 4;
            let HAOpen = (previousHAOpen + previousHAClose) / 2;
            let HAHigh = Math.max(bar.HighPrice, HAOpen, HAClose);
            let HALow = Math.min(bar.LowPrice, HAOpen, HAClose);
    
            candles.push({
                OpenPrice: HAOpen, 
                ClosePrice: HAClose, 
                HighPrice: HAHigh, 
                LowPrice: HALow
            });
    
            previousHAOpen = HAOpen;
            previousHAClose = HAClose;
        }
    
        return candles;
    },
}

if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
    module.exports = tools;
} 