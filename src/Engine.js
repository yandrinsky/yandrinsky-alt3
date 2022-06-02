import {
    combinationIndexes,
    replaceAllDeterminate,
    includes,
    Unambiguous_conversion,
    CHF, CYK_algorithm2
} from "./library";
import {correct_grammar_check} from "./check/check";

class Options{
    constructor() {
        this.rules = {
            cluster: {},
            transformedCluster: {},
            current: 0,
        }
    }

    grammarCluster(){
        const add = (rule) => {
            if(this.rules.cluster.hasOwnProperty(rule.sign)){
                this.rules.cluster[rule.sign].rules.push(rule);
            } else {
                this.rules.cluster[rule.sign] = {
                    rules: [rule],
                    current: -1,
                }
            }
        }

        let reg = /\$ANY\(.-.\)/g;
        this.rules.cluster = {};
        this.rules.grammar.forEach(rule => {
            let match = rule.res.match(reg);
            let determinates = [];
            if(match){
                let TC = {};
                let alphabet = ["а", "б", "в", "г", "д", "е", "ё", "ж", "з", "и", "й", "к", "л", "м", "н"]
                let res = rule.res;
                match.forEach(item => {
                    let rules = [];
                    let [start, end] = item.slice(item.indexOf("(") + 1, item.indexOf(")")).split("-");
                    for (let i = start; i <= end; i++) {
                        rules.push(String(i));
                    }
                    let sign = alphabet.pop()
                    res = res.replaceAll(item, sign)
                    determinates.push(sign);
                    return TC[sign] = rules;
                })
                // console.log("res", res);
                // console.log("TC", TC);
                // console.log("determinates", determinates);
                let {chains, words} = replaceAllDeterminate(res, TC, determinates, includes, 1000, 1000);
                words.forEach(word => add({sign: rule.sign, res: word}));
            } else {
                add(rule);
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

    setNormal(){
        //NormalizedTransformedCluster
        this.rules.NTC = CHF(this.transformer());
    }
    setUnambiguous(){
        //UnambiguousTransformedCluster
        this.rules.UTC = Unambiguous_conversion(this.transformer());
    }

    checkGrammar(){
        const res = correct_grammar_check(this.rules.transformedCluster);
        if(!res){
            throw new Error("Грамматика составлена некорректно");
        }
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

class Engine{
    constructor() {
        this.options = new Options();
        this.Counter = Counter;
        this.settings = {
            STACK_LIMIT: 1000,
            TREE_DEPTH_LIMIT: 1000,
            RESULT_LIMIT: 1000,
            DEATH_TIME: 1500,
            PROCESS_STACK: true,
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

        //Может выкинуть ошибку
        this.options.checkGrammar();
        this.options.setNormal();
        this.options.setUnambiguous();
    }

    setSettings(settings){
        this.settings = {...this.settings, ...settings};
    }

    generation(){
        let str = ["S"];

        //let res = [];
        let res = new Set();
        let totalDepth = new this.Counter();

        let timeStart = Date.now();

        let stack = [[str[0]], []];

        const start = (transformedCluster, TREE_DEPTH_LIMIT, RESULT_LIMIT, STACK_LIMIT, DEATH_TIME) => {

            while (totalDepth.getCurrent() < TREE_DEPTH_LIMIT && res.size < RESULT_LIMIT && (stack[0].length + stack[1].length < STACK_LIMIT)){
                if(Date.now() - timeStart >= DEATH_TIME) break
                let curStr = stack[0].shift();

                let {chains, words} = this.system.replaceAllDeterminate(curStr, transformedCluster, this.options.determinate, this.system.includes, STACK_LIMIT - stack[0].length - stack[1].length, RESULT_LIMIT - res.length);
                if(chains.length === 0 && words.length === 0){ //Если никаких изменений не произошло, значит это готове слово;
                    //res.push(curStr);
                    res.add(curStr);
                }
                //res.push(...words);
                words.forEach(word => res.size < RESULT_LIMIT ? res.add(word) : null);

                if(stack[0].length === 0) {
                    if (chains.length === 0 && stack[1].length === 0) {
                        break;
                    }
                    stack.shift();
                    totalDepth.increaseCurrent();
                    stack[0] = [...stack[0], ...chains].sort((a, b) => a.length > b.length);
                    stack.push([]);
                }  else {
                    stack[1] = [...stack[1], ...chains]
                }
            }
        }


        start(this.options.rules.transformedCluster, this.settings.TREE_DEPTH_LIMIT, this.settings.RESULT_LIMIT, this.settings.STACK_LIMIT, this.settings.DEATH_TIME);
        // console.log("totalDepth", totalDepth.counter);
        //
        // console.log("stack", stack[0].length + stack[1].length);
        // console.log("res", res.size);
        if(this.settings.PROCESS_STACK && (stack[0].length !== 0 || stack[1].length !== 0)){
            totalDepth.counter = 0;
            let unambiguous = Unambiguous_conversion(this.options.transformer());
            stack[0] = stack[0].sort((a, b) => a.length > b.length);
            stack[1] = stack[1].sort((a, b) => a.length > b.length);
            start(unambiguous, this.settings.TREE_DEPTH_LIMIT, this.settings.RESULT_LIMIT, this.settings.STACK_LIMIT * 2, this.settings.DEATH_TIME)
        }
        // console.log("stack", stack[0].length + stack[1].length);
        // console.log("res", res.size);
        res = Array.from(res);
        return res.sort((a, b) => a.length > b.length);
    }

    compareTwo(res1, res2){
        let count = 0;
        let minLen = res1.length <= res2.length ? res1.length : res2.length;
        if(res1.length >= res2.length){
            res2.forEach(item => {
                if(res1.indexOf(item) !== -1) count += 1
            })
        } else {
            res1.forEach(item => {
                if(res2.indexOf(item) !== -1) count += 1
            })
        }

        return count / minLen * 100;
    }

    unmatched(target, ideal){
        let unmatched = [];
        target.forEach(item => {
            if(ideal.indexOf(item) === -1){
                unmatched.push(item);
            }
        })
        return unmatched;
    }

    checkWord(word){
        return CYK_algorithm2(this.options.rules.NTC, word);
    }

    static speedtest(callback){
        let start = Date.now();
        callback();
        return Date.now() - start;
    }
}


export default Engine;
