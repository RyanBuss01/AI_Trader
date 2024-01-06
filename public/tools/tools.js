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

    getSma: function (data, period) {
        let sma = [];
        for (let i = period - 1; i < data.length; i++) {
            let sum = 0;
            for (let j = 0; j < period; j++) {
                sum += data[i - j];
            }
            sma.push(sum / period);
        }
        return sma;
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

    getRSI: function (closePrices, period) {
        let gains = 0;
        let losses = 0;
        let rsis = Array(period).fill(0);
    
        // First average gain/loss
        for (let i = 1; i <= period; i++) {
            const difference = closePrices[i] - closePrices[i - 1];
            if (difference > 0) gains += difference;
            else losses -= difference;
        }
    
        let avgGain = gains / period;
        let avgLoss = losses / period;
    
        // Subsequent average gain/loss and RSI calculation
        for (let i = period + 1; i < closePrices.length; i++) {
            const difference = closePrices[i] - closePrices[i - 1];
            if (difference > 0) {
                avgGain = (avgGain * (period - 1) + difference) / period;
                avgLoss = avgLoss * (period - 1) / period;
            } else {
                avgGain = avgGain * (period - 1) / period;
                avgLoss = (avgLoss * (period - 1) - difference) / period;
            }
    
            const rs = avgGain / avgLoss;
            const rsi = 100 - (100 / (1 + rs));
            rsis.push(rsi);
        }
    
        return rsis;
      },

    getStochRsi: function (data, lengthRSI=14, lengthStoch=14, smoothK=3, smoothD=3) {
        const rsi = this.getRSI(data, lengthRSI);
        let stochRsi = [];
        for (let i = lengthStoch - 1; i < rsi.length; i++) {
            const rsiWindow = rsi.slice(i - lengthStoch + 1, i + 1);
            const rsiHigh = Math.max(...rsiWindow);
            const rsiLow = Math.min(...rsiWindow);
            stochRsi.push((rsi[i] - rsiLow) / (rsiHigh - rsiLow) * 100);
        }
        const kLine = this.getSma(stochRsi, smoothK);
        const dLine = this.getSma(kLine, smoothD);
        return {line: kLine, signal: dLine };
      },

      isDojiCandle: (bars, offset=1, divisor=2) => {
        let bar = bars[bars.length-offset]

        barSize = Math.abs(bar.ClosePrice-bar.OpenPrice)
        wickSize = Math.abs(bar.HighPrice-bar.LowPrice)

        if(bar.OpenPrice == bar.LowPrice || bar.OpenPrice == bar.HighPrice) return false;
        if(barSize>wickSize/divisor) return false;
        if(bar.OpenPrice<bar.LowPrice+(wickSize/4) && bar.ClosePrice<bar.LowPrice+(wickSize/4)) return false;
        if(bar.OpenPrice>bar.HighPrice-(wickSize/4) && bar.ClosePrice>bar.HighPrice-(wickSize/4)) return false;

        return true
      },

      getBollingerBands: function (data, period, standardDeviations) {
        // Calculate the simple moving average (SMA) for the given period
        function calculateSMA(data, period) {
          const sma = [];
          for (let i = period - 1; i < data.length; i++) {
            const sum = data.slice(i - period + 1, i + 1).reduce((a, b) => a + b, 0);
            sma.push(sum / period);
          }
          return sma;
        }
      
        // Calculate the standard deviation (SD) for the given period
        function calculateSD(data, period) {
          const sd = [];
          for (let i = period - 1; i < data.length; i++) {
            const subset = data.slice(i - period + 1, i + 1);
            const mean = subset.reduce((a, b) => a + b, 0) / period;
            const squaredDiff = subset.map((value) => Math.pow(value - mean, 2));
            const variance = squaredDiff.reduce((a, b) => a + b, 0) / period;
            const standardDeviation = Math.sqrt(variance);
            sd.push(standardDeviation);
          }
          return sd;
        }
      
        // Calculate the upper and lower Bollinger Bands
        const sma = calculateSMA(data, period);
        const sd = calculateSD(data, period);
        const upperBands = sma.map((value, index) => value + (standardDeviations * sd[index]));
        const lowerBands = sma.map((value, index) => value - (standardDeviations * sd[index]));
      
        return {
          upper: upperBands,
          lower: lowerBands,
        };
        },

      trueRange: function (bars) {
        let trueRanges = [];
        for (let i = 1; i < bars.length; i++) {
            const bar = bars[i];
            const previousBar = bars[i - 1];
            const trueRange = Math.max(
                bar.HighPrice - bar.LowPrice,
                Math.abs(bar.HighPrice - previousBar.ClosePrice),
                Math.abs(bar.LowPrice - previousBar.ClosePrice)
            );
            trueRanges.push(trueRange);
        }
        return trueRanges;
      },

      getATR: function (fullBars, period) {
        let totalRange = 0, totalPRange=0;
        let bars=fullBars.slice(-period)
        
      
        for (let i = 1; i < bars.length; i++) {
          const highPrice1 = bars[i - 1].HighPrice;
          const lowPrice1 = bars[i - 1].LowPrice;
          const highPrice2 = bars[i].HighPrice;
          const lowPrice2 = bars[i].LowPrice;
          const midPrice = (bars[i].HighPrice + bars[i].ClosePrice) / 2;
      
          const range1 = highPrice1 - lowPrice1;
          const range2 = highPrice2 - lowPrice2;
          const range3 = Math.abs(highPrice2 - lowPrice1);
    
          const trueRange = Math.max(range1, range2, range3);
          let pRange = ((((trueRange/2)+midPrice)/midPrice)-1)*100
          totalRange += trueRange;
          totalPRange += pRange
        }
      
        const averageTrueRange = totalRange / (bars.length - 1);
        const precentRange = totalPRange / (bars.length-1);
    
        let json = {
          atr: Number(averageTrueRange.toFixed(3)),
          precent_range: Number(precentRange.toFixed(3)),
        }
    
        return  json;
      },
}

if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
    module.exports = tools;
} 