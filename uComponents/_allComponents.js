// using older js modules for the sake of plain node
var fs = require("fs");

let c1 = require('./template1')
let c2 = require('./template2')
let c3 = require('./template3')
let c4 = require('./template4')
let c090 = require('./c090')
let c100 = require('./c100')
let c101 = require('./c101')
let c102 = require('./c102')
let c104 = require('./c104')

// don't forget to also add them to the combo destructuring statement:
let combo = { ...c1, ...c2, ...c3, ...c4, ...c090, ...c100, ...c101, ...c102, ...c104 };


let comboString = `let megaComponentObject = ${JSON.stringify(combo)}`
fs.writeFileSync("./dist/generatedFiles/megaComponentObject.js", comboString)

module.exports = 'complete';