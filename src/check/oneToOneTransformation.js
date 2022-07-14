import {isArray} from "../helpers/isArray";
import {isString} from "../helpers/isString";

//Функция мутирует объект! Ждет объект с правилами в трансформированной форме
export function oneToOneTransformation(rule, counterForMoreVariation = 2){

    let continueWhile = true;
    let step = 0;
    let counter = 0;
    //Создаем объект с однозначными правилами
    let unambiguousRule = {};
    //Создаем объект с промежуточными правилами
    let intermediateRule = {}

    while(continueWhile){

        if(step === 0){
            if(!SearchForUniqueness(rule, unambiguousRule)) {
                continueWhile = false;
            }
        }
        else {
            if(!SearchForUniqueness(intermediateRule, unambiguousRule)){
                continueWhile = false;
            }
        }

        substitutionUnambiguousRules(unambiguousRule, intermediateRule, rule, counter);

        if(!continueWhile){
            counter += 1;
            if(counter < counterForMoreVariation){
                continueWhile = true;
            }
        }

        step += 1;

    }

    return unambiguousRule;

}

function substitutionUnambiguousRules(unambiguousRule, intermediateRule, rule, counter){

    let searchTerminalCharacters;
    let searchTerminalCharactersHelper;
    let foundTerminalSymbol;
    let stringForPushInIntermediateRule = undefined;
    let indexOfChange = 0;

    for(let key in rule){
        if(isString(rule[key])){

            foundTerminalSymbol = true;

            for(let i = 0; i < rule[key].length; i++){

                searchTerminalCharacters = false;

                for(let key2 in unambiguousRule){

                    if(rule[key][i] !== key2){

                        searchTerminalCharactersHelper = true;

                        for(let key3 in rule){
                            if(rule[key][i] === key3) {
                                searchTerminalCharactersHelper = false;
                            }
                        }

                        if(searchTerminalCharactersHelper) {
                            searchTerminalCharacters = true;
                        }
                    }
                    else{
                        searchTerminalCharacters = true;
                    }
                }

                if(!searchTerminalCharacters && unambiguousRule.length > 0){
                    foundTerminalSymbol = false
                }
            }
            if(foundTerminalSymbol){
                indexOfChange = -1;
                for(let i = 0; i < rule[key].length; i++){
                    for(let key2 in unambiguousRule){
                        if(rule[key][i] === key2){
                            indexOfChange = key2;
                        }
                    }
                    if(indexOfChange === -1){

                        if(stringForPushInIntermediateRule === undefined){
                            stringForPushInIntermediateRule = rule[key][i];
                        }
                        else{
                            stringForPushInIntermediateRule = stringForPushInIntermediateRule + rule[key][i];
                        }

                    } 
                    else{
                        stringForPushInIntermediateRule = makeIntermediateString(unambiguousRule, indexOfChange, counter, stringForPushInIntermediateRule);
                    }
                    indexOfChange = -1;
                }
                stringForPushInIntermediateRule = pushInIntermediateRule(stringForPushInIntermediateRule, intermediateRule, key);
            }
        }
        else if(isArray(rule[key])){
            for(let z = 0; z < rule[key].length; z++){

                foundTerminalSymbol = true;
                for(let i = 0; i < rule[key][z].length; i++){

                    searchTerminalCharacters = false;

                    for(let key2 in unambiguousRule){

                        if(rule[key][z][i] !== key2){

                            searchTerminalCharactersHelper = true;

                            for(let key3 in rule){
                                if(rule[key][z][i] === key3){
                                    searchTerminalCharactersHelper = false;
                                }
                            }

                            if(searchTerminalCharactersHelper){
                                searchTerminalCharacters = true;
                            }

                        }
                        else{
                            searchTerminalCharacters = true;
                        }

                    }

                    if(!searchTerminalCharacters && unambiguousRule.length > 0){
                        foundTerminalSymbol = false
                    }

                }
                if(foundTerminalSymbol){
                    indexOfChange = -1;
                    for(let i = 0; i < rule[key][z].length; i++){
                        for(let key2 in unambiguousRule){
                            for(let key2 in unambiguousRule){
                                if(rule[key][z][i] === key2){
                                    indexOfChange = key2;
                                }
                            }
                        }
                        if(indexOfChange === -1){
                            if(stringForPushInIntermediateRule === undefined){
                                stringForPushInIntermediateRule = rule[key][z][i];
                            }
                            else{
                                stringForPushInIntermediateRule = stringForPushInIntermediateRule + rule[key][z][i];
                            }
                        } 
                        else{
                            stringForPushInIntermediateRule = makeIntermediateString(unambiguousRule, indexOfChange, counter, stringForPushInIntermediateRule);
                        }
                        indexOfChange = -1;
                    }

                    stringForPushInIntermediateRule = pushInIntermediateRule(stringForPushInIntermediateRule, intermediateRule, key);
                }
            }
        }
    }
}

function pushInIntermediateRule(stringForPushInIntermediateRule, intermediateRule, key){

    let check = true;

    for(let key3 in intermediateRule){
        for(let i = 0; i < intermediateRule[key3].length; i++){
            if(stringForPushInIntermediateRule === intermediateRule[key3][i] && key === key3){
                check = false;
            }
        }
    }
    if(check && stringForPushInIntermediateRule !== undefined){
        if(!(key in intermediateRule)){
            intermediateRule[key] = [];
        }
        intermediateRule[key].push(stringForPushInIntermediateRule);
    }
    return undefined;
}

function makeIntermediateString(unambiguousRule, indexOfChange, counter, stringForPushInIntermediateRule){

    if(isArray(unambiguousRule[indexOfChange])){
        if(unambiguousRule[indexOfChange][counter] !== undefined){
            if(stringForPushInIntermediateRule === undefined){
                stringForPushInIntermediateRule = unambiguousRule[indexOfChange][counter];
            }
            else stringForPushInIntermediateRule = stringForPushInIntermediateRule + unambiguousRule[indexOfChange][counter];
        } else if(stringForPushInIntermediateRule !== undefined) {
            stringForPushInIntermediateRule = unambiguousRule[indexOfChange][0];
        }
    }
    else{
        if(stringForPushInIntermediateRule === undefined){
            stringForPushInIntermediateRule = unambiguousRule[indexOfChange];
        }
        else{
            stringForPushInIntermediateRule = stringForPushInIntermediateRule + unambiguousRule[indexOfChange];
        }
    }

    return stringForPushInIntermediateRule;
}

//функция поиска однозначных правил
function SearchForUniqueness(rule, unambiguousRule){

    let allElementsIsTerminal;
    let wasNoSuchRule;
    let newElemCheck = 0;

    //Пробегаемся по всем правилам
    for(let key in rule){
        //Если правило - строка
        if(isString(rule[key])){
            allElementsIsTerminal = true;
            wasNoSuchRule = true;
            //Проверяем каждый элемент строки - является ли он терминалом
            for(let i = 0; i < rule[key].length; i++){
                for(let key2 in rule){
                    if(rule[key][i] === key2){
                        allElementsIsTerminal = false;
                    }
                }
            }
            //Если все элементы строки терминалы
            if(allElementsIsTerminal){
                for(let key2 in unambiguousRule){
                    //Проверяем было ли такое правило ранее
                    for(let i = 0; i < unambiguousRule[key2].length; i++){
                        if(rule[key] === unambiguousRule[key2][i] && key === key2){
                            wasNoSuchRule = false;
                        }
                    }
                }
                if(wasNoSuchRule){
                    if(!(key in unambiguousRule)){
                        unambiguousRule[key] = [];
                    }
                    //Если не было, то добавляем новое правило
                    unambiguousRule[key].push(rule[key]);
                    newElemCheck = 1;
                }
            }
        }
        //Если правило объект
        else if(isArray(rule[key])){
            for(let i = 0; i < rule[key].length; i++){
                allElementsIsTerminal = true;
                wasNoSuchRule = true;
                for(let j = 0; j < rule[key][i].length; j++){
                    for(let key2 in rule){
                        if(rule[key][i][j] === key2){
                            allElementsIsTerminal = false;
                        }
                    }
                }
                if(allElementsIsTerminal){
                    for(let key2 in unambiguousRule){
                        for(let j = 0; j < unambiguousRule[key2].length; j++){
                            if(rule[key][i] === unambiguousRule[key2][j] && key === key2){
                                wasNoSuchRule = false;
                            }
                        }
                    }
                    if(wasNoSuchRule){
                        if(!(key in unambiguousRule)){
                            unambiguousRule[key] = [];
                        }
                        unambiguousRule[key].push(rule[key][i]);
                        newElemCheck = 1;
                    }
                }
            }
        }
    }
    return newElemCheck;
}
