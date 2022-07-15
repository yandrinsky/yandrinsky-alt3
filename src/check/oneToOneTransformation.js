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
            if(!searchForUniqueness(rule, unambiguousRule)) {
                continueWhile = false;
            }
        }
        else {
            if(!searchForUniqueness(intermediateRule, unambiguousRule)){
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

    for(let ruleKey in rule){
        if(isString(rule[ruleKey])){
            foundTerminalSymbol = true;

            for(let i = 0; i < rule[ruleKey].length; i++){
                searchTerminalCharacters = false;

                for(let key2 in unambiguousRule){
                    if(rule[ruleKey][i] !== key2){
                        searchTerminalCharactersHelper = true;

                        for(let ruleKey2 in rule){
                            if(rule[ruleKey][i] === ruleKey2) {
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
                for(let i = 0; i < rule[ruleKey].length; i++){
                    for(let key2 in unambiguousRule){
                        if(rule[ruleKey][i] === key2){
                            indexOfChange = key2;
                        }
                    }
                    if(indexOfChange === -1){

                        if(stringForPushInIntermediateRule === undefined){
                            stringForPushInIntermediateRule = rule[ruleKey][i];
                        }
                        else{
                            stringForPushInIntermediateRule = stringForPushInIntermediateRule + rule[ruleKey][i];
                        }

                    } 
                    else{
                        stringForPushInIntermediateRule = makeIntermediateString(unambiguousRule, indexOfChange, counter, stringForPushInIntermediateRule);
                    }
                    indexOfChange = -1;
                }
                stringForPushInIntermediateRule = pushInIntermediateRule(stringForPushInIntermediateRule, intermediateRule, ruleKey);
            }
        }
        else if(isArray(rule[ruleKey])){
            for(let z = 0; z < rule[ruleKey].length; z++){
                foundTerminalSymbol = true;
                for(let i = 0; i < rule[ruleKey][z].length; i++){
                    searchTerminalCharacters = false;

                    for(let unambiguousRuleKey in unambiguousRule){
                        if(rule[ruleKey][z][i] !== unambiguousRuleKey){
                            searchTerminalCharactersHelper = true;

                            for(let key3 in rule){
                                if(rule[ruleKey][z][i] === key3){
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
                    for(let i = 0; i < rule[ruleKey][z].length; i++){
                        for(let key2 in unambiguousRule){
                            for(let key2 in unambiguousRule){
                                if(rule[ruleKey][z][i] === key2){
                                    indexOfChange = key2;
                                }
                            }
                        }
                        if(indexOfChange === -1){
                            if(stringForPushInIntermediateRule === undefined){
                                stringForPushInIntermediateRule = rule[ruleKey][z][i];
                            }
                            else{
                                stringForPushInIntermediateRule = stringForPushInIntermediateRule + rule[ruleKey][z][i];
                            }
                        } 
                        else{
                            stringForPushInIntermediateRule = makeIntermediateString(unambiguousRule, indexOfChange, counter, stringForPushInIntermediateRule);
                        }
                        indexOfChange = -1;
                    }

                    stringForPushInIntermediateRule = pushInIntermediateRule(stringForPushInIntermediateRule, intermediateRule, ruleKey);
                }
            }
        }
    }
}

function pushInIntermediateRule(stringForPushInIntermediateRule, intermediateRule, ruleKey){

    let check = true;

    for(let key3 in intermediateRule){
        for(let i = 0; i < intermediateRule[key3].length; i++){
            if(stringForPushInIntermediateRule === intermediateRule[key3][i] && ruleKey === key3){
                check = false;
            }
        }
    }
    if(check && stringForPushInIntermediateRule !== undefined){
        if(!(ruleKey in intermediateRule)){
            intermediateRule[ruleKey] = [];
        }
        intermediateRule[ruleKey].push(stringForPushInIntermediateRule);
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
function searchForUniqueness(rule, unambiguousRule){

    let allElementsIsTerminal;
    let wasNoSuchRule;
    let newElemCheck = 0;

    //Пробегаемся по всем правилам
    for(let ruleKey in rule){
        //Если правило - строка
        if(isString(rule[ruleKey])){
            allElementsIsTerminal = true;
            wasNoSuchRule = true;
            //Проверяем каждый элемент строки - является ли он терминалом
            for(let i = 0; i < rule[ruleKey].length; i++){
                for(let ruleKey2 in rule){
                    if(rule[ruleKey][i] === ruleKey2){
                        allElementsIsTerminal = false;
                    }
                }
            }
            //Если все элементы строки терминалы
            if(allElementsIsTerminal){
                for(let unambiguousRuleKey in unambiguousRule){
                    //Проверяем было ли такое правило ранее
                    for(let i = 0; i < unambiguousRule[unambiguousRuleKey].length; i++){
                        if(rule[ruleKey] === unambiguousRule[unambiguousRuleKey][i] && ruleKey === unambiguousRuleKey){
                            wasNoSuchRule = false;
                        }
                    }
                }
                if(wasNoSuchRule){
                    if(!(ruleKey in unambiguousRule)){
                        unambiguousRule[ruleKey] = [];
                    }
                    //Если не было, то добавляем новое правило
                    unambiguousRule[ruleKey].push(rule[ruleKey]);
                    newElemCheck = 1;
                }
            }
        }
        //Если правило объект
        else if(isArray(rule[ruleKey])){
            for(let i = 0; i < rule[ruleKey].length; i++){
                allElementsIsTerminal = true;
                wasNoSuchRule = true;
                for(let j = 0; j < rule[ruleKey][i].length; j++){
                    for(let ruleKey2 in rule){
                        if(rule[ruleKey][i][j] === ruleKey2){
                            allElementsIsTerminal = false;
                        }
                    }
                }
                if(allElementsIsTerminal){
                    for(let unambiguousRuleKey in unambiguousRule){
                        for(let j = 0; j < unambiguousRule[unambiguousRuleKey].length; j++){
                            if(rule[ruleKey][i] === unambiguousRule[unambiguousRuleKey][j] &&
                                ruleKey === unambiguousRuleKey)
                            {
                                wasNoSuchRule = false;
                            }
                        }
                    }
                    if(wasNoSuchRule){
                        if(!(ruleKey in unambiguousRule)){
                            unambiguousRule[ruleKey] = [];
                        }
                        unambiguousRule[ruleKey].push(rule[ruleKey][i]);
                        newElemCheck = 1;
                    }
                }
            }
        }
    }
    return newElemCheck;
}
