import {Loading} from "./src/UI/Loading";
import {styles} from "./src/UI/Styles";


export class UI {
    constructor(grammar) {
        this.grammar = grammar;
    }
    setWorker(loader){
        const worker = new Worker(new URL('./src/worker/app.worker.js', import.meta.url));
        worker.onmessage = ({ data: {message, payload}}) => {
            switch (message){
                case "COMPARE_START":
                    loader.setSteps([
                        "Смотрим принадлежность грамматикам 2/2",
                        "Сопоставляем",
                        "Смотрим принадлежность грамматикам 1/2",
                        "Сопоставляем",
                        "Генерируем слова 2/2",
                        "Генерируем слова 1/2",
                    ])
                    break
                case "CHECKING_USER_WORD":
                    loader.setSteps([
                        "Проверяем слово...",
                    ])
                    break
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
                    // document.querySelector(".textarea_2").value = payload.map(item => item + "\t").join("");
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
    saveGrammars({grammar1, grammar2}){
        localStorage.setItem("grammars", JSON.stringify({grammar1, grammar2}));
    }

    getGrammars(){
        let grammar1 = [];
        let grammar2 = this.grammar;
        let rules = document.querySelectorAll(".rules");
        rules[0].querySelectorAll(".ruleBlock").forEach(rule => {
            grammar1.push({
                sign: rule.children[0].value, res: rule.children[2].value
            })
        })
        console.warn("ГРАММАТИКА\n", JSON.stringify({
            grammar: grammar1,
        }));

        return {grammar1, grammar2};
    }

    formRule(sign, res, disabled) {
        return `<div class="ruleBlock">
            <input type="text" class="term_input" value="${sign ? sign : ""}" ${disabled ? "disabled" : ""}>
            <span>=></span>
            <input type="text" class="noterm_input input" value="${res ? res : ""}">
            ${
            !disabled ? "<div class=\"del\">D</div>" : ""
        }
        </div>`
    }

    recoverRules({grammar1, grammar2}) {
        let rules1 = grammar1.map((rule, index) => this.formRule(rule.sign, rule.res, rule.sign === "S" && index === 0)).join("");
        // let rules2 = grammar2.map((rule, index) => this.formRule(rule.sign, rule.res, rule.sign === "S" && index === 0)).join("");
        if (rules1) {
            document.querySelector(".rules.rules1").insertAdjacentHTML("beforeend", rules1);
        }
        // if(rules2){
        //     document.querySelector(".rules.rules2").insertAdjacentHTML("beforeend", rules2);
        // }
    }

    getStoredGrammars() {
        let grammars = JSON.parse(localStorage.getItem("grammars"));
        return grammars ? grammars : {grammar1: [{sign: "S", res: ""}], grammar2: [{sign: "S", res: ""}]}
    }

    ruleValidator(str){
        return !/[А-Яа-я~]/g.test(str);
    }

    signValidator(str){
        return /[a-z|A-Z]/.test(str)
    }

    start() {
        //Создаём экземпляр Loader
        let loader = new Loading({id: "loading"});

        //Навешиваем observers
        loader.setOnCloseObserver(() => {
            document.querySelector(".compare").classList.remove("hide");
        })
        loader.setOnNextObserver(() => {
            document.querySelector(".compare").classList.add("hide");
        })

        //Чистим textarea
        document.querySelector("#genFiend").value = "";


        //Добавление слушателей событий на input правил грамматики
        const setInputSelectors = () => {
            document.querySelectorAll(".term_input").forEach(item => {
                item.onkeypress = e => {
                    e.preventDefault();
                    if (this.signValidator(e.key)) {
                        e.target.value = e.key.toUpperCase();
                    }
                }
                item.onpaste = e => {
                    e.preventDefault();
                    let sign = (event.clipboardData || window.clipboardData).getData('text')[0].toUpperCase();
                    if (this.signValidator(sign)) {
                        e.target.value = sign;
                    }
                }

                item.onblur = e => this.saveGrammars(this.getGrammars());
            })
            document.querySelectorAll(".noterm_input").forEach(item => {
                item.onblur = e => this.saveGrammars(this.getGrammars());
                item.onkeypress = e => {
                    if (!this.ruleValidator(e.key)) {
                        e.preventDefault();
                    }
                }
                item.onpaste = e => {
                    let sign = (event.clipboardData || window.clipboardData).getData('text');
                    if (!this.ruleValidator(sign)) {
                        e.preventDefault();
                    }
                }
            });
            document.querySelectorAll(".del").forEach(item => {
                item.onclick = e => {
                    e.target.parentNode.remove();
                    this.saveGrammars(this.getGrammars())
                }

            });
        }


        //Добавляем слушатель события на кнопку добавить правило
        document.querySelectorAll(".add_ruleBlock").forEach(item => {
            item.onclick = e => {
                document.querySelector(`.rules.rules${item.dataset.type}`).insertAdjacentHTML("beforeend", this.formRule())
                setInputSelectors();
                this.saveGrammars(this.getGrammars());
            }

        });

        //Функция запустится по нажатию кнопки "сравить"
        function compare(e) {
            const worker = this.setWorker(loader);
            loader.setOnCloseObserver(() => {
                worker.terminate();
                //активирует кнопку "сравнить после" закрытия окна
                e.target.classList.remove("hide");
            })
            let {grammar1, grammar2} = this.getGrammars();
            worker.postMessage({message: "START", payload: {grammar1, grammar2}});
        }

        //Функция запустится по нажатию кнопки "Проверить"
        function checkUserWord(e) {
            const worker = this.setWorker(loader);
            loader.setOnCloseObserver(() => {
                worker.terminate();
                //активирует кнопку "сравнить после" закрытия окна
                document.querySelector(".compare").classList.remove("hide");
            })
            let {grammar1, grammar2} = this.getGrammars();
            let word = document.querySelector(".check_word_input").value;
            worker.postMessage({message: "CHECKING_USER_WORD", payload: {grammar1, grammar2, word}});
        }


        document.querySelector(".compare").onclick = compare.bind(this);
        document.querySelector(".check_word_button").onclick = checkUserWord.bind(this);

        //Восстанавливаем правила из прошлой сессии
        this.recoverRules(this.getStoredGrammars());
        //Навешиваем слушатели события на input грамматик
        setInputSelectors();
    }
}
