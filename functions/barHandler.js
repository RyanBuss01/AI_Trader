const moment = require("moment");
const alpaca = require("../middleware/alpaca");
const etfs = require("../constants/ETFs.js")
const meme_stocks = require("../constants/meme_stocks")
const snp_400MC = require("../constants/snp_400MC")
const snp_500 = require("../constants/snp_500")
const snp_600SC = require('../constants/snp_600SC')
const dow = require("../constants/dow")
const blacklist = require("../constants/blacklist.js")
const fs = require('fs');

function jsonWriter(list) { 

    const writeStream = fs.createWriteStream('./json/bars.json');
    const writeStream2 = fs.createWriteStream('./json/bars2.json');
    
    let data1 = [];
    let data2 = [];

    for (let i = 0; i < list.length; i++) {
        if (blacklist.includes(list[i].ticker)) continue;
        const data = JSON.stringify(list[i]);
        if (i < 1800) data1.push(data);
        else data2.push(data);
    }

    writeStream.write('[' + data1.join(",") + ']');
    writeStream2.write('[' + data2.join(",") + ']');

    writeStream.end(); 
    writeStream2.end();

    // Optional: Handle any potential write errors
    writeStream.on('error', err => {
        console.error('Error writing to bars.json:', err);
    });
    writeStream2.on('error', err => {
        console.error('Error writing to bars2.json:', err);
    });
}

var barHandler = {
    
    convertToOneDimensional: function (inputArray, chunkSize=200) {
        let twoDimensionalArray = [];
        for (let i = 0; i < inputArray.length; i += chunkSize) {
          let chunk = inputArray.slice(i, i + chunkSize);
          twoDimensionalArray.push(chunk);
        }
        return twoDimensionalArray;
    },

    getMasterList: function () {
        let master = []
        let fullTickers =  [snp_500, etfs, meme_stocks, snp_400MC, snp_600SC, dow]

        for (let l=0; l<fullTickers.length; l++) {
            for(let i=0; i<fullTickers[l].length; i++) {
                let index = l==0? "snp_500" : l==1? "etfs" :l==2? "meme_stocks" :l==3? "snp_400MC" :''
                let ticker = fullTickers[l][i]
                let json = {ticker: ticker, index: index}
                let repeat = master.find(e=>e.ticker == json.ticker)
                let black = blacklist.find(e=> e==json.ticker)
                if(!repeat && !black) master.push(json)
            }
        }
        return master
    },

    getMultiBars: async function (tickers, {socket}) {
        const bars = [];
        let list = this.convertToOneDimensional(tickers, 100)
        for(let i=0; i<list.length; i++) {

        process.stdout.write("\r\x1b[K")
        process.stdout.write(`iteration : ${i*100} / ${tickers.length}`)
        if(socket) socket.emit('barGetter', {index: i*100, length: tickers.length})

        let resp = await alpaca.getMultiBarsV2(list[i], {
            limit: 10000000,
            start: moment().subtract(10000, "days").format(), //  days ago
            end: moment().subtract(0, "days").subtract(20, "minutes").format(), // yesterday
            timeframe: "1Day",
        }, alpaca.configuration)
        for await (let t of resp) {
            bars.push({
                ticker: t[0],
                bars: t[1].map(b => {
                    return {
                    Timestamp: b.Timestamp,
                    OpenPrice: b.OpenPrice,
                    HighPrice: b.HighPrice,
                    LowPrice: b.LowPrice,
                    ClosePrice: b.ClosePrice,
                    Volume: b.Volume
                    }
                })
            });
        }
    }
    process.stdout.write("\r\x1b[K")
    jsonWriter(bars)
    },

    getMultiBarsRefresh: async function (tickers, tickerList, {socket}) {
        const bars = [];
        let list = this.convertToOneDimensional(tickers)
        // let lastDate = this.getLatestBarDate(tickerList.filter(t=> t.ticker=='AAPL')[0].bars)
        // compare latest date to current date and subtract
        for(let i=0; i<list.length; i++) {
        process.stdout.write("\r\x1b[K")
        process.stdout.write(`iteration : ${i*200} / ${tickers.length}`)
        if(socket) socket.emit('barGetter', {index: i*100, length: tickers.length})
        let resp = await alpaca.getMultiBarsV2(list[i], {
            limit: 10000000,
            start: moment().subtract(10, "days").format(), //  days ago
            end: moment().subtract(0, "days").subtract(20, "minutes").format(), // yesterday
            timeframe: "1Day",
        }, alpaca.configuration)

            for await (let t of resp) {
                bars.push({
                    ticker: t[0],
                    bars: t[1].map(b => {
                        return {
                        Timestamp: b.Timestamp,
                        OpenPrice: b.OpenPrice,
                        HighPrice: b.HighPrice,
                        LowPrice: b.LowPrice,
                        ClosePrice: b.ClosePrice,
                        Volume: b.Volume
                        }
                    })
                });
           }
        
        }
        const today = new Date();
        startOfYesterday = new Date(today);
        startOfYesterday.setDate(today.getDate() - 1);


        for(t of tickerList) {
            if(t) {
            let iterationBars = bars.filter(b=>b.ticker == t.ticker)
            if(iterationBars.length == 0) continue;
            let localBars = iterationBars[0].bars.filter(b=> b.Timestamp > t.bars[t.bars.length-2].Timestamp)
            t.bars.pop()
            for(b of localBars) t.bars.push(b)
            }
        }
        jsonWriter(tickerList)
        console.log("Complete")
    },
    
    getDefaultList: () => ['AAPL', 'SPY']
}


module.exports=barHandler