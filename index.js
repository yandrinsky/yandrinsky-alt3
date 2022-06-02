import Engine from "./src/Engine";
import {Loading} from "./src/UI/Loading";
import {styles} from "./src/UI/Styles";


let loader = new Loading({id: "loading"});


function setWorker(){
    const worker = new Worker(new URL('./src/worker/app.worker.js', import.meta.url));
    worker.onmessage = ({ data: {message, payload}}) => {
        switch (message){
            case "NEXT":
                loader.next();
                break
            case "FINAL":
                loader.final(payload);
                break
            case "GEN_1":
                document.querySelector(".textarea_1").value = payload.map(item => item + "\t").join("");
                break
            case "GEN_2":
                document.querySelector(".textarea_2").value = payload.map(item => item + "\t").join("");
                break
            case "ERROR":
                loader.error(payload);
                break
        }
    };

    worker.onerror = e => {
        alert("Что-то пошло не так")
    }
    return worker;
}

function saveGrammars({grammar1, grammar2}){
    localStorage.setItem("grammars", JSON.stringify({grammar1, grammar2}));
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
            item.onkeypress = e => {
                e.preventDefault();
                if (!/[А-Яа-я]/g.test(e.key)) {
                    e.target.value += e.key;
                }
            }
            item.onpaste = e => {

                let sign = (event.clipboardData || window.clipboardData).getData('text');
                console.log("sign", sign);
                if (/[А-Яа-я]/g.test(sign)) {
                    e.preventDefault();
                }
            }
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


    function compare(){
        const worker = setWorker();

        loader.setOnCloseObserver(() => {
            worker.terminate();
        })

        let {grammar1, grammar2} = getGrammars();
        worker.postMessage({message: "start", payload: {grammar1, grammar2}});
    }

    document.querySelector(".compare").onclick = compare;

    recoverRules(getStoredGrammars());
    setInputSelectors();

    function getStyles(){
        return styles;
    }
    document.head.insertAdjacentHTML("beforeend", getStyles());
}

//ответа выдается процент слов, не принадлежащих заданному языку, и процент слов языка, которые не описывает построенная грамматика

UI();

export {Engine};