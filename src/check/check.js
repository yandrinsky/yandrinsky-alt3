export function correct_grammar_check(obj_rule){ //Принимает в себя правила в виде единого объекта и проверяет правила на корректность ввода. Объект не мутируется
    let flag = true;
    let non_terminal_check_arr = [];
    let check_arr = [];
    let non_terminal_all_arr = [];
    let index = 0;

    for(let key in obj_rule){
        non_terminal_all_arr[index] = key;
        index += 1;
    }

    for(let key in obj_rule){ //Пробегаем по всем правилам
        if(typeof(obj_rule[key]) === "string"){ //Есди тип строка, то пробегаем по всем ее символам и проверяем - есть ли хоть один символ, который не равен ключу
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
                if(counter === obj_rule[key][i].length) flag = true;
            }
            if(!flag) return false;
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
            // console.log("Входим: ", non_terminal_check_arr[w])
            for(let i = 0; i < non_terminal_check_arr.length; i++){
                if(typeof(obj_rule[non_terminal_check_arr[i]]) === "string"){
                    for(let j = 0; j < obj_rule[non_terminal_check_arr[i]].length; j++){
                        if(obj_rule[non_terminal_check_arr[i]][j] !== non_terminal_check_arr[w] && !check_arr.includes(obj_rule[non_terminal_check_arr[i]][j])) flag_2 = false;
                    }
                    if(flag_2 && !check_arr.includes(non_terminal_check_arr[i])){
                        // console.log("Я прошел проверку в блоке проверки СТРОКИ: ", non_terminal_check_arr[i])
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
                        // console.log("Я прошел проверку в блоке проверки Массива: ", non_terminal_check_arr[i])
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
                    // console.log("Буква", non_terminal_check_arr[w], obj_rule[non_terminal_check_arr[w]][i][j])
                    if(check_arr.includes(obj_rule[non_terminal_check_arr[w]][i][j])) flag_2 = false;
                }
                if(flag_2) flag = true;
                flag_2 = true;
            }
            if(!flag){
                // console.log("Я не прошел проверку", non_terminal_check_arr[w], check_arr)
                return false;
            } 
        }
        // console.log(check_arr)
        check_arr.length = 0;
    }

    // console.log("Вот что у нас получилось: ",non_terminal_check_arr, check_arr);

    return true;
}


export function CHF(obj_rule){ //Фунция получает набор правил в виде одного объекта и мутирует его
    if(Object.keys(obj_rule).length === 1 && obj_rule["S"] === "") return obj_rule;
    else{
        let counter = 0; //Счетчик новых символов
        start_el(obj_rule); //Добавляем новый первый элемент
        del_epsilon(obj_rule); //Удаляем пустоту из набора правил
        counter =  some_term_sign(obj_rule)
        some_noterm_sign(obj_rule, counter[0], counter[1], counter[2])
        go_myself_del(obj_rule);
        if(one_noterm(obj_rule));
        else{
            // if(typeof(obj_rule["S0"]) === "string") obj_rule["S0"] = obj_rule["S"].slice(0, obj_rule["S"].length)
            // else if(obj_rule["S"] !== undefined){
            //     obj_rule["S0"] = obj_rule["S"].slice(0, obj_rule["S"].length)
            //     obj_rule["S0"].push("")
            // }
            // else obj_rule["S0"] = "";
            return 0;
        } 
        if(typeof(obj_rule["S0"]) === "string") obj_rule["S0"] = obj_rule["S"].slice(0, obj_rule["S"].length)
        else if(obj_rule["S"] !== undefined){
            obj_rule["S0"] = obj_rule["S"].slice(0, obj_rule["S"].length)
            obj_rule["S0"].push("")
        }
        else obj_rule["S0"] = "";
        //console.log("!!!!",obj_rule)
        return obj_rule;
    }
    
}

export function start_el(obj_rule){
    obj_rule["S0"] = "S" //Получаем старый входной символ набора правил
}

export function go_myself_del(obj_rule){
    for(let key in obj_rule){
        if(typeof(obj_rule[key]) === "object"){
            for(let i = 0; i < obj_rule[key].length; i++){
                if(obj_rule[key][i] === key) obj_rule[key].splice(i, i)
            }
        }
    }
    for(let key in obj_rule){
        for(let key2 in obj_rule){
            if(typeof(obj_rule[key2]) === "object"){
                for(let i = 0; i < obj_rule[key2].length; i++){
                    if(obj_rule[key2][i] === key){
                        if(obj_rule[key] === key2) obj_rule[key2].splice(i, i);
                        else if(typeof(obj_rule[key]) === "object"){
                            for(let j = 0; j < obj_rule[key].length; j++){
                                if(obj_rule[key][i] === key2) obj_rule[key2].splice(i, i);
                            }
                        }
                    } 
                }
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
                        if(obj_rule[key] === undefined) return 0;
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
                                if(obj_rule[key][j] === undefined) return 0;
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
    if(obj_rule[elem].length > 1 || obj_rule[elem] === undefined) return obj_rule[elem];
    else{
        if(typeof(obj_rule[elem]) === "string"){
            for(let i = 0; i < no_term_arr.length; i++){
                if(obj_rule[elem] === no_term_arr[i] && elem !== no_term_arr[i]) save = go_to_norm_rule(obj_rule, no_term_arr, obj_rule[elem]);
                else return;
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

export function some_noterm_sign(obj_rule, counter, alf, alf_NT_old){
    let string;
    let save_string;
    let repeat_def;
    let counter_tild = 0;
    let flag = true;

    while(flag){
        string = null;
        for(let key in obj_rule){
            if(obj_rule[key].length > 2 && typeof(obj_rule[key]) === "string"){
                counter_tild = 0
                if(obj_rule[key][0] !== "~") save_string = obj_rule[key].slice(1, obj_rule[key].length)
                else{
                    counter_tild = 0
                    while(obj_rule[key][counter_tild + 1] !== "~"){
                        counter_tild += 1
                    }
                    save_string = obj_rule[key].slice(counter_tild + 2, obj_rule[key].length)
                    counter_tild += 1
                    if(obj_rule[key][counter_tild + 1] === undefined) flag = false
                    else if(obj_rule[key][counter_tild + 1] === "~"){
                        let go = counter_tild + 2
                        while(obj_rule[key][go] !== "~") go += 1;
                        if(obj_rule[key][go + 1] === undefined) flag = false
                    }
                }
                for(let key2 in obj_rule){
                    if(obj_rule[key2] === save_string && !(alf_NT_old.includes(key2))) repeat_def = key2
                }
                if(repeat_def === undefined && flag){
                    while(true){
                        if((alf.includes(`${counter}`, 0)) === false){
                            if(counter < 10) string = obj_rule[key].slice(0, counter_tild + 1) + `${counter}`;
                            else string = obj_rule[key].slice(0, counter_tild + 1) + `~${counter}~`;
                            obj_rule[key] = string;
                            if(counter < 10) obj_rule[`${counter}`] = save_string;
                            else obj_rule[`~${counter}~`] = save_string;
                            counter += 1;
                            break;
                        }else{
                            counter += 1 
                        } 
                    }
                }
                else if(flag){
                    string = obj_rule[key].slice(0, counter_tild + 1) + repeat_def;
                    obj_rule[key] = string;
                    repeat_def = undefined;
                }
            }
            else if(typeof(obj_rule[key]) === "object" && flag){
                for(let i = 0; i < obj_rule[key].length; i++){
                    if(obj_rule[key][i].length > 2){
                        counter_tild = 0
                        if(obj_rule[key][i][0] !== "~") save_string = obj_rule[key][i].slice(1, obj_rule[key][i].length)
                        else{
                            counter_tild = 0
                            while(obj_rule[key][i][counter_tild + 1] !== "~"){
                                counter_tild += 1
                            }
                            save_string = obj_rule[key][i].slice(counter_tild + 2, obj_rule[key][i].length)
                            flag = false
                            counter_tild += 1
                            if(obj_rule[key][i][counter_tild + 1] === undefined) flag = false
                            else if(obj_rule[key][i][counter_tild + 1] === "~"){
                                let go = counter_tild + 2
                                while(obj_rule[key][i][go] !== "~") go += 1;
                                if(obj_rule[key][i][go + 1] === undefined) flag = false
                            }
                        }
                        for(let key2 in obj_rule){
                            if(obj_rule[key2] === save_string && !(alf_NT_old.includes(key2))) repeat_def = key2
                        }
                        if(repeat_def === undefined){
                            while(true){
                                if((alf.includes(`${counter}`, 0)) === false){
                                    if(counter < 10) string = obj_rule[key][i].slice(0, counter_tild + 1) + `${counter}`;
                                    else string = obj_rule[key][i].slice(0, counter_tild + 1) + `~${counter}~`;
                                    obj_rule[key][i] = string;
                                    if(counter < 10) obj_rule[`${counter}`] = save_string;
                                    else obj_rule[`~${counter}~`] = save_string;
                                    counter += 1;
                                    break;
                                }else{
                                    counter += 1 
                                } 
                            }
                        }
                        else{
                            string = obj_rule[key][i].slice(0, counter_tild + 1) + repeat_def;
                            obj_rule[key][i] = string;
                            repeat_def = undefined;
                        }
                    }
                }
            }
        }
        if(string === null) flag = false;
    }
    return counter;
}

export function some_term_sign(obj_rule){
    let step_check = false;
    let alf = [];
    let alf_NT_old = [];
    let save_term;
    let string;
    let index = 0;
    let repeat_def;
    let check_term = true;

    for(let key in obj_rule){
        if(typeof(obj_rule[key]) === "string"){
            for(let i = 0; i < obj_rule[key].length; i++){
                if((obj_rule[key][i] in obj_rule) === false && (alf.includes(obj_rule[key][i], 0)) === false) alf.push(obj_rule[key][i])
                else if((obj_rule[key][i] in obj_rule) === true && (alf_NT_old.includes(obj_rule[key][i], 0)) === false) alf_NT_old.push(obj_rule[key][i])
            }
        }
        else if(typeof(obj_rule[key]) === "object"){
            for(let i = 0; i < obj_rule[key].length; i++){
                for(let j = 0; j < obj_rule[key][i].length; j++){
                    if((obj_rule[key][i][j] in obj_rule) === false && (alf.includes(obj_rule[key][i][j], 0)) === false) alf.push(obj_rule[key][i][j]);
                    else if((obj_rule[key][i][j] in obj_rule) === true && (alf_NT_old.includes(obj_rule[key][i][j], 0)) === false) alf_NT_old.push(obj_rule[key][i][j])
                }
            }
        }
    }

    for(let key in obj_rule){
        if(typeof(obj_rule[key]) === "string" && obj_rule[key].length > 1){
            for(let i = 0; i < obj_rule[key].length; i++){
                for(let key_2 in obj_rule){
                    if(obj_rule[key][i] === key_2 || obj_rule[key][i] === "~"){
                        check_term = false;
                        if(obj_rule[key][i] === "~"){
                            let counter_tild = i + 1;
                            while(obj_rule[key][counter_tild] !== "~"){
                                counter_tild += 1
                            }
                            i = counter_tild + 1;
                        }   
                        break
                    }
                }
                if(check_term === true){
                    save_term = obj_rule[key][i];
                    for(let key2 in obj_rule){
                        if(obj_rule[key2] === save_term && !(alf_NT_old.includes(key2))) repeat_def = key2;
                    }
                    if(repeat_def === undefined){
                        while(true){
                            if((alf.includes(`${index}`, 0)) === false){
                                if(index < 10){
                                    string = obj_rule[key].slice(0, i) + `${index}` + obj_rule[key].slice(i + 1, obj_rule[key].length);
                                }
                                else{
                                    string = obj_rule[key].slice(0, i) + `~${index}~` + obj_rule[key].slice(i + 1, obj_rule[key].length);
                                }
                                obj_rule[key] = string;
                                if(index < 10) obj_rule[`${index}`] = save_term;
                                else obj_rule[`~${index}~`] = save_term;
                                index += 1;
                                i = -1;
                                break;
                            }else{
                                index += 1 
                            } 
                        }
                    }
                    else{
                        string = obj_rule[key].slice(0, i) + `${repeat_def}` + obj_rule[key].slice(i + 1, obj_rule[key].length);
                        obj_rule[key] = string;
                        repeat_def = undefined
                        i = -1
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
                            //console.log(obj_rule[key][i][j], key_2)
                            if(obj_rule[key][i][j] === key_2 || obj_rule[key][i][j] === "~"){
                                check_term = false;
                                //console.log("Залез в проверку", j)
                                if(obj_rule[key][i][j] === "~"){
                                    let counter_tild = j + 1;
                                    //console.log("Нашел тильду до while", obj_rule[key][i], obj_rule[key][i][j])
                                    while(obj_rule[key][i][counter_tild] !== "~"){
                                        counter_tild += 1
                                    }
                                    j = counter_tild;
                                    //console.log("Нашел тильду после while", obj_rule[key][i], obj_rule[key][i][j])
                                }  
                                break
                            }
                        }
                        //console.log("Перед проверкой на тернарность", j, obj_rule[key][i][j])
                        
                        if(check_term === true){
                            //console.log("Прошел отбор на тернарность", obj_rule[key][i], obj_rule[key][i][j], j)
                            save_term = obj_rule[key][i][j];
                            for(let key2 in obj_rule){
                                if(obj_rule[key2] === save_term && !(alf_NT_old.includes(key2))) repeat_def = key2;
                            }
                            if(repeat_def === undefined){
                                while(true){
                                    if((alf.includes(`${index}`, 0)) === false){
                                        if(index < 10){
                                            string = obj_rule[key][i].slice(0, j) + `${index}` + obj_rule[key][i].slice(j + 1, obj_rule[key][i].length);
                                        }
                                        else{
                                            string = obj_rule[key][i].slice(0, j) + `~${index}~` + obj_rule[key][i].slice(j + 1, obj_rule[key][i].length);
                                        }
                                        obj_rule[key][i] = string;
                                        if(index < 10) obj_rule[`${index}`] = save_term;
                                        else obj_rule[`~${index}~`] = save_term;
                                        index += 1;
                                        j = -1
                                        break;
                                    }else{
                                        index += 1 
                                    } 
                                }
                            }
                            else{
                                string = obj_rule[key][i].slice(0, j) + `${repeat_def}` + obj_rule[key][i].slice(j + 1, obj_rule[key][i].length);
                                obj_rule[key][i] = string;
                                repeat_def = undefined
                                j = -1
                            }
                            //console.log("После замены", obj_rule[key][i], obj_rule[key][i][j])
                        }
                        check_term = true;
                    }
                }
            }
        }
    }
    return [index, alf, alf_NT_old];
}

export function del_epsilon(obj_rule){ //Функция удаляет пустоту из набора правил
    let del_el = [];
    let flag = true;
    let flag_2 = true;
    let flag_3 = true;
    let flag_4 = true;
    let string;

    for(let key in obj_rule){ //Пробегаемся по всем правилам
        if(obj_rule[key] === "") del_el.push(key); //Если правило является пустой строкой, то добавляем это правило в массив элементов для удаления
        else if(typeof(obj_rule[key]) === "object"){ //Если у нетернара несколько правил
            flag = false
            flag_2 = true;
            for(let i = 0; i < obj_rule[key].length; i++){ //Пробегаемся по всем правилам 
                if(obj_rule[key][i] === "") flag = true; //Проверяем условие, что нетернар переходит в пустоту
                if(obj_rule[key][i] !== key && obj_rule[key][i] !== "") flag_2 = false; //Проверяем условие, что нетернар не переходит в себя и не переходит в пустоту
            }
            if(flag && flag_2) del_el.push(key); //Если выполнилось первое условие, но не выполнилось второе условие, то добавляем этот нетернар в массив элементов для удаления
        }
    }
    flag = true;
    while(flag){ //Будем выполнять цикл, пока на каждой итерации находится хотя бы один элемент, который является пустым
        flag_2 = false
        for(let key in obj_rule){ //Пробегаемся по всем правилам
            if(typeof(obj_rule[key]) === "string" && obj_rule[key].length === 1){ //Если нетернар имеет только одно правило перехода и количество символов после перехода равна 1
                for(let j = 0; j < del_el.length; j++){ //Пробегаемся по массиву элементов для удаления
                    if(obj_rule[key] === del_el[j] && key !== "S0"){ //Если нетернар переходит в один из таких элементов и этот нетернар не является первым
                        for(let k = 0; k < del_el.length; k++){ //снова пробегаемся по массиву с эл-ми для удаления
                            if(key === del_el[k]) string = false; //Если такой элемент уже был в массиве, то пропускаем его
                        }
                        if(string === undefined){ //Если такого элемента не было, то добавляем его в массив и даем понять, что while должен быть выполнен еще раз
                            flag_2 = true;
                            del_el.push(key);
                        }
                        string = undefined
                    }
                    else if(obj_rule[key] === del_el[j] && key === "S0") obj_rule[key] = ["S", ""]
                }
            }
            else if(typeof(obj_rule[key]) === "string" && obj_rule[key].length > 1){ //Если нетернар имеет только одно правило перехода и количество символов после перехода более 1
                flag_3 = false;
                flag_4 = true;
                for(let i = 0; i < obj_rule[key].length; i++){ //Пробегаемся по всей строке перехода данного нетернара
                    for(let j = 0; j < del_el.length; j++){ //Пробегаемся по массиву с эл-ми для удаления
                        if(obj_rule[key][i] === del_el[j]) flag_3 = true;
                    }
                    if(!flag_3) flag_4 = false; //Проверяем каждый эл-т строки, если хотя бы один из них не является пустым, то мы его не добавляем
                    flag_3 = false
                }
                if(flag_4){ //Если все элементы строки, в которую переходит нетернар, в свою очередь переходят только в пустоту
                    for(let k = 0; k < del_el.length; k++){ //Проверяем был ли такой нетернар уже в массиве
                        if(key === del_el[k]) string = false;
                    }
                    if(string === undefined){//Если такого элемента не было, то добавляем его в массив и даем понять, что while должен быть выполнен еще раз
                        flag_2 = true;
                        del_el.push(key);
                    }
                    string = undefined
                }
            }
            else if(typeof(obj_rule[key]) === "object"){ //Если нетернар переходит в несколько правил
                for(let i = 0; i < obj_rule[key].length; i++){ //Пробегаемся по всем правилам
                    flag_3 = false
                    flag_4 = true
                    for(let j = 0; j < del_el.length; j++){

                        if(obj_rule[key][i].length === 1){ //Если одно из правил - переход в один символ
                            if(obj_rule[key][i] === del_el[j] && key !== "S0") flag_3 = true;

                            if(obj_rule[key][i] !== key && obj_rule[key][i] !== "" && obj_rule[key][i] !== del_el[j]){
                                flag_4 = false;
                                for(let k = 0; k < del_el.length; k++){
                                    if(obj_rule[key][i] === del_el[k]) flag_4 = true;
                                }
                                if(flag_4 === false) j = del_el.length;
                            }
                        }else{ //Если правило - переход в несколько символов ////////////////ОБНОВА//////////////////
                            for(let z = 0; z < obj_rule[key][i].length; z++){ //Пробегаемся по всем этим символам
                                if(obj_rule[key][i][z] === del_el[j] && key !== "S0") flag_3 = true;

                                if(obj_rule[key][i][z] !== key && obj_rule[key][i][z] !== del_el[j]){
                                    flag_4 = false;
                                    for(let k = 0; k < del_el.length; k++){
                                        if(obj_rule[key][i][z] === del_el[k]) flag_4 = true;
                                    }
                                    if(flag_4 === false){
                                        j = del_el.length;
                                        z = obj_rule[key][i].length;
                                    } 
                                }
                            }
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
        if(!flag_2) flag = false; //Если новых символов не появилось, то выходим из цикла while
    }
    
    if(del_el.includes("S")){obj_rule["S0"] = ["S", ""];} 

    for(let i = 0; i < del_el.length; i++){ //Удаляем все нетернары, которые оказались в массиве на удаление
        delete obj_rule[del_el[i]];
    }

    for(let key in obj_rule){
        if(typeof(obj_rule[key]) === "string" && obj_rule[key].length > 1){
            for(let i = 0; i < obj_rule[key].length; i++){
                for(let j = 0; j < del_el.length; j++){
                    if(obj_rule[key][i] === del_el[j]){ //Если в строке есть нетернар из массива на удаление
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
                        if(obj_rule[key][i][j] === del_el[k] && obj_rule[key][i].length > 1){
                            string = obj_rule[key][i].slice(0, j) + obj_rule[key][i].slice(j + 1, obj_rule[key][i].length);
                            obj_rule[key][i] = string;
                            j -= 1;
                        }
                        else if (obj_rule[key][i][j] === del_el[k] && obj_rule[key][i].length === 1){
                            // obj_rule[key].splice(i, i)
                            // j -= 1;
                            // i -=1
                            obj_rule[key][i] = "";
                        }
                    }
                }
            }
        }
    }

    del_el.length = 0; //После того как мы нашли и убрали все нетернары, которые переходили только в пустоту мы очищаем массив

    for(let key in obj_rule){
        if(typeof(obj_rule[key]) === "object" && key !== "S0"){
            for(let i = 0; i < obj_rule[key].length; i++){
                if(obj_rule[key][i] === ""){ //Если нетернар переходит в пустоту
                    if(!del_el.includes(key, 0)){
                        del_el.push(key) //Добавляем этот эл-т в массив, который содержи в себе те нетернары, которые могут быть как пустотой, так и не пустотой
                        if(key === "S") obj_rule["S0"] = ["S", ""];
                    }
                    if(i !== 0){
                        obj_rule[key].splice(i, i) //Удаляем пустоту из элемента
                        i -= 1;
                    }
                    else obj_rule[key] = obj_rule[key].slice(1, obj_rule[key].length)
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
                    if(obj_rule[key][i] === del_el[j]){
                        string = obj_rule[key].slice(0, i) + obj_rule[key].slice(i + 1, obj_rule[key].length);
                        if(typeof(obj_rule[key]) === "string") obj_rule[key] = [obj_rule[key]];
                        obj_rule[key].push(string);
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
    }
    if(del_el.includes("S")) obj_rule["S0"] = ["S", ""];
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

export function CYK_algorithm2(obj_rule, word){
    let arr = [];

    if(obj_rule === 0) return 0

    if(word === ""){
        if(obj_rule["S0"].length !== 1) return true;
        else return false
    }

    for(let i = 0; i < word.length; i++){
        for(let key in obj_rule){
            if(typeof(obj_rule[key]) === "string" && obj_rule[key] === word[i]){
                arr[[0, i, key]] = true;
            }
            else if(typeof(obj_rule[key]) === "object"){
                for(let j = 0; j < obj_rule[key].length; j++){
                    if(obj_rule[key][j] === word[i]){
                        arr[[0, i, key]] = true;
                    }
                }
            }
        }
    }

    for(let i = 1; i < word.length; i++){
        for(let j = 0; j < word.length - i; j++){
            for(let k = 0; k < i; k++){
                for(let key in obj_rule){
                    if(typeof(obj_rule[key]) === "string" && obj_rule[key].length > 1){
                        let counter = 1;
                        if(obj_rule[key][0] === "~"){
                            while(obj_rule[key][counter] !== "~"){
                                counter += 1;
                            }
                            if(arr[[k, j, obj_rule[key].slice(0, counter + 1)]] === true && arr[[i - k - 1, j + k + 1, obj_rule[key].slice(counter + 1, obj_rule[key].length)]] === true){
                                arr[[i, j, key]] = true
                            }
                        } else if(obj_rule[key][1] === "~"){
                            while(obj_rule[key][counter] !== "~"){
                                counter += 1;
                            }
                            if(arr[[k, j, obj_rule[key][0]]] === true && arr[[i - k - 1, j + k + 1, obj_rule[key].slice[1, obj_rule[key].length]]] === true){
                                arr[[i, j, key]] = true
                            }
                        }
                        else{
                            if(arr[[k, j, obj_rule[key][0]]] === true && arr[[i - k - 1, j + k + 1, obj_rule[key][1]]] === true){
                                arr[[i, j, key]] = true
                            }
                        }   
                    }
                    else if(typeof(obj_rule[key]) === "object"){
                        for(let z = 0; z < obj_rule[key].length; z++){
                            if(obj_rule[key][z].length > 1){
                                let counter = 1;
                                if(obj_rule[key][z][0] === "~"){
                                    while(obj_rule[key][z][counter] !== "~"){
                                        counter += 1;
                                    }
                                    if(arr[[k, j, obj_rule[key][z].slice(0, counter + 1)]] === true && arr[[i - k - 1, j + k + 1, obj_rule[key][z].slice(counter + 1, obj_rule[key][z].length)]] === true){
                                        arr[[i, j, key]] = true
                                    }
                                } else if(obj_rule[key][z][1] === "~"){
                                    while(obj_rule[key][z][counter] !== "~"){
                                        counter += 1;
                                    }
                                    if(arr[[k, j, obj_rule[key][z][0]]] === true && arr[[i - k - 1, j + k + 1, obj_rule[key][z].slice[1, obj_rule[key][z].length]]] === true){
                                        arr[[i, j, key]] = true
                                    }
                                }
                                else{
                                    if(arr[[k, j, obj_rule[key][z][0]]] === true && arr[[i - k - 1, j + k + 1, obj_rule[key][z][1]]] === true){
                                        arr[[i, j, key]] = true
                                    }
                                }   
                            }
                        }
                    }
                }
            }
        }
    }

    if(arr[[word.length - 1, 0, "S0"]]){
        //console.log("Такое слово можно построить");
        return true;
    }
    //console.log("Такое слово построить нельзя")
    return false;
}

export function Unambiguous_conversion(obj_rule, max_counter = 2){ //Функция мутирует объект! Ждет объект с правилами в трансформированной форме
    let flag = true;
    let step = 0;
    let counter = 0;
    let Unambiguous_rule = {}; //Создаем объект с однозначными правилами
    let intermediate_rule = {} //Создаем объект с промежуточными правилами
    while(flag){
        if(step === 0){
            if(!Search_for_uniqueness(obj_rule, Unambiguous_rule)) flag = false;
        }
        else {
            if(!Search_for_uniqueness(intermediate_rule, Unambiguous_rule)) flag = false;
        }

        substitution_unambiguous_rules(Unambiguous_rule, intermediate_rule, obj_rule, counter)
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
                    if(index === -1){
                        if(string === undefined) string = obj_rule[key][i];
                        else string = string + obj_rule[key][i];
                    } 
                    else{
                        if(typeof(Unambiguous_rule[index]) === "object"){
                            if(Unambiguous_rule[index][counter] !== undefined){
                                if(string === undefined) string = Unambiguous_rule[index][counter];
                                else string = string + Unambiguous_rule[index][counter];
                            } else if(string !== undefined) string = Unambiguous_rule[index][0];
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
