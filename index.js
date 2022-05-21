import Engine from "./src/Engine";
let engine = new Engine();
let engine2 = new Engine();
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
                 !disabled ? "<div class=\"del\">D</div>" : ""
            }
        </div>`
    }

    function recoverRules({grammar1, grammar2}){
        let rules1 = grammar1.map((rule, index) => formRule(rule.sign, rule.res, rule.sign === "S" && index === 0)).join("");
        let rules2 = grammar2.map((rule, index) => formRule(rule.sign, rule.res, rule.sign === "S" && index === 0)).join("");
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
        engine.setSettings({
            RESULT_LIMIT: 1000,
            STACK_LIMIT: 10000,
            DEATH_TIME: 1500,
            PROCESS_STACK: true,
        });
        let {grammar1, grammar2} = getGrammars();
        saveGrammars({grammar1, grammar2});
        engine.setGrammar(grammar1);
        engine2.setGrammar(grammar2);
        let result1 = engine.generation();
        let result2 = engine2.generation();
        document.querySelector(".textarea_1").value = result1.map(item => item + "\t").join("");
        document.querySelector(".textarea_2").value = result2.map(item => item + "\t").join("");
        // let unmatched = engine.unmatched(result1, result2);
        // console.log("unmatched 1", unmatched.length);
        // let check = unmatched.length ? unmatched.map((item) => engine2.checkWord(item)) : [true];
        // alert((check.filter(item => item === true).length + result1.length - check.length) / result1.length * 100)
        //
        // unmatched = engine2.unmatched(result2, result1);
        // console.log("unmatched 2", unmatched.length);
        // check = unmatched.length ? unmatched.map((item) => engine.checkWord(item)) : [true];
        // alert((check.filter(item => item === true).length + result2.length - check.length) / result2.length * 100)
        // console.log("result1", result1);
        // console.log("result2", result2);
    };
    recoverRules(getStoredGrammars());
    setInputSelectors();

}

UI();