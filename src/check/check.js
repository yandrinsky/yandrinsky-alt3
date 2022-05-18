export function CHF(obj_rule){
    start_el(obj_rule);
    del_epsilon(obj_rule);
    some_term_sign(obj_rule)
    some_noterm_sign(obj_rule)
    go_myself_del(obj_rule)
    if(one_noterm(obj_rule));
    else return 0;
    console.log(obj_rule);
    return obj_rule;
}

export function start_el(obj_rule){
    obj_rule["S0"] = "S";
}

export function go_myself_del(obj_rule){
    for(let key in obj_rule){
        if(typeof(obj_rule[key]) === "object"){
            for(let i = 0; i < obj_rule[key].length; i++){
                if(obj_rule[key][i] === key) obj_rule[key].splice(i, i)
            }
        }
    }
}

export function one_noterm(obj_rule){
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
                    if(obj_rule[key] === no_term_arr[i] && key !== no_term_arr[i] && key !== "S0"){
                        flag = true;
                        obj_rule[key] = go_to_norm_rule(obj_rule, no_term_arr, obj_rule[key]);
                    }
                    else if(obj_rule[key] === no_term_arr[i] && key === no_term_arr[i]) return 0;
                }
            }
            else if(typeof(obj_rule[key]) === "object"){
                for(let j = 0; j < obj_rule[key].length; j++){
                    if(obj_rule[key][j].length === 1){
                        for(let i = 0; i < no_term_arr.length; i++){
                            if(obj_rule[key][j] === no_term_arr[i] && key !== no_term_arr[i] && key !== "S0"){

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
                            else if(obj_rule[key][j] === no_term_arr[i] && key === no_term_arr[i]) return 0
                        }
                    }
                }
            }
        }
    }
    return 1
}

export function go_to_norm_rule(obj_rule, no_term_arr, elem){
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

export function some_noterm_sign(obj_rule){
    let alf = ["б", "в", "г", "д", "е", "ё", "ж", "з", "и", "к", "л", "м", "н", "о", "п", "р", "с", "т"];
    let string;
    let save_string;
    let repeat_def;
    let counter = 0;
    let flag = true;

    while(flag){
        string = null;
        for(let key in obj_rule){
            if(obj_rule[key].length > 2 && typeof(obj_rule[key]) === "string"){
                save_string = obj_rule[key].slice(1, obj_rule[key].length)
                for(let key2 in obj_rule){
                    if(obj_rule[key2] === save_string) repeat_def = key2
                }
                if(repeat_def === undefined){
                    string = obj_rule[key][0] + alf[counter];
                    obj_rule[key] = string;
                    obj_rule[alf[counter]] = save_string;
                    counter += 1;
                }
                else{
                    string = obj_rule[key][0] + repeat_def;
                    obj_rule[key] = string;
                    repeat_def = undefined;
                }
            }
            else if(typeof(obj_rule[key]) === "object"){
                for(let i = 0; i < obj_rule[key].length; i++){
                    if(obj_rule[key][i].length > 2){
                        save_string = obj_rule[key][i].slice(1, obj_rule[key][i].length);
                        for(let key2 in obj_rule){
                            if(obj_rule[key2] === save_string) repeat_def = key2
                        }
                        if(repeat_def === undefined){
                            string = obj_rule[key][i][0] + alf[counter];
                            obj_rule[key][i] = string;
                            obj_rule[alf[counter]] = save_string;
                            counter += 1;
                        }
                        else{
                            string = obj_rule[key][i][0] + repeat_def;
                            obj_rule[key][i] = string;
                            repeat_def = undefined;
                        }
                    }
                }
            }
        }
        if(string === null) flag = false;
    }
}

export function some_term_sign(obj_rule){
    let arr_term = [];
    let alf = ["А", "Б", "В", "Г", "Д", "Е", "Ё", "Ж", "З", "И", "К", "Л", "М", "Н" , "О", "П", "Р", "С", "Т"];
    let save_term;
    let string;
    let index = 0;
    let repeat_def;
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
                    for(let key2 in obj_rule){
                        if(obj_rule[key2] === save_term) repeat_def = key2;
                    }
                    if(repeat_def === undefined){
                        string = obj_rule[key].slice(0, i) + `${alf[index]}` + obj_rule[key].slice(i + 1, obj_rule[key].length);
                        obj_rule[key] = string;
                        obj_rule[alf[index]] = save_term;
                        index += 1;
                    }
                    else{
                        string = obj_rule[key].slice(0, i) + `${repeat_def}` + obj_rule[key].slice(i + 1, obj_rule[key].length);
                        obj_rule[key] = string;
                        repeat_def = undefined
                    }
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
                            for(let key2 in obj_rule){
                                if(obj_rule[key2] === save_term) repeat_def = key2;
                            }
                            if(repeat_def === undefined){
                                string = obj_rule[key][i].slice(0, j) + `${alf[index]}` + obj_rule[key][i].slice(j + 1, obj_rule[key][i].length);
                                obj_rule[key][i] = string;
                                obj_rule[alf[index]] = save_term;
                                index += 1;
                            }
                            else{
                                string = obj_rule[key][i].slice(0, j) + `${repeat_def}` + obj_rule[key][i].slice(j + 1, obj_rule[key][i].length);
                                obj_rule[key][i] = string;
                                repeat_def = undefined
                            }
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

export function del_epsilon(obj_rule){
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
                    obj_rule[key].splice(i, i)
                    if(key === "S") obj_rule["S0"] = ["S", ""];
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
                            if(key === "S") obj_rule["S0"] = ["S", ""];
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

export function rule_check(arr_rule, res_string, Intermediate_arr){
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

export function CYK_algorithm(arr_rule, word){
    let CYK_arr_col = [];
    let CYK_arr_row = [];
    let Intermediate_arr = [];
    let save_i = 0;
    let save_j = 0;
    let res_string = 0;
    if(arr_rule === 0){
        console.log("Ошибка! грамматика не поддается проверке");
        return -1;
    }
    if(word.length === 0 && arr_rule["S0"].length === 2){
        //console.log("Данное слово задано верно");
        return 1;
    }
    else if(word.length === 0 && arr_rule["S0"].length === 1){
        //console.log("Такое слово не может быть задано в данной грамматике");
        return 0;
    }
    else if(word.length !== 0){
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
            if(CYK_arr_row[CYK_arr_row.length - 1][0] === "S0" || CYK_arr_row[CYK_arr_row.length - 1][0] === "S"){
                // console.log("Данное слово задано верно")
                return 1;
            }
            else return 0;//console.log("Такое слово не может быть задано в данной грамматике")
        }
        else{
            for(let i = 0; CYK_arr_row[CYK_arr_row.length - 1][0].length > i; i++){
                if(CYK_arr_row[CYK_arr_row.length - 1][0][i] ==="S0" || CYK_arr_row[CYK_arr_row.length - 1][0][i] ==="S"){
                    //console.log("Данное слово задано верно");
                    return 1;
                } 
            }
            //console.log("Такое слово не может быть задано в данной грамматике");
            return 0;
        } 
    }
}

export function Unambiguous_conversion(obj_rule){ //Функция мутирует объект! Ждет объект с правилами в трансформированной форме
    let flag = true;
    let step = 0;
    let Unambiguous_rule = {}; //Создаем объект с однозначными правилами
    let intermediate_rule = {} //Создаем объект с промежуточными правилами
    while(flag){
        if(step === 0){
            if(!Search_for_uniqueness(obj_rule, Unambiguous_rule)) flag = false;
        }
        else {
            if(!Search_for_uniqueness(intermediate_rule, Unambiguous_rule)) flag = false;
        }
        substitution_unambiguous_rules(Unambiguous_rule, intermediate_rule, obj_rule);
        step += 1;
    }
    //console.log(Unambiguous_rule);
    return Unambiguous_rule;
}

function substitution_unambiguous_rules(Unambiguous_rule, intermediate_rule, obj_rule){
    let flag;
    let flag_2;
    let check;
    let string = "";
    let index = 0;

    for(let key in obj_rule){
        if(typeof(obj_rule[key]) === "string"){
            check = true;
            for(let i = 0; i < obj_rule[key].length; i++){
                flag = false;
                for(let key2 in Unambiguous_rule){
                    if(obj_rule[key][i] !== key2){
                        flag_2 = true;
                        for(let key3 in obj_rule){
                            if(obj_rule[key][i] === key3) flag_2 = false;
                        }
                        if(flag_2) flag = true;
                    }
                    else flag = true;
                }
                if(!flag && Unambiguous_rule.length > 0) check = false
            }
            if(check){
                index = -1;
                for(let i = 0; i < obj_rule[key].length; i++){
                    for(let key2 in Unambiguous_rule){
                        if(obj_rule[key][i] === key2){
                            index = key2;
                        }
                    }
                    if(index === -1) string = string + obj_rule[key][i];
                    else{
                        if(typeof(Unambiguous_rule[index]) === "object"){
                            string = string + Unambiguous_rule[index][0];
                        }
                        else{
                            string = string + Unambiguous_rule[index];
                        }
                    }
                    index = -1;
                }
                check = true;
                for(let key3 in intermediate_rule){
                    //console.log(string, intermediate_rule[key3])
                    for(let i = 0; i < intermediate_rule[key3].length; i++){
                        if(string === intermediate_rule[key3][i] && key === key3) check = false;
                    }
                }
                if(check && string !== undefined){
                    if(!(key in intermediate_rule)) intermediate_rule[key] = [];
                    intermediate_rule[key].push(string);
                }
                string = "";
            }
        }
        else if(typeof(obj_rule[key]) === "object"){
            for(let z = 0; z < obj_rule[key].length; z++){
                check = true;
                for(let i = 0; i < obj_rule[key][z].length; i++){
                    flag = false;
                    for(let key2 in Unambiguous_rule){
                        if(obj_rule[key][z][i] !== key2){
                            flag_2 = true;
                            for(let key3 in obj_rule){
                                if(obj_rule[key][z][i] === key3) flag_2 = false;
                            }
                            if(flag_2) flag = true;
                        }
                        else flag = true;
                    }
                    if(!flag && Unambiguous_rule.length > 0) check = false
                }
                if(check){
                    index = -1;
                    for(let i = 0; i < obj_rule[key][z].length; i++){
                        for(let key2 in Unambiguous_rule){
                            for(let key2 in Unambiguous_rule){
                                if(obj_rule[key][z][i] === key2){
                                    index = key2;
                                }
                            }
                        }
                        if(index === -1) string = string + obj_rule[key][z][i];
                        else{
                            if(typeof(Unambiguous_rule[index]) === "object"){
                                string = string + Unambiguous_rule[index][0];
                            }
                            else{
                                string = string + Unambiguous_rule[index];
                            }
                        }
                        index = -1;
                    }
                    check = true;
                    for(let key3 in intermediate_rule){
                        //console.log(string, intermediate_rule[key3])
                        for(let i = 0; i < intermediate_rule[key3].length; i++){
                            if(string === intermediate_rule[key3][i]  && key === key3) check = false;
                        }
                    }
                    if(check && string !== undefined){
                        if(!(key in intermediate_rule)) intermediate_rule[key] = [];
                        intermediate_rule[key].push(string);
                    }
                    string = "";
                }
            }
        }
    }
}

function Search_for_uniqueness(obj_rule, Unambiguous_rule){ //функция поиска однозначных правил
    let flag;
    let new_elem_check = 0;
    for(let key in obj_rule){ //Пробегаемся по всем правилам
        if(typeof(obj_rule[key]) === "string"){ //Если правило - строка
            flag = true;
            for(let i = 0; i < obj_rule[key].length; i++){ //Проверяем каждый элемент строки на тернарность
                for(let key2 in obj_rule){
                    if(obj_rule[key][i] === key2){
                        flag = false;
                    }
                }
            }
            if(flag){ //Если все элементы строки тернары
                for(let key2 in Unambiguous_rule){
                    for(let i = 0; i < Unambiguous_rule[key2].length; i++){ //Проверяем было ли такое правило ранее
                        if(obj_rule[key] === Unambiguous_rule[key2][i] && key === key2) flag = false;
                    }
                }
                if(flag){
                    if(!(key in Unambiguous_rule)) Unambiguous_rule[key] = [];
                    Unambiguous_rule[key].push(obj_rule[key]); //Если не было, то добавляем новое правило
                    new_elem_check = 1;
                }
            }
        }
        else if(typeof(obj_rule[key]) === "object"){ //Если правило объект
            for(let i = 0; i < obj_rule[key].length; i++){
                flag = true;
                for(let j = 0; j < obj_rule[key][i].length; j++){
                    for(let key2 in obj_rule){
                        if(obj_rule[key][i][j] === key2){
                            flag = false;
                        }
                    }
                }
                if(flag){
                    for(let key2 in Unambiguous_rule){
                        for(let j = 0; j < Unambiguous_rule[key2].length; j++){
                            if(obj_rule[key][i] === Unambiguous_rule[key2][j]  && key === key2) flag = false;
                        }
                    }
                    if(flag){
                        if(!(key in Unambiguous_rule)) Unambiguous_rule[key] = [];
                        Unambiguous_rule[key].push(obj_rule[key][i]);
                        new_elem_check = 1;
                    }
                }
            }
        }
    }
    return new_elem_check;
}

//Unambiguous_conversion({"S": "aabBBACbbb", "A":"aaa"});
//Unambiguous_conversion({"S": "aaaA", "A":["bbb", "abcA"]});
//Unambiguous_conversion({"S": "A", "A":"aBc", "B":["deA", ""]});
//Unambiguous_conversion({"S": "aAB", "A":["+aA", "+a"], "B":"+c"});
// grammar: [
//     {sign: "S", res: "aA"},
//     {sign: "A", res: "+aA"}
// ],