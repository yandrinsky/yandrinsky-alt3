class Options{
    constructor() {
        this.rules = {
            cluster: {},
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


            grammar: [
                {sign: "S", res: "Aa"},
                {sign: "A", res: "B+"}, {sign: "B", res: "Aa"},
                {sign: "B", res: "a"}
            ],
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

function CHF(obj_rule){
    start_el(obj_rule);
    del_epsilon(obj_rule);
    some_term_sign(obj_rule)
    some_noterm_sign(obj_rule)
    go_myself_del(obj_rule)
    one_noterm(obj_rule);
    return obj_rule;
}

function start_el(obj_rule){
    obj_rule["S0"] = "S";
}

function go_myself_del(obj_rule){
    for(let key in obj_rule){
        if(typeof(obj_rule[key]) === "object"){
            for(let i = 0; i < obj_rule[key].length; i++){
                if(obj_rule[key][i] === key) obj_rule[key].splice(i, i)
            }
        }
    }
}

function one_noterm(obj_rule){
    let no_term_arr = [];
    let index = 0;
    let flag = true;
    let flag_2 = true;
    let flag_3;

    for(let key in obj_rule){
        no_term_arr[index] = key;
        index += 1;
    }
    while(flag){
        flag = false;
        for(let key in obj_rule){
            if(obj_rule[key].length === 1 && typeof(obj_rule[key]) === "string" && key !== "S0"){
                for(let i = 0; i < no_term_arr.length; i++){
                    if(obj_rule[key] === no_term_arr[i]){
                        flag = true;
                        obj_rule[key] = go_to_norm_rule(obj_rule, no_term_arr, obj_rule[key]);
                    }
                }
            }
            else if(typeof(obj_rule[key]) === "object"){
                for(let j = 0; j < obj_rule[key].length; j++){
                    if(obj_rule[key][j].length === 1){
                        for(let i = 0; i < no_term_arr.length; i++){
                            if(obj_rule[key][j] === no_term_arr[i] && key !== "S0"){

                                flag = true;
                                obj_rule[key][j] = go_to_norm_rule(obj_rule, no_term_arr, obj_rule[key][j]);
                                let stop = 0;
                                for(let key3 in obj_rule){
                                    if(typeof(obj_rule[key3]) === "object"){
                                        for(let w = 0; w < obj_rule[key3].length; w++){
                                            if(typeof(obj_rule[key3][w]) === "object"){
                                                for(let z = 0; z < obj_rule[key3][w].length; z++){
                                                    stop += 1;
                                                    obj_rule[key3].push(obj_rule[key3][w][z])
                                                }
                                                obj_rule[key3][w] = "";
                                                for(let p = w; p < obj_rule[key3].length - 1; p++){
                                                    obj_rule[key3][p] = obj_rule[key3][p + 1]
                                                }
                                                obj_rule[key3].pop();
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}

function go_to_norm_rule(obj_rule, no_term_arr, elem){
    let save;
    if(obj_rule[elem].length > 1) return obj_rule[elem];
    else{
        if(typeof(obj_rule[elem]) === "string"){
            for(let i = 0; i < no_term_arr.length; i++){
                if(obj_rule[elem] === no_term_arr[i]) save = go_to_norm_rule(obj_rule, no_term_arr, obj_rule[elem]);
            }
            if(save === undefined) return obj_rule[elem];
        }
        else{
            for(let i = 0; i < no_term_arr.length; i++){
                if(obj_rule[elem][0] === no_term_arr[i]) save = go_to_norm_rule(obj_rule, no_term_arr, obj_rule[elem][0]);
            }
            if(save === undefined) return obj_rule[elem];
        }
    }
    return save
}

function some_noterm_sign(obj_rule){
    let alf = ["б", "в", "г", "д", "е", "ё", "ж", "з", "и", "к", "л", "м", "н", "о", "п", "р", "с", "т"];
    let string;
    let save_string;
    let counter = 0;
    let flag = true;

    while(flag){
        string = null;
        for(let key in obj_rule){
            if(obj_rule[key].length > 2 && typeof(obj_rule[key]) === "string"){
                save_string = obj_rule[key].slice(1, obj_rule[key].length)
                string = obj_rule[key][0] + alf[counter];
                obj_rule[key] = string;
                obj_rule[alf[counter]] = save_string;
                counter += 1;
            }
            else if(typeof(obj_rule[key]) === "object"){
                for(let i = 0; i < obj_rule[key].length; i++){
                    if(obj_rule[key][i].length > 2){
                        save_string = obj_rule[key][i].slice(1, obj_rule[key][i].length)
                        string = obj_rule[key][i][0] + alf[counter];
                        obj_rule[key][i] = string;
                        obj_rule[alf[counter]] = save_string;
                        counter += 1;
                    }
                }
            }
        }
        if(string === null) flag = false;
    }
}

function some_term_sign(obj_rule){
    let arr_term = [];
    let alf = ["А", "Б", "В", "Г", "Д", "Е", "Ё", "Ж", "З", "И", "К", "Л", "М", "Н" , "О", "П", "Р", "С", "Т"];
    let save_term;
    let string;
    let index = 0;
    let arr_Nterm = [];
    let check_term = true;
    for(let key in obj_rule){
        if(typeof(obj_rule[key]) === "string" && obj_rule[key].length > 1){
            for(let i = 0; i < obj_rule[key].length; i++){
                for(let key_2 in obj_rule){
                    if(obj_rule[key][i] === key_2){
                        check_term = false;
                    }
                }
                if(check_term === true){
                    save_term = obj_rule[key][i];
                    string = obj_rule[key].slice(0, i) + `${alf[index]}` + obj_rule[key].slice(i + 1, obj_rule[key].length);
                    obj_rule[key] = string;
                    obj_rule[alf[index]] = save_term;
                    index += 1;
                }
                check_term = true;
            }
        }
        else if(typeof(obj_rule[key]) === "object"){
            for(let i = 0; i < obj_rule[key].length; i++){
                if(obj_rule[key][i].length > 1){
                    for(let j = 0; j < obj_rule[key][i].length; j++){
                        for(let key_2 in obj_rule){
                            if(obj_rule[key][i][j] === key_2){
                                check_term = false;
                            }
                        }
                        if(check_term === true){
                            save_term = obj_rule[key][i][j];
                            string = obj_rule[key][i].slice(0, j) + `${alf[index]}` + obj_rule[key][i].slice(j + 1, obj_rule[key][i].length);
                            obj_rule[key][i] = string;
                            obj_rule[alf[index]] = save_term;
                            index += 1;
                        }
                        check_term = true;
                    }
                }
            }
        }
    }
    for(let key in obj_rule){
        if(typeof(obj_rule[key]) === "string" && obj_rule[key].length > 1){

        }
    }
}

function del_epsilon(obj_rule){
    let del_el = [];
    let el = [];
    let flag = true;
    let flag_2 = true;
    let flag_3 = true;
    let flag_4 = true;
    let string;

    for(let key in obj_rule){
        if(obj_rule[key] === "") del_el.push(key);
        else if(typeof(obj_rule[key]) === "object"){
            flag = false
            flag_2 = true;
            for(let i = 0; i < obj_rule[key].length; i++){
                if(obj_rule[key][i] === "") flag = true;
                if(obj_rule[key][i] !== key && obj_rule[key][i] !== "") flag_2 = false;
            }
            if(flag && flag_2) del_el.push(key);
        }
    }
    flag = true;
    while(flag){
        flag_2 = false
        for(let key in obj_rule){
            if(typeof(obj_rule[key]) === "string" && obj_rule[key].length === 1){
                for(let j = 0; j < del_el.length; j++){
                    if(obj_rule[key] === del_el[j] && key !== "S0"){
                        for(let k = 0; k < del_el.length; k++){
                            if(key === del_el[k]) string = false;
                        }
                        if(string === undefined){
                            flag_2 = true;
                            del_el.push(key);
                        }
                        string = undefined
                    }
                    else if(obj_rule[key] === del_el[j] && key === "S0") obj_rule[key] = ["S", ""]
                }
            }
            else if(typeof(obj_rule[key]) === "string" && obj_rule[key].length > 1){
                flag_3 = false;
                flag_4 = true;
                for(let i = 0; i < obj_rule[key].length; i++){
                    for(let j = 0; j < del_el.length; j++){
                        if(obj_rule[key][i] === del_el[j]) flag_3 = true;
                    }
                    if(!flag_3) flag_4 = false;
                    flag_3 = false
                }
                if(flag_4){
                    for(let k = 0; k < del_el.length; k++){
                        if(key === del_el[k]) string = false;
                    }
                    if(string === undefined){
                        flag_2 = true;
                        del_el.push(key);
                    }
                    string = undefined
                }
            }
            else if(typeof(obj_rule[key]) === "object"){
                for(let i = 0; i < obj_rule[key].length; i++){
                    flag_3 = false
                    flag_4 = true
                    for(let j = 0; j < del_el.length; j++){
                        if(obj_rule[key][i] === del_el[j] && key !== "S0") flag_3 = true;

                        if(obj_rule[key][i] !== key && obj_rule[key][i] !== "" && obj_rule[key][i] !== del_el[j]){
                            flag_4 = false;
                            for(let k = 0; k < del_el.length; k++){
                                if(obj_rule[key][i] === del_el[k]) flag_4 = true;
                            }
                            if(flag_4 === false) j = del_el.length;
                        }
                    }
                    if(flag_3 && flag_4){
                        for(let k = 0; k < del_el.length; k++){
                            if(key === del_el[k]) string = false;
                        }
                        if(string === undefined){
                            flag_2 = true;
                            del_el.push(key);
                        }
                        string = undefined
                    }
                    else if(!flag_4) i = obj_rule[key].length
                }
            }
        }
        if(!flag_2) flag = false;
    }


    for(let i = 0; i < del_el.length; i++){
        delete obj_rule[del_el[i]];
    }

    for(let key in obj_rule){
        if(typeof(obj_rule[key]) === "string" && obj_rule[key].length > 1){
            for(let i = 0; i < obj_rule[key].length; i++){
                for(let j = 0; j < del_el.length; j++){
                    if(obj_rule[key][i] === del_el[j]){
                        string = obj_rule[key].slice(0, i) + obj_rule[key].slice(i + 1, obj_rule[key].length);
                        obj_rule[key] = string;
                        i -= 1;
                    }
                }
            }
        }
        else if(typeof(obj_rule[key]) === "object" && key !== "S0"){
            for(let i = 0; i < obj_rule[key].length; i++){
                for(let j = 0; j < obj_rule[key][i].length; j++){
                    for(let k = 0; k < del_el.length; k++){
                        if(obj_rule[key][i][j] === del_el[k]){
                            string = obj_rule[key][i].slice(0, j) + obj_rule[key][i].slice(j + 1, obj_rule[key][i].length);
                            obj_rule[key][i] = string;
                            j -= 1;
                        }
                    }
                }
            }
        }
    }

    del_el.length = 0;

    for(let key in obj_rule){
        if(typeof(obj_rule[key]) === "object" && key !== "S0"){
            for(let i = 0; i < obj_rule[key].length; i++){
                if(obj_rule[key][i] === ""){
                    del_el.push(key)
                    //string = obj_rule[key].slice(0, i) + obj_rule[key].slice(i + 1, obj_rule[key].length)
                    obj_rule[key].splice(i, i)
                    //obj_rule[key] = string
                }
            }
        }
    }

    flag = true;
    while(flag){
        flag_2 = false
        let check = 0;
        string = undefined
        for(let key in obj_rule){
            if(typeof(obj_rule[key]) === "string"){
                for(let i = 0; i < obj_rule[key].length; i++){
                    for(let j = 0; j < del_el.length; j++){
                        if(obj_rule[key][i] === del_el[j]) check += 1;
                    }
                }
                if(check === obj_rule[key].length && key !== "S0"){
                    for(let k = 0; k < del_el.length; k++){
                        if(key === del_el[k]) string = false;
                    }
                    if(string === undefined){
                        flag_2 = true;
                        del_el.push(key);
                        if(key === "S") obj_rule["S0"] = ["S", ""];
                    }
                    string = undefined
                }
                check = 0;
            }
            else if(typeof(obj_rule[key]) === "object"){
                for(let i = 0; i < obj_rule[key].length; i++){
                    for(let j = 0; j < obj_rule[key][i].length; j++){
                        for(let k = 0; k < del_el.length; k++){
                            if(obj_rule[key][i][j] === del_el[k]) check += 1;
                        }
                    }
                    if(check === obj_rule[key][i].length && key !== "S0"){
                        for(let z = 0; z < del_el.length; z++){
                            if(key === del_el[z]) string = false;
                        }
                        if(string === undefined){
                            flag_2 = true;
                            del_el.push(key);
                        }
                        string = undefined
                    }
                    check = 0;
                }
            }
        }
        if(!flag_2) flag = false;
    }

    for(let key in obj_rule){
        if(typeof(obj_rule[key]) === "string" && obj_rule[key].length > 1){
            for(let i = 0; i < obj_rule[key].length; i++){
                for(let j = 0; j < del_el.length; j++){
                    if(obj_rule[key][i] === del_el[j] && typeof(obj_rule[key]) === "string"){
                        string = obj_rule[key].slice(0, i) + obj_rule[key].slice(i + 1, obj_rule[key].length);
                        if(typeof(obj_rule[key]) === "string") obj_rule[key] = [obj_rule[key]];
                        //obj_rule[key].push(string);
                        //j -= 1;
                    }
                }
            }

            if(typeof(obj_rule[key]) === "object" && key !== "S0"){
                for(let i = 0; i < obj_rule[key].length; i++){
                    if(obj_rule[key][i].length > 1){
                        for(let j = 0; j < obj_rule[key][i].length; j++){
                            for(let k = 0; k < del_el.length; k++){
                                if(obj_rule[key][i][j] === del_el[k]){
                                    string = obj_rule[key][i].slice(0, j) + obj_rule[key][i].slice(j + 1, obj_rule[key][i].length);
                                    obj_rule[key].push(string);
                                }
                            }
                        }
                    }
                }
            }
        }
        else if(typeof(obj_rule[key]) === "object" && key !== "S0"){
            for(let i = 0; i < obj_rule[key].length; i++){
                if(obj_rule[key][i].length > 1){
                    for(let j = 0; j < obj_rule[key][i].length; j++){
                        for(let k = 0; k < del_el.length; k++){
                            if(obj_rule[key][i][j] === del_el[k]){
                                string = obj_rule[key][i].slice(0, j) + obj_rule[key][i].slice(j + 1, obj_rule[key][i].length);
                                obj_rule[key].push(string);
                            }
                        }
                    }
                }
            }
        }
    }
}

//CHF({"S":["AB", "AX", "BX"], "X":"ZY", "Y":"BB", "Z":["AB", "AX"], "A":"a","B":"b"});
//CHF({"S":"AB", "A":["SA", "BB", "bB"], "B":["b", "aA", ""]});

function engine(options){
    let str = [selectRule("S", options.rules.cluster)]
    function includes(str, determinate){
        let found;
        for (let i = 0; i < determinate.length; i++) {
            let indexOf = str.indexOf(determinate[i]);
            if(indexOf !== -1){
                found = determinate[i];
                break;
            }
        }
        return found;
    }

    function selectRule(sign, cluster){
        cluster[sign].current = (cluster[sign].current + 1) % cluster[sign].rules.length;
        return cluster[sign].rules[cluster[sign].current].res;
    }

    function chooseRule(arr){
        for (let i = 0; i < arr.length; i++) {
            if(!arr[i].done){
                arr[i].done = true;
                return arr.length - 1 === i ? {
                    args: arr[i].args,
                    pop: true
                } : {
                    args: arr[i].args,
                    pop: false
                }
            }
        }
    }

    let currentDepth = new Counter();
    let res = [];
    let totalOperationsCount = new Counter();

    let OPERATIONS_LIMIT = 30000000;
    let TREE_DEPTH_LIMIT = 10000;
    let STACK_LIMIT = 10000;
    let RESULT_LIMIT = 2000;
    let TIME_LIMIT = 1500;
    let isDeathTime = false;

    let stack = [];
    stack.push([{
        done: false,
        args: {
            str: str[0],
            currentDepth,
        }
    }])

    function makeWords({stack, OPERATIONS_LIMIT, STACK_LIMIT, TREE_DEPTH_LIMIT, currentDepth, totalOperationsCount}){
        let timeStart = Date.now();
        while (stack.length !== 0 && (totalOperationsCount.getCurrent() < OPERATIONS_LIMIT) &&
            (!isDeathTime) && (stack.length < STACK_LIMIT) && (res.length < RESULT_LIMIT)
            ){
            if(Date.now() - timeStart >= TIME_LIMIT) {
                isDeathTime = true;
                console.log("deathTime")
            }
            let args = chooseRule(stack[stack.length-1]);
            let pop = args.pop ? stack.pop() : undefined;
            let data = step2(args.pop ? {
                ...pop[pop.length - 1].args, result: res, limit: TREE_DEPTH_LIMIT, includes, stack,
                totalOperationsCount, rules: options.rules, determinate: options.determinate
            } : {
                ...args.args, result: res, limit: TREE_DEPTH_LIMIT, includes, stack, totalOperationsCount,
                rules: options.rules, determinate: options.determinate
            })
            if(data){
                res.push(data);
            } else if(data === false){
                currentDepth.counter = 0;
            }
        }
    }

    makeWords({
        stack, OPERATIONS_LIMIT, STACK_LIMIT, TREE_DEPTH_LIMIT, currentDepth, totalOperationsCount
    });


    if(stack.length !== 0 && res.length < RESULT_LIMIT){
        isDeathTime = false;
        totalOperationsCount.counter = 0;
        STACK_LIMIT *= 10;
        makeWords({
            stack, STACK_LIMIT, OPERATIONS_LIMIT, currentDepth, totalOperationsCount, TREE_DEPTH_LIMIT: 30,
        });

        stack.forEach(arr => {
            arr.forEach(args => {
                if(!includes(args.args.str, options.determinate)){
                    res.push(args.args.str)
                }
            })
        })

    }


    function step2({str, determinate, rules, includes, limit, totalOperationsCount, currentDepth, stack}){
        let inclSign = includes(str, determinate);
        let toPush = [];

        if(currentDepth.getCurrent() < limit && !isDeathTime){
            if(inclSign){
                for(let i = 0; i < rules.cluster[inclSign].rules.length; i++){
                    //console.log(currentDepth.getCurrent(), totalDepth.getCurrent());
                    let newStr = str.replace(inclSign, rules.cluster[inclSign].rules[i].res);
                    totalOperationsCount.increaseCurrent();
                    currentDepth.increaseCurrent();
                    if(i !== 0){
                        toPush.push({
                            done: false,
                            args: {str: newStr, currentDepth: new Counter(currentDepth.getCurrent())}
                        });
                    } else {
                        toPush.push({
                            done: false,
                            args: {str: newStr, currentDepth}
                        });
                    }
                }
                stack.push(toPush);
            } else {
                return str;
            }
        } else {
            return false;
        }
    }

    console.log("stack.length", stack.length);
    //console.log("stack", stack.map(item => item.map(item2 => item2.args.str)));

    return res;
}

function rule_check(arr_rule, res_string, Intermediate_arr){
    for(let key in arr_rule){
        if(typeof(arr_rule[key]) === "string" && res_string === arr_rule[key]){
            Intermediate_arr.push(key);
        }
        else{
            for(let z = 0; z < arr_rule[key].length; z++){
                if(res_string === arr_rule[key][z]) Intermediate_arr.push(key);
            }
        }
    }
    return Intermediate_arr;
}

function CYK_algorithm(arr_rule, word){
    let CYK_arr_col = [];
    let CYK_arr_row = [];
    let Intermediate_arr = [];
    let save_i = 0;
    let save_j = 0;
    let res_string = 0;
    for(let i = 0; word.length > i; i++){ //строчки
        for(let j = 0; word.length  > j; j++){ //столбцы
            if(i === 0){
                for(let k = 0; word.length > k; k++){
                    for(let key in arr_rule){
                        if(arr_rule[key].length < 2 && word[k] === arr_rule[key]) Intermediate_arr.push(key);
                        else if(arr_rule[key].length > 1) {
                            for(let z = 0; z < arr_rule[key].length; z++){
                                if(word[k] === arr_rule[key][z]) Intermediate_arr.push(key);
                            }
                        }
                    }
                    CYK_arr_col[k] = Intermediate_arr.slice(0);
                    Intermediate_arr.length = 0;
                }
                CYK_arr_row[i] = CYK_arr_col.slice(0);
            }

            else{
                save_i = i;
                save_j = 1;
                while(save_i >= 1){
                    if(CYK_arr_row[i-save_i] !== undefined && CYK_arr_row[i-save_i][j] !== undefined && CYK_arr_row[i-save_i][j].length !== 0 && CYK_arr_row[i - (i-save_i + 1)] !== undefined && CYK_arr_row[i - (i-save_i + 1)][j + (i-save_i + 1)] !== undefined){
                        if(typeof(CYK_arr_row[i - (i-save_i + 1)][j + save_j]) === "string"){
                            if(typeof(CYK_arr_row[i-save_i][j]) === "string"){
                                res_string = CYK_arr_row[i-save_i][j] + CYK_arr_row[i - (i-save_i + 1)][j + save_j];

                                Intermediate_arr = rule_check(arr_rule, res_string, Intermediate_arr);
                                CYK_arr_col[j] = Intermediate_arr.slice(0);

                            }
                            else{
                                for(let k = 0; k < CYK_arr_row[i-save_i][j].length; k++){
                                    res_string = CYK_arr_row[i-save_i][j][k] + CYK_arr_row[i - (i-save_i + 1)][j + save_j];

                                    Intermediate_arr = rule_check(arr_rule, res_string, Intermediate_arr);
                                    CYK_arr_col[j] = Intermediate_arr.slice(0);

                                }
                            }

                            save_i -= 1
                            save_j +=1
                        }
                        else{
                            for(let k = 0; k < CYK_arr_row[i - (i-save_i + 1)][j + save_j].length; k++){
                                if(typeof(CYK_arr_row[i-save_i][j]) === "string"){
                                    res_string = CYK_arr_row[i-save_i][j] + CYK_arr_row[i - (i-save_i + 1)][j + save_j][k]

                                    // console.log(i)
                                    // console.log(CYK_arr_row[i-save_i][j])
                                    // console.log(CYK_arr_row[i - (i-save_i + 1)][j + save_j])
                                    // console.log("***********************************************")
                                    Intermediate_arr = rule_check(arr_rule, res_string, Intermediate_arr);
                                    CYK_arr_col[j] = Intermediate_arr.slice(0);

                                }
                                else{
                                    for(let z = 0; z < CYK_arr_row[i-save_i][j].length; z++){
                                        res_string = CYK_arr_row[i-save_i][j][z] + CYK_arr_row[i - (i-save_i + 1)][j + save_j][k]

                                        Intermediate_arr = rule_check(arr_rule, res_string, Intermediate_arr);
                                        CYK_arr_col[j] = Intermediate_arr.slice(0);

                                    }
                                }
                            }
                            save_i -= 1
                            save_j +=1
                        }
                    }
                    else {
                        save_i -= 1;
                        save_j +=1
                    }
                }
                Intermediate_arr.length = 0;
                CYK_arr_row[i] = CYK_arr_col.slice(0);
            }
        }
        length = CYK_arr_col.length - 1;
        if(length >= 0) CYK_arr_col.length = length;
    }
    //console.log(CYK_arr_row)
    if(typeof(CYK_arr_row[CYK_arr_row.length - 1][0]) === "string"){
        if(CYK_arr_row[CYK_arr_row.length - 1][0] === "S0"){
            //console.log("Данное слово задано верно")
            return 1;
        }
        //else console.log("Такое слово не может быть задано в данной грамматике")
        return 0;
    }
    for(let i = 0; CYK_arr_row[CYK_arr_row.length - 1][0].length > i; i++){
        if(CYK_arr_row[CYK_arr_row.length - 1][0][i] ==="S0"){
            //console.log("Данное слово задано верно");
            return 1;
        }
    }
    //console.log("Такое слово не может быть задано в данной грамматике");
    return 0;
}


//CYK_algorithm({"S":["AB", "AX", "BX"], "X":"ZY", "Y":"BB", "Z":["AB", "AX"], "A":"a","B":"b"}, "aabbb")
// CYK_algorithm({"S":["AB", "BC"], "A":["BA", "a"], "B":["CC", "b"], "C":["AB", "a"]}, "baaba")
//CYK_algorithm({"S":"AB", "A":["BB", "a"], "B":["AB", "b"]}, "abba")
// CYK_algorithm({"S":["AB", "BB"], "A":["CC", "AB", "a"], "B":["BB", "CA", "b"], "C":["BA", "AA", "b"]}, "aabb")
const options = new Options();
options.setDeterminate();
options.grammarCluster();

const engineRes = engine(options)
console.log("engineRes len", engineRes.length);
console.log("engineRes", engineRes);
let transformedRules = options.transformer()
//let normalizedRules =  CHF(options.transformer());
//
console.log("transformer", transformedRules);
//console.log("normalize transformer", normalizedRules);
// let mainRes = engineRes.filter((item, index) => index % 1 === 0).map(item => CYK_algorithm(normalizedRules, item));
// console.log(mainRes);
// console.log(mainRes.length);
