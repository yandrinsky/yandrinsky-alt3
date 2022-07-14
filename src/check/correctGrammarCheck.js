import {isString} from "../helpers/isString";

//Принимает в себя правила в виде единого объекта и проверяет правила на корректность ввода. Объект не мутируется
export function correctGrammarCheck(rules){

    let correctTransition = true;
    let checkingForMatching = true;
    let nonTerminalForCheck = [];
    let allNonTerminal = [];
    let fillingNonTerminalArrayCounter = 0;

    for(let key in rules){
        allNonTerminal[fillingNonTerminalArrayCounter] = key;
        fillingNonTerminalArrayCounter += 1;
    }

    //Пробегаем по всем правилам
    for(let key in rules){
        //Если тип строка, то пробегаем по всем ее символам и проверяем - есть ли хоть один символ, который не равен
        //ключу. Т.е. проверяем - не переходит ли правило само в себя
        if(isString(rules[key])){
            correctTransition = true;
            for(let i = 0; i < rules[key].length; i++){
                if(rules[key][i] === key) correctTransition = false;
            }
            if(!correctTransition) return false;

        }
            //Если тип массив, то проверяем каждый его элемент аналогично проверке выше. Если все элементы прошли проверку,
        //то идем дальше
        else{
            correctTransition = false;
            for(let i = 0; i < rules[key].length; i++){
                let correctTransitionsCounter = 0;
                for(let j = 0; j < rules[key][i].length; j++){
                    if(rules[key][i][j] !== key){
                        correctTransitionsCounter += 1;
                    }
                }
                if(correctTransitionsCounter === rules[key][i].length){
                    correctTransition = true;
                }
            }
            if(!correctTransition) {
                return false;
            }
        }
    }

    //Собираем все элементы, где есть переход в нетерминал, для проверки
    for(let key in rules){
        checkingForMatching = false;
        //Если тип строка(т.е. нетерминал переходит только в одно правило), то пробегаемся по всем символам строки, в
        //которую нетерминал переходит. Если в этой строке есть хоть один нетерминал, то добавляем нетерминал, из которого
        //был произведен этот переход, в массив нетерминалов для проверки
        if(isString(rules[key])){
            for(let i = 0; i < rules[key].length; i++){
                if(allNonTerminal.includes(rules[key][i])) checkingForMatching = true;
            }
            if(checkingForMatching) nonTerminalForCheck.push(key);
            checkingForMatching = false;
        }
            //Если тип массив (т.е. нетерминал переходит в несколько правил), то проводим аналогичную проверку, которая была
        //описана выше, для каждого перехода. Если хоть в одном было выявлено совпадение, то добавляем в массив для проверки
        else{
            for(let i = 0; i < rules[key].length; i++){
                for(let j = 0; j < rules[key][i].length; j++){
                    if(allNonTerminal.includes(rules[key][i][j])) checkingForMatching = true;
                }
            }
            if(checkingForMatching) nonTerminalForCheck.push(key);
            checkingForMatching = false;
        }
    }

    return checkArrayNonTerminalForCheck(nonTerminalForCheck, rules)

}

//В данной функции мы проверяем отобранные нетерминальные для проверки символы
export function checkArrayNonTerminalForCheck(nonTerminalForCheck, rules){

    let correctTransition;
    let ProhibitedCharacters = [];
    let continueWhile;
    let dangerOfWrongTransition;

    for(let w = 0; w < nonTerminalForCheck.length; w++){
        continueWhile = true;
        //В данном цикле идет сбор всех нетерминальных символов, в которые нетерминал, проходящий проверку,
        //не может переходить
        while(continueWhile){
            dangerOfWrongTransition = true
            let saveProhibitedCharactersLength = ProhibitedCharacters.length;
            //Начинаем перебор всех нетерминалов для проверки
            for(let i = 0; i < nonTerminalForCheck.length; i++){
                //Если тип строка
                if(isString(rules[nonTerminalForCheck[i]])){
                    //Пробегаемся по всем символам правила, в которое был совершен переход
                    for(let j = 0; j < rules[nonTerminalForCheck[i]].length; j++){
                        //Если j-ый символ правила не равен проверяемому нетерминалу и при этом он уже не находился в
                        //массиве запрещенных нетерминалов для перехода, то опасности неправильного перехода нет
                        if(rules[nonTerminalForCheck[i]][j] !== nonTerminalForCheck[w] &&
                            !ProhibitedCharacters.includes(rules[nonTerminalForCheck[i]][j])) {

                            dangerOfWrongTransition = false;

                        }
                    }
                    //Если опасность неправильного перехода сохранилась и данного нетерминала еще не было в списке
                    //запрещенных, то добавляем его в этот список
                    if(dangerOfWrongTransition && !ProhibitedCharacters.includes(nonTerminalForCheck[i])){
                        ProhibitedCharacters.push(nonTerminalForCheck[i]);
                    }
                    dangerOfWrongTransition = true
                }
                else{
                    //Аналогично поступаем, если тип массив, только теперь проверяем каждый переход
                    for(let j = 0; j < rules[nonTerminalForCheck[i]].length; j++){
                        for(let z = 0; z < rules[nonTerminalForCheck[i]][j].length; z++){
                            if(rules[nonTerminalForCheck[i]][j][z] !== nonTerminalForCheck[w] &&
                                !ProhibitedCharacters.includes(rules[nonTerminalForCheck[i]][j][z])) {

                                dangerOfWrongTransition = false;

                            }
                        }
                    }
                    if(dangerOfWrongTransition && !ProhibitedCharacters.includes(nonTerminalForCheck[i])){
                        ProhibitedCharacters.push(nonTerminalForCheck[i]);
                    }
                    dangerOfWrongTransition = true;
                }
            }
            //Если длинна массива запрещенных символов не изменилась, то останавливаем цикл. Если цикл стал бесконечным
            //по какой-то причине, хотя этого случится никогда не должно. То он остановится, когда длинна массива
            //станет больше 20
            if(saveProhibitedCharactersLength === ProhibitedCharacters.length || ProhibitedCharacters.length > 20){
                continueWhile = false;
            }
        }
        //Пробегаемся по всем переходам проверяемого нетерминала, если он переходит в хоть один запретный символ, то
        //вернем false
        if(isString(rules[nonTerminalForCheck[w]])){
            for(let i = 0; i < rules[nonTerminalForCheck[w]].length; i++){
                if(ProhibitedCharacters.includes(rules[nonTerminalForCheck[w]][i])){
                    return false
                }
            }
        }
        else{
            correctTransition = false;
            let flagForCheckAllProhibitedCharacters = true;
            for(let i = 0; i < rules[nonTerminalForCheck[w]].length; i++){
                for(let j = 0; j < rules[nonTerminalForCheck[w]][i].length; j++){
                    if(ProhibitedCharacters.includes(rules[nonTerminalForCheck[w]][i][j])){
                        flagForCheckAllProhibitedCharacters = false;
                    }
                }
                if(flagForCheckAllProhibitedCharacters){
                    correctTransition = true;
                }
                flagForCheckAllProhibitedCharacters = true;
            }
            if(!correctTransition){
                return false;
            }
        }
        ProhibitedCharacters.length = 0;
    }

    return true;
}