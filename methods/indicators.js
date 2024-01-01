const tools = require('../public/tools/tools');

let indicators = {
    ema: function anonymous(bars,data,vars
) {
let ema = tools.getEMA(bars.map(b=>b.ClosePrice), vars.period)
let close = bars[bars.length-1].ClosePrice
ema = ema[ema.length-1]


// Must return boolean for each of the following
return {
  bullBuy : close>ema,
  bearBuy : close<ema,
  
  // If no sell signal is desired set both to null
  bullSell : close<ema, 
  bearSell : close>ema,
}
},
    haTrendingBar: function anonymous(bars,data,vars
) {
bars = tools.getHa(bars)
let low = bars[bars.length-1].LowPrice
let open = bars[bars.length-1].OpenPrice
let high = bars[bars.length-1].HighPrice


return {
  bullBuy : open==low,
  bearBuy : open==high,
  bullSell : open!=low, 
  bearSell : open!=high,
}
},
    macd: function anonymous(bars,data,vars
) {
let macd = tools.getMacd(data, vars.shortPeriod, vars.longPeriod)

let signal = macd.signalLine
macd = macd.macdLine

macd = macd[macd.length-1]
signal = signal[signal.length-1]

// Must return boolean for each of the following
return {
  bullBuy : macd>signal,
  bearBuy : macd<signal,
  
  // If no sell signal is desired set both to null
  bullSell : macd<signal, 
  bearSell : macd>signal,
}
},
    macdCrossover: function anonymous(bars,data,vars
) {


let macd = tools.getMacd(data, 12, 26)
let signal = macd.signalLine
macd = macd.macdLine
    

return {
  bullBuy : (macd[macd.length-1]>signal[signal.length-1] && macd[macd.length-2]<signal[signal.length-2]),
  bearBuy : (macd[macd.length-1]<signal[signal.length-1] && macd[macd.length-2]>signal[signal.length-2]),
  
  // If no sell signal is desired set both to null
  bullSell : macd[macd.length-1]<signal[signal.length-1], 
  bearSell : macd[macd.length-1]>signal[signal.length-1],
}
},
    sotchRSI: function anonymous(bars,data,vars
) {
// Default: AAPL used as sample data

let {line, signal} = tools.getStochRsi(data, vars.lengthRSI, vars.lengthStoch, vars.smoothK, vars.smoothD)
    
line = line[line.length-1]
signal = signal[signal.length-1]

// Must return boolean for each of the following
return {
  bullBuy : line>signal && line <80,
  bearBuy : line<signal && line >20,
  
  // If no sell signal is desired set both to null
  bullSell : line<signal || line > 80, 
  bearSell : line>signal || line < 20,
}
},
    isDoji: function anonymous(bars,data,vars
) {
let doji = tools.isDojiCandle(bars)
    
return {
  set : doji
}
},
};

module.exports = indicators;