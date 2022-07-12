//Принимает в себя правила в виде единого объекта и проверяет правила на корректность ввода. Объект не мутируется
export function correct_grammar_check(obj_rule){

    let flag = true;
    let non_terminal_check_arr = [];
    let check_arr = [];
    let non_terminal_all_arr = [];
    let index = 0;

    for(let key in obj_rule){
        non_terminal_all_arr[index] = key;
        index += 1;
    }

    //Пробегаем по всем правилам
    for(let key in obj_rule){
        //Есди тип строка, то пробегаем по всем ее символам и проверяем - есть ли хоть один символ, который не равен ключу
        if(typeof(obj_rule[key]) === "string"){
            flag = true;
            for(let i = 0; i < obj_rule[key].length; i++){
                if(obj_rule[key][i] === key) flag = false;
            }
            if(!flag) return false;
            
        }
        else{
            flag = false;
            for(let i = 0; i < obj_rule[key].length; i++){
                let counter = 0;
                for(let j = 0; j < obj_rule[key][i].length; j++){
                    if(obj_rule[key][i][j] !== key){
                        counter += 1;
                    } 
                }
                if(counter === obj_rule[key][i].length){
                    flag = true;
                }
            }
            if(!flag) {
                return false;
            }
        }
    } 

    for(let key in obj_rule){ //Собираем все элементы, где есть переход в нетерминал
        flag = false;
        if(typeof(obj_rule[key]) === "string"){
            for(let i = 0; i < obj_rule[key].length; i++){
                if(non_terminal_all_arr.includes(obj_rule[key][i])) flag = true;
            }
            if(flag) non_terminal_check_arr.push(key);
            flag = false;
        }
        else{
            for(let i = 0; i < obj_rule[key].length; i++){
                for(let j = 0; j < obj_rule[key][i].length; j++){
                    if(non_terminal_all_arr.includes(obj_rule[key][i][j])) flag = true;
                }
            }
            if(flag) non_terminal_check_arr.push(key);
            flag = false;
        }
    }

    for(let w = 0; w < non_terminal_check_arr.length; w++){
        flag = true;
        while(flag){
            let flag_2 = true
            let save = check_arr.length;
            for(let i = 0; i < non_terminal_check_arr.length; i++){
                if(typeof(obj_rule[non_terminal_check_arr[i]]) === "string"){
                    for(let j = 0; j < obj_rule[non_terminal_check_arr[i]].length; j++){
                        if(obj_rule[non_terminal_check_arr[i]][j] !== non_terminal_check_arr[w] &&
                            !check_arr.includes(obj_rule[non_terminal_check_arr[i]][j])) {
                            flag_2 = false;
                        }
                    }
                    if(flag_2 && !check_arr.includes(non_terminal_check_arr[i])){
                        check_arr.push(non_terminal_check_arr[i]);
                    } 
                    flag_2 = true
                }
                else{
                    for(let j = 0; j < obj_rule[non_terminal_check_arr[i]].length; j++){
                        for(let z = 0; z < obj_rule[non_terminal_check_arr[i]][j].length; z++){
                            if(obj_rule[non_terminal_check_arr[i]][j][z] !== non_terminal_check_arr[w] && !check_arr.includes(obj_rule[non_terminal_check_arr[i]][j][z])) flag_2 = false;
                        }
                    }
                    if(flag_2 && !check_arr.includes(non_terminal_check_arr[i])){
                        check_arr.push(non_terminal_check_arr[i]);
                    } 
                    flag_2 = true;
                }
            }
            if(save === check_arr.length || check_arr.length > 20) flag = false;
        }
        if(typeof(obj_rule[non_terminal_check_arr[w]]) === "string"){
            for(let i = 0; i < obj_rule[non_terminal_check_arr[w]].length; i++){
                if(check_arr.includes(obj_rule[non_terminal_check_arr[w]][i])) return false
            }
        }
        else{
            flag = false;
            let flag_2 = true;
            for(let i = 0; i < obj_rule[non_terminal_check_arr[w]].length; i++){
                for(let j = 0; j < obj_rule[non_terminal_check_arr[w]][i].length; j++){
                    if(check_arr.includes(obj_rule[non_terminal_check_arr[w]][i][j])) flag_2 = false;
                }
                if(flag_2) flag = true;
                flag_2 = true;
            }
            if(!flag){
                return false;
            } 
        }
        check_arr.length = 0;
    }

    return true;
}

export function algorithm_of_earley(obj_grammar, word){
    let Arr = [];
    let num = 0;
    let Arr_2;
    Arr[0] = [["Л -> ~S", 0]];

    for(let i = 0; i < (word.length + 1); i++){
        let save = null;
        num = scan(Arr, i, obj_grammar, word, num);
        while(Arr[i] !== undefined && save !== Arr[i].length){
            save = Arr[i].length;
            complete(Arr, i, obj_grammar, word);
            predict(Arr, i, obj_grammar, word);
        }
    }

    Arr_2 = Arr[word.length];

    if(Arr_2 !== undefined){
        for(let check = 0; check < Arr_2.length; check++){
            if(Arr_2[check][0] === "Л -> S~" && Arr_2[check][1] === 0){
                return true
            }
        }
    }
    return false
}

function scan(Arr, i, obj_grammar, word, num){
    let non_term = [];
    let str = null;
    for(let key in obj_grammar){
        non_term.push(key);
    }
    let Arr_2 = Arr[i - 1]

    if(i === 0){
        return num
    }
    if(Arr_2 !== undefined){
        for(let j = 0; j < Arr_2.length; j++){
            let save;
            let Arr_3 = Arr_2[j];
            for(let z = 0; z < Arr_3[0].length; z++){

                if(Arr_3[0][z] === "~"
                    && Arr_3[0][z + 1] !== undefined
                    && !non_term.includes(Arr_3[0][z + 1])
                    && Arr_3[0][z + 1] === word[i - 1]
                ){
                    save = Arr_3[0][z + 1];
                    str = Arr_3[0].slice(0, z) + save + "~" + Arr_3[0].slice(z+2, Arr_3[0].length);
                    if(Arr[i] === undefined){
                        Arr[i] = [[str, Arr_3[1]]]
                    }
                    else{
                        Arr[i].push([str, Arr_3[1]]);
                    }
                }
            }
        }
    }
    return num;
}

function complete(Arr, i){
    let Arr_2 = Arr[i];
    let Arr_3;
    let str;
    let save;

    if(Arr_2 !== undefined){
        for(let j = 0; j < Arr_2.length; j++){
            if(Arr_2[j][0][Arr_2[j][0].length-1] === "~"){
                Arr_3 = Arr[Arr_2[j][1]];
                for(let z = 0; z < Arr_3.length; z++){
                    for(let w = 0; w < Arr_3[z][0].length; w++){
                        let check_repeat = true
                        if(Arr_3[z][0][w] === "~" && Arr_3[z][0][w+1] === Arr_2[j][0][0]){
                            save = Arr_3[z][0][w + 1];
                            str = Arr_3[z][0].slice(0, w) + save + "~" + Arr_3[z][0].slice(w + 2, Arr_3[z][0].length);
                            for(let check = 0; check < Arr[i].length; check++){
                                if(Arr[i][check][0] === str && Arr[i][check][1] === Arr_3[z][1]){
                                    check_repeat = false;
                                }
                            }
                            if(check_repeat) {
                                if(i === Arr_2[j][1]){
                                    Arr[i][z] = [str, Arr_3[z][1]]
                                }
                                else{
                                    Arr[i].push([str, Arr_3[z][1]]);
                                }
                            }

                        }
                    }
                }
            }
        }
    }
}

function del_eps(Arr, i, term, num){
    let Arr_2 = Arr[i];
    let str = null;
    let check_repeat = null;
    for(let j = 0; j < Arr_2.length; j++){
        for(let z = 0; z < Arr_2[j][0].length; z++){
            check_repeat = true
            if(Arr_2[j][0][z] === "~" && Arr_2[j][0][z + 1] === term){
                str = Arr_2[j][0].slice(0, z) + term + "~" + Arr_2[j][0].slice(z+2, Arr_2[j][0].length);
                for(let check = 0; check < Arr[i].length; check++){
                    if(Arr[i][check][0] === str && Arr[i][check][1] === num){
                        check_repeat = false;
                    }
                }
                if(check_repeat) {
                    Arr[i].push([str, num])
                }
                if(check_repeat) z = 0;
            }
        }
    }
}

function predict(Arr, i, obj_grammar){
    let Arr_2 = Arr[i];
    let non_term = [];
    let check_repeat = null;
    for(let key in obj_grammar){
        non_term.push(key);
    }
    if(Arr_2 !== undefined){
        for(let j = 0; j < Arr_2.length; j++){
            for(let z = 0; z < Arr_2[j][0].length; z++){
                check_repeat = true;
                if(Arr_2[j][0][z] !== undefined
                    && Arr_2[j][0][z] === "~"
                    && Arr_2[j][0][z+1] !== undefined
                    && non_term.includes(Arr_2[j][0][z+1])){
                    if(typeof(obj_grammar[Arr_2[j][0][z+1]]) === "string"){
                        if(obj_grammar[Arr_2[j][0][z+1]] === "") del_eps(Arr, i, Arr_2[j][0][z+1], Arr_2[j][1]);
                        for(let check = 0; check < Arr[i].length; check++){
                            if(Arr[i][check][0] === `${Arr_2[j][0][z+1]} -> ~${obj_grammar[Arr_2[j][0][z+1]]}`
                                && Arr[i][check][1] === i){
                                check_repeat = false;
                            }
                        }
                        if(check_repeat !== false) {
                            check_repeat = true;
                        }
                        if(check_repeat) {
                            Arr[i].push([`${Arr_2[j][0][z+1]} -> ~${obj_grammar[Arr_2[j][0][z+1]]}`, i])
                        }
                    }else{
                        for(let o = 0; o < obj_grammar[Arr_2[j][0][z+1]].length; o++){
                            if(obj_grammar[Arr_2[j][0][z+1]][o] === "") {
                                del_eps(Arr, i, Arr_2[j][0][z+1], Arr_2[j][1]);
                            }
                            check_repeat = true;
                            for(let check = 0; check < Arr[i].length; check++){
                                if(Arr[i][check][0] === `${Arr_2[j][0][z+1]} -> ~${obj_grammar[Arr_2[j][0][z+1]][o]}`
                                    && Arr[i][check][1] === i){
                                    check_repeat = false;
                                }
                            }
                            if(check_repeat !== false) {
                                check_repeat = true;
                            }
                            if(check_repeat) {
                                Arr[i].push([`${Arr_2[j][0][z+1]} -> ~${obj_grammar[Arr_2[j][0][z+1]][o]}`, i])
                            }
                        }
                    }
                }
            }
        }
    }
}

export function unambiguous_conversion(rule, max_counter = 2){ //Функция мутирует объект! Ждет объект с правилами в трансформированной форме
    let flag = true;
    let step = 0;
    let counter = 0;
    let Unambiguous_rule = {}; //Создаем объект с однозначными правилами
    let intermediate_rule = {} //Создаем объект с промежуточными правилами
    while(flag){
        if(step === 0){
            if(!Search_for_uniqueness(rule, Unambiguous_rule)) {
                flag = false;
            }
        }
        else {
            if(!Search_for_uniqueness(intermediate_rule, Unambiguous_rule)) flag = false;
        }

        substitution_unambiguous_rules(Unambiguous_rule, intermediate_rule, rule, counter)
        if(!flag){
            counter += 1;
            if(counter < max_counter) flag = true;
        }
        step += 1;
    }
    return Unambiguous_rule;
}

function substitution_unambiguous_rules(Unambiguous_rule, intermediate_rule, obj_rule, counter){
    let flag;
    let flag_2;
    let check;
    let string = undefined;
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
                            if(obj_rule[key][i] === key3) {
                                flag_2 = false;
                            }
                        }
                        if(flag_2) {
                            flag = true;
                        }
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
                    if(index === -1){
                        if(string === undefined) string = obj_rule[key][i];
                        else string = string + obj_rule[key][i];
                    } 
                    else{
                        if(typeof Unambiguous_rule[index] === "object"){
                            if(Unambiguous_rule[index][counter] !== undefined){
                                if(string === undefined) string = Unambiguous_rule[index][counter];
                                else string = string + Unambiguous_rule[index][counter];
                            } else if(string !== undefined) {
                                string = Unambiguous_rule[index][0];
                            }
                        }
                        else{
                            if(string === undefined) string = Unambiguous_rule[index];
                            else string = string + Unambiguous_rule[index];
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
                string = undefined;
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
                        if(index === -1){
                            if(string === undefined) string = obj_rule[key][z][i];
                            else string = string + obj_rule[key][z][i];
                        } 
                        else{
                            if(typeof(Unambiguous_rule[index]) === "object"){
                                if(Unambiguous_rule[index][counter] !== undefined){
                                    if(string === undefined) string = Unambiguous_rule[index][counter];
                                    else string = string + Unambiguous_rule[index][counter];
                                } 
                                else if(string !== undefined) string = Unambiguous_rule[index][0];
                            }
                            else{
                                if(string === undefined) string = Unambiguous_rule[index];
                                else string = string + Unambiguous_rule[index];
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
                    string = undefined;
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
                    if(!(key in Unambiguous_rule))
                        Unambiguous_rule[key] = [];
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
                            if(obj_rule[key][i] === Unambiguous_rule[key2][j] && key === key2) flag = false;
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
