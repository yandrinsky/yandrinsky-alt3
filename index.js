import Engine from "./src/Engine";
let engine = new Engine();
let engine2 = new Engine();

class Loading{
    constructor({id}) {
        this.step = -1;
        this.steps = [
            "Генерируем слова 1/2",
            "Генерируем слова 2/2",
            "Сопоставляем",
            "Смотрим принадлежность грамматикам 1/2",
            "Сопоставляем",
            "Смотрим принадлежность грамматикам 2/2",
        ]
        this.id = id;
        this.element = document.querySelector("#" + id);
        this.loadingStep = this.element.querySelector(".layout").querySelector(".loading_step");
        this.resultField = this.element.querySelector(".layout").querySelector(".result");
        this.loadingStep.innerHTML = "";
    }

    next(){
        this.element.classList.remove("hide");
        this.step += 1;
        this.loadingStep.innerHTML = this.steps[this.step];
    }
    final({check1, check2}){
        this.resultField.innerHTML = `${check1} | ${check2}`;
    }
}

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

const worker = new Worker(new URL('./src/app.worker.js', import.meta.url));
let loader = new Loading({id: "loading"});

worker.onmessage = ({ data: {message, payload}}) => {
    switch (message){
        case "NEXT":
            //loader.next();
            break
        case "FINAL":
            //loader.final(payload);
            alert(`${payload.check1} | ${payload.check2}`)
            break
        case "GEN_1":
            document.querySelector(".textarea_1").value = payload.map(item => item + "\t").join("");
            break
        case "GEN_2":
            document.querySelector(".textarea_2").value = payload.map(item => item + "\t").join("");
            break
    }
    console.log("worker.onmessage", message);
};
worker.onerror = e => {
    alert("Что-то пошло не так")
}


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
            STACK_LIMIT: 2000,
            DEATH_TIME: 1500,
            PROCESS_STACK: true,
        });
        // worker.postMessage({
        //     question:
        //         'The Answer to the Ultimate Question of Life, The Universe, and Everything.',
        // });
        // loader.next();
        let {grammar1, grammar2} = getGrammars();
        worker.postMessage({message: "start", payload: {grammar1, grammar2}});
        // saveGrammars({grammar1, grammar2});
        // engine.setGrammar(grammar1);
        // engine2.setGrammar(grammar2);
        // console.log("engine.generation", engine.generation);


        // let result1 = engine.generation();
        // let result2 = engine2.generation();
        // document.querySelector(".textarea_1").value = result1.map(item => item + "\t").join("");
        // document.querySelector(".textarea_2").value = result2.map(item => item + "\t").join("");
        //-----------------
        //console.log("engine2", engine2.options.rules.transformedCluster);

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
    function getStyles(){
        return `<style>
        body{
            margin: 0;
            padding: 0;
        }
        .rules{
            display: flex;
            flex-direction: column;
        }
        .ruleBlock{
            display: flex;
            align-items: center;
            font-family: Calibri;
            margin-top: 10px;
        }
        .term_input{
            width: 25px;
            height: 25px;
            margin-right: 10px;
            padding: 5px;
            font-size: 20px;
            text-align: center;
        }
        .noterm_input{
            height: 25px;
            padding: 5px;
            font-size: 16px;
            margin-left: 10px;
        }
        .add_ruleBlock{
            width: 30px;
            height: 30px;
            border-radius: 100%;
            border: 1px solid black;
            display: flex;
            justify-content: center;
            align-items: center;
            background-color: greenyellow;
            font-size: 20px;
            padding: 0px;
            cursor: pointer;
            margin-top: 10px;
            margin-left: 3px;
        }
        .compare{
            margin-top: 30px;
            padding: 5px;
            background-color: greenyellow;
        }
        .side{
            width: 100%;
            margin-left: 10px;
        }
        .side:first-of-type{
            border-right: 1px solid black;
        }
        .layout{
            display: flex;
        }
        .del{
            width: 15px;
            height: 15px;
            background-color: orangered;
            padding: 5px;
            display: flex;
            justify-content: center;
            align-items: center;
            border-radius: 100%;
            margin-left: 10px;
            cursor: pointer;
        }
    </style>`
    }


    document.head.insertAdjacentHTML("beforeend", getStyles());

}

//ответа выдается процент слов, не принадлежащих заданному языку, и процент слов языка, которые не описывает построенная грамматика

UI();

export {Engine, engine, engine2};