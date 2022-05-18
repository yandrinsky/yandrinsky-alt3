import Engine from "./src/Engine";
let engine = new Engine();
// grammar:
let a = [
    {sign: "S", res: "AB"},
    {sign: "A", res: "BB"}, {sign: "A", res: "a"},
    {sign: "B", res: "AB"}, {sign: "B", res: "b"},
]

let b = [
    {sign: "S", res: "AB"},
    {sign: "A", res: "BB"}, {sign: "A", res: "a"},
    {sign: "B", res: "F"}, {sign: "F", res: "AB"},
    {sign: "B", res: "b"},
]

let c = [
    {sign: "S", res: "aA"},
    {sign: "A", res: "+aA"},
    {sign: "A", res: ""}
]

let d = [
    {sign: "S", res: "A"},
    {sign: "A", res: "BC"}, {sign: "A", res: "CB"},
    {sign: "B", res: "bB"}, {sign: "B", res: ""},
    {sign: "C", res: "cC"}, {sign: "C", res: ""},
]

engine.setGrammar(a);
engine.setSettings({
    RESULT_LIMIT: 1000,
});

let result = engine.generation();
console.log(result);

//
// //accbbbbbbbbbbbbbbb
// console.log("result.length", result.length);
// console.log("result", result);
//
// console.log("time to check", engine.speedtest(()=> {
//     console.log("check", engine.checkWord(result[1111]));
// }));



// engine.setGrammar(a);
//
//
// let result = engine.generation();
// engine.setGrammar(b);
// let result2 = engine.generation();
//
// let compRes = engine.compareTwo(result, result2)
//
// console.log("result.length", result.length);
// console.log("result", result);
//
// console.log("result2.length", result.length);
// console.log("result2", result2);
//
// console.log("compRes", compRes);
//
// console.log(engine.speedtest(()=> {
//     engine.checkWord("baaaaadab");
// }));

//bbabbbababbaab


// let newRules = CHF(engine.options.transformer());
// let len = 101;
// console.log("trans", engine.options.transformer());
//
// let words = result.filter(word => word.length <= 20);
// console.log("words.len", words.length);
// let start = Date.now();
//console.log("CYK", CYK_algorithm(newRules, "b".repeat(12)),"len: " + result[len].length, result[len]);
//words.map(word => CYK_algorithm(newRules, word));
// let time = Date.now() - start;
//
// console.log("time", time);


// result.map(word => CYK_algorithm(newRules, word));
// console.log(result);


//CYK 1 len: 18  bbabbbabaabbbabbbb
//time 1264

// CYK 1 len: 18 bbabbbabbbabbbbbbb time 14000
//               bbabbbaabababababb time 34
//               bbabbbbbbbbbbbbbbb time 142934
