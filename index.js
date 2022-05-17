import Engine from "./src/Engine";

let engine = new Engine();

engine.setGrammar([
    {sign: "S", res: "AB"},
    {sign: "A", res: "BB"}, {sign: "A", res: "a"},
    {sign: "B", res: "AB"},
    {sign: "B", res: "b"},
]);

// engine.setSettings({
//     TREE_DEPTH: 10
// })

let result = engine.generation();

console.log(result);
