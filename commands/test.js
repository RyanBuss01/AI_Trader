const tools = require('../public/tools/tools')
let fullBars = require('../json/bars.json');
const fullBars2 = require('../json/bars2.json');
fullBars.push(...fullBars2)

console.log('-------TEST-------')

let bars = fullBars.filter(t=> t.ticker == 'SPY')[0].bars
let data = bars.map(b=>b.ClosePrice)

let {line, signal} = tools.getStochRsi(data)

console.log(line[line.length-1])