const tools = require('../public/tools/tools')
let fullBars = require('../json/bars.json');
const fullBars2 = require('../json/bars2.json');
fullBars.push(...fullBars2)

console.log('-------TEST-------')

// let bars = fullBars.filter(t=> t.ticker == 'SPY')[0].bars

for(let i=0; i<fullBars.length; i++) {
    let bars = fullBars[i].bars
    let isDoji = tools.isDojiCandle(bars)
    if(isDoji) console.log(fullBars[i].ticker)
}


// console.log(line[line.length-1])