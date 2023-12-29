var proccessors = {
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

module.exports = proccessors