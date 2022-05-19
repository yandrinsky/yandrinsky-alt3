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
    {sign: "A", res: "BC"} , {sign: "A", res: "CB"},
    {sign: "B", res: "bB"}, {sign: "B", res: ""},
    {sign: "C", res: "cC"}, {sign: "C", res: ""},
]

let my = [
    {sign: "S", res: "GN"},
    {sign: "N", res: "+GN"},
    {sign: "N", res: ""},
    {sign: "G", res: "x"},
    {sign: "G", res: "Kx"},
    {sign: "G", res: "xL"},
    {sign: "G", res: "KxL"},
    {sign: "K", res: "2M"}, {sign: "K", res: "3M"},
    {sign: "K", res: "4M"}, {sign: "K", res: "5M"},
    {sign: "K", res: "6M"}, {sign: "K", res: "7M"},
    {sign: "K", res: "8M"}, {sign: "K", res: "9M"},
    {sign: "M", res: ""},
    {sign: "M", res: "1M"}, {sign: "M", res: "2M"},
    {sign: "M", res: "3M"},    {sign: "M", res: "4M"},
    {sign: "M", res: "5M"},    {sign: "M", res: "6M"},
    {sign: "M", res: "7M"},    {sign: "M", res: "8M"},
    {sign: "M", res: "9M"},    {sign: "M", res: "0M"},
    {sign: "L", res: "^K"}, {sign: "L", res: ""},
]




//CYK 1 len: 18  bbabbbabaabbbabbbb
//time 1264

// CYK 1 len: 18 bbabbbabbbabbbbbbb time 14000
//               bbabbbaabababababb time 34
//               bbabbbbbbbbbbbbbbb time 142934

engine.setSettings({
    RESULT_LIMIT: 1000,
    STACK_LIMIT: 1000,
    DEATH_TIME: 2000,
});

// engine.setGrammar(my);
// let result = engine.generation();
// console.log(result);
// console.log("checkWord", engine.checkWord("22x^23+x^2+x"));
// engine.setGrammar(b);
// let result2 = engine.generation();
// console.log(result);
// console.log(result2);
//
//
// console.log("time compare", engine.speedtest(() => {
//     console.log("compare result", engine.compareTwo(result, result2));
// }));
//
//
// let check;
// console.log("time check", engine.speedtest(() => {
//     check = engine.unmatched(result, result2).map((item) => engine.checkWord(item));
// }));
//
// console.log("check result", check.filter(item => item === true).length / check.length * 100);
//

//Написать функцию сравнения двух грамматик
//1) Два режима - быстрый и глубокий
//2) Выводить несовпавшие слова
//3) Выводить процент совпадения

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


const UI = () => {
    const setInputSelectors = () => {
        document.querySelectorAll(".term_input").forEach(item => {
            item.onkeypress = e => {
                e.preventDefault();
                if (!(e.target.value.length >= 1)) {
                    if (/[a-z|A-Z]/.test(e.key)) {
                        e.target.value += e.key.toUpperCase();
                    }
                }
            }
            item.onpaste = e => {
                e.preventDefault();
                let sign = (event.clipboardData || window.clipboardData).getData('text')[0].toUpperCase();
                if (/[a-z|A-Z]/.test(sign)) {
                    e.target.value = sign;
                }
            }

            item.onblur = e => saveGrammars(getGrammars());
        })
        document.querySelectorAll(".noterm_input").forEach(item => {
            item.onblur = e => saveGrammars(getGrammars());
        });
        document.querySelectorAll(".del").forEach(item => {
            item.onclick = e => {
                e.target.parentNode.remove();
                saveGrammars(getGrammars())
            }

        });
    }

    function formRule(sign, res, disabled){
        return `<div class="ruleBlock">
            <input type="text" class="term_input" value="${sign ? sign : ""}" ${disabled ? "disabled" : ""}>
            <span>=></span>
            <input type="text" class="noterm_input" value="${res ? res : ""}">
            ${
                sign !== "S" ? "<div class=\"del\">D</div>" : ""
            }
        </div>`
    }

    function recoverRules({grammar1, grammar2}){
        let rules1 = grammar1.map(rule => formRule(rule.sign, rule.res, rule.sign === "S")).join("");
        let rules2 = grammar2.map(rule => formRule(rule.sign, rule.res, rule.sign === "S")).join("");
        if(rules1){
            document.querySelector(".rules.rules1").insertAdjacentHTML("beforeend", rules1);
        }
        if(rules2){
            document.querySelector(".rules.rules2").insertAdjacentHTML("beforeend", rules2);
        }

    }

    document.querySelectorAll(".add_ruleBlock").forEach(item => {
        item.onclick = e => {
            document.querySelector(`.rules.rules${item.dataset.type}`).insertAdjacentHTML("beforeend", formRule())
            setInputSelectors();
            saveGrammars(getGrammars());
        }

    });

    function saveGrammars({grammar1, grammar2}){
        localStorage.setItem("grammars", JSON.stringify({grammar1, grammar2}));
    }
    function getStoredGrammars(){
        let grammars = JSON.parse(localStorage.getItem("grammars"));
        return grammars ? grammars : {grammar1: [{sign: "S", res: ""}], grammar2: [{sign: "S", res: ""}]}
    }

    function getGrammars(){
        let grammar1 = [];
        let grammar2 = [];
        let rules = document.querySelectorAll(".rules");
        rules[0].querySelectorAll(".ruleBlock").forEach(rule => {
            grammar1.push({
                sign: rule.children[0].value, res: rule.children[2].value
            })
        })
        rules[1].querySelectorAll(".ruleBlock").forEach(rule => {
            grammar2.push({
                sign: rule.children[0].value, res: rule.children[2].value
            })
        })
        return {grammar1, grammar2};
    }

    document.querySelector(".compare").onclick = e => {
        let {grammar1, grammar2} = getGrammars();
        saveGrammars({grammar1, grammar2});

        console.log("rules1", grammar1);
        console.log("rules2", grammar2);
        engine.setGrammar(grammar2);
        let result2 = engine.generation();
        engine.setGrammar(grammar1);
        let result1 = engine.generation();

        const unmatched = engine.unmatched(result2, result1);
        let check = unmatched.length ? unmatched.map((item) => engine.checkWord(item)) : [true];
        document.querySelector(".textarea_1").value = result1.map(item => item + "\t").join("");
        document.querySelector(".textarea_2").value = result2.map(item => item + "\t").join("");
        console.log("result1", result1);
        console.log("result2", result2);
        console.log("check", check);
        alert(check.filter(item => item === true).length / check.length * 100)
    };
    recoverRules(getStoredGrammars());
    setInputSelectors();

}

UI();