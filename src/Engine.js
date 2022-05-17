class Options{
    constructor() {
        this.rules = {
            cluster: {},
            transformedCluster: {},
            //{"S":"AB", "A":["BB", "a"], "B":["AB", "b"]}
            //Грамматики 3-го типа
            //Что за фигня с построением

            // grammar: [
            //     {sign: "S", res: "AB"},
            //     {sign: "A", res: "BB"}, {sign: "A", res: "a"},
            //     {sign: "B", res: "AB"},
            //     {sign: "B", res: "b"},
            // ],

            // grammar: [
            //     {sign: "S", res: "A"},
            //     {sign: "A", res: "B"}, {sign: "A", res: "C"}, {sign: "B", res: "E"},
            //     {sign: "C", res: "b"},
            //     {sign: "E", res: "A"},
            //     {sign: "E", res: "abc"},
            // ],

            // grammar: [
            //     {sign: "S", res: "A"},
            //     {sign: "A", res: "A"}, {sign: "A", res: "b"}, {sign: "A", res: "abc"}, {sign: "A", res: "A"},
            //
            // ],

            //
            // grammar: [
            //     {sign: "S", res: "Aa"},
            //     {sign: "A", res: "B+"}, {sign: "B", res: "Aa"},
            //     {sign: "B", res: "a"}
            // ],
            //[ 'a', '+a', 'a+a', '+a+a', 'a+a+a' ]
            //[ 'a', 'aa', 'aaa', 'a+aa', 'a+a+a' ]
            // grammar: [
            //     {sign: "S", res: "AC"},
            //     {sign: "A", res: "BF"}, {sign: "B", res: "AC"},
            //     {sign: "B", res: "a"},
            //     {sign: "C", res: "a"},
            //     {sign: "F", res: "+"},
            // ],
            // grammar: [
            //     {sign: "S", res: "Aa"},
            //     {sign: "A", res: "B+"}, {sign: "B", res: "Ca"},
            //     {sign: "C", res: "a+"}
            // ],
            // grammar: [
            //     {sign: "S", res: "aA"},
            //     {sign: "A", res: "+aA"}
            // ],
            // grammar: [
            //     {sign: "S", res: "A"},
            //     {sign: "A", res: "aBc"},
            //     {sign: "B", res: "deA"},
            //     {sign: "B", res: ""},
            // ],
            // grammar: [
            //     {sign: "S", res: "aaaA"},
            //     {sign: "A", res: "abcA"},
            //     {sign: "A", res: "bbb"},
            // ],

            //Контекстно свободные грамматики

            // grammar: [
            //     {sign: "S", res: "aabBBACbbb"},
            //     {sign: "A", res: "aaa"},
            // ],
            // grammar: [
            //     {sign: "S", res: "aSb"},
            //     {sign: "S", res: ""},
            // ],
            // grammar: [
            //     {sign: "S", res: "a"},
            // ],
            current: 0,
        }
    }

    grammarCluster(){
        this.rules.grammar.forEach(rule => {
            if(this.rules.cluster.hasOwnProperty(rule.sign)){
                this.rules.cluster[rule.sign].rules.push(rule);
            } else {
                this.rules.cluster[rule.sign] = {
                    rules: [rule],
                    current: -1,
                }
            }
        })
    }

    setTransformedCluster(){
        this.rules.transformedCluster = this.transformer();
    }

    setDeterminate(){
        this.determinate = [];
        this.rules.grammar.forEach(item => {
            let key = item.sign;
            if(!this.determinate.includes(key)){
                this.determinate.push(key);
            }
        })
    }

    transformer(){
        const res = {};
        for(let key in this.rules.cluster){
            let cur = this.rules.cluster[key].rules.map(item => item.res);
            res[key] = cur.length === 1 ? cur[0] : cur
        }
        return res;
    }

    setGrammar(grammar){
        this.rules.grammar = grammar;
    }

}
class Counter{
    constructor(counter = 0) {
        this.counter = counter;
    }
    getCurrent(){
        return this.counter
    }
    increaseCurrent(){
        this.counter += 1;
    }
}
import {combinationIndexes, replaceAllDeterminate, includes, Unambiguous_conversion} from "./library";

class Engine{
    constructor() {
        this.options = new Options();
        this.Counter = Counter;
        this.settings = {
            STACK_LIMIT: 1000,
            TREE_DEPTH_LIMIT: 500,
            RESULT_LIMIT: 1000,
            DEATH_TIME: 1500,
        }
    }

    system = {
        combinationIndexes,
        replaceAllDeterminate,
        includes,
    }

    setGrammar(grammar){
        this.options.setGrammar(grammar);

        this.options.setDeterminate();
        this.options.grammarCluster();
        this.options.setTransformedCluster();
    }

    setSettings(settings){
        this.settings = {...this.settings, ...settings};
    }

    generation(){
        let str = ["S"];

        let res = [];
        //let res = new Set();
        let totalDepth = new this.Counter();

        let timeStart = Date.now();

        let stack = [[str[0]], []];

        const start = (transformedCluster, TREE_DEPTH_LIMIT, RESULT_LIMIT, STACK_LIMIT, DEATH_TIME) => {

            while (totalDepth.getCurrent() < TREE_DEPTH_LIMIT && res.length < RESULT_LIMIT && (stack[0].length + stack[1].length < STACK_LIMIT)){
                if(Date.now() - timeStart >= DEATH_TIME) break
                let curStr = stack[0].shift();

                let {chains, words} = this.system.replaceAllDeterminate(curStr, transformedCluster, this.options.determinate, this.system.includes, STACK_LIMIT - stack[0].length - stack[1].length, RESULT_LIMIT - res.length);
                if(chains.length === 0 && words.length === 0){ //Если никаких изменений не произошло, значит это готове слово;
                    res.push(curStr);
                }
                res.push(...words);

                if(stack[0].length === 0) {
                    if (chains.length === 0 && stack[1].length === 0) {
                        break;
                    }
                    stack.shift();
                    totalDepth.increaseCurrent();
                    stack[0] = [...stack[0], ...chains]
                    stack.push([]);
                }  else {
                    stack[1] = [...stack[1], ...chains]
                }
            }
        }

        start(this.options.rules.transformedCluster, this.settings.TREE_DEPTH_LIMIT, this.settings.RESULT_LIMIT, this.settings.STACK_LIMIT, this.settings.DEATH_TIME);
        console.log("totalDepth", totalDepth);

        console.log("stack", stack[0].length + stack[1].length);
        if(stack[0].length !== 0 || stack[1].length !== 0){
            let unambiguous = Unambiguous_conversion(this.options.transformer());
            start(unambiguous, this.settings.TREE_DEPTH_LIMIT, this.settings.RESULT_LIMIT, this.settings.STACK_LIMIT * 2, this.settings.DEATH_TIME)
        }
        console.log("stack", stack[0].length + stack[1].length);

        return res.sort((a, b) => a.length > b.length);
    }
}


export default Engine;
