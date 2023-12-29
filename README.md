# AI_Trader
Using technical analysis and AI learning models to predict stock price movement

## File Set Up

before running node set up json files by running

```bash
npm run build
```

## API Set Up
set up alpaca api by creating .env file and adding key-id and secret like so: 
```bash
ALPACA_KEY_ID="xxx"
ALPACA_SECRET_KEY="xxx"
```

### NOTE: 
if you want to use alternate api simply update getMultiBars() and getMultiBarsRefresh() in functions/barHandler.js and map the bars to match setup


