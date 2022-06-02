import {HTMLLayout} from "./src/UI/Layout";
import {styles} from "./src/UI/Styles";
import {UI} from "./UI";
import {testGrammar} from "./src/grammarExamples";

class Grammar{
    constructor() {
        this.divId = "grammar";
        this.state = {};
        this.grammar = null;
    }

    init(divId, taskWidth, config, ...args){
        this.divId = divId;
        this.config = config;
        this.grammar = this.config.grammar;

        document.head.insertAdjacentHTML("beforeend", this.getCSS()); //Вставляем CSS
        document.querySelector("#" + this.divId).innerHTML = this.getLayout();

        const userInterface = new UI(this.grammar);
        this.userInterface = userInterface;
        userInterface.start();

    }
    reset(){

    }

    //Возвращаетм {grammar1, grammar2} - 1 ученика, 2 эталонная
    solution(){
        if(this.userInterface){
            return this.userInterface.getGrammars();
        }
    }

    load(solution){

    }

    getLayout(){
        return HTMLLayout;
    }
    getCSS(){
        return styles;
    }
}

export function magic(){
    return new Grammar()
}
const grammar = magic();

grammar.init("grammar", 1920, {grammar: testGrammar}
);