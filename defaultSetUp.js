const methods = require("./methods/socketMethods.js")

console.log("Running bar set up")
await methods.getBars(false, 'default')
console.clear()
console.log("Default Bar Json complete")
