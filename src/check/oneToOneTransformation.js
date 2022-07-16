import {isArray} from "../helpers/isArray";
import {isString} from "../helpers/isString";

//Функция мутирует объект! Ждет объект с правилами в трансформированной форме
export function oneToOneTransformation(rule, counterForMoreVariation = 2){
    let continueWhile = true;
    let step = 0;
    let counter = 0;
    //Создаем объект с однозначными правилами
    let singleRule = {};
    //Создаем объект с промежуточными правилами
    let intermediateRule = {}

    while(continueWhile){
        if(step === 0){
            if(!searchForUniqueness(rule, singleRule)) {
                continueWhile = false;
            }
        } else {
            if(!searchForUniqueness(intermediateRule, singleRule)){
                continueWhile = false;
            }
        }

        ChangeOfSingleRule(singleRule, intermediateRule, rule, counter);

        if(!continueWhile){
            counter += 1;
            if(counter < counterForMoreVariation){
                continueWhile = true;
            }
        }

        step += 1;
    }

    return singleRule;
}

function ChangeOfSingleRule(singleRule, intermediateRule, rule, counter){
    let searchTerminalCharacters;
    let searchTerminalCharactersHelper;
    let foundTerminalSymbol;
    let stringForPushInIntermediateRule = undefined;
    let indexOfChange = 0;

    for(let ruleKey in rule){
        if(isString(rule[ruleKey])){
            foundTerminalSymbol = true;

            for (let i = 0; i < rule[ruleKey].length; i++) {
                searchTerminalCharacters = false;

                for (let singleRuleKey in singleRule) {
                    if(rule[ruleKey][i] !== singleRuleKey){
                        searchTerminalCharactersHelper = true;

                        for (let ruleKeyForHelpSearch in rule) {
                            if(rule[ruleKey][i] === ruleKeyForHelpSearch) {
                                searchTerminalCharactersHelper = false;
                            }
                        }

                        if(searchTerminalCharactersHelper) {
                            searchTerminalCharacters = true;
                        }
                    } else {
                        searchTerminalCharacters = true;
                    }
                }

                if(!searchTerminalCharacters && singleRule.length > 0){
                    foundTerminalSymbol = false
                }
            }

            if(foundTerminalSymbol){
                indexOfChange = -1;
                for(let i = 0; i < rule[ruleKey].length; i++){
                    for(let singleRuleKey in singleRule){
                        if(rule[ruleKey][i] === singleRuleKey){
                            indexOfChange = singleRuleKey;
                        }
                    }

                    if(indexOfChange === -1){
                        if(stringForPushInIntermediateRule === undefined){
                            stringForPushInIntermediateRule = rule[ruleKey][i];
                        } else {
                            stringForPushInIntermediateRule = stringForPushInIntermediateRule + rule[ruleKey][i];
                        }
                    } else {
                        stringForPushInIntermediateRule = makeIntermediateString(
                            singleRule,
                            indexOfChange,
                            counter,
                            stringForPushInIntermediateRule
                        );
                    }

                    indexOfChange = -1;
                }
                stringForPushInIntermediateRule = pushInIntermediateRule(stringForPushInIntermediateRule, intermediateRule, ruleKey);
            }
        } else if (isArray(rule[ruleKey])) {
            for(let z = 0; z < rule[ruleKey].length; z++){
                foundTerminalSymbol = true;
                for(let i = 0; i < rule[ruleKey][z].length; i++){
                    searchTerminalCharacters = false;

                    for(let singleRuleKey in singleRule){
                        if(rule[ruleKey][z][i] !== singleRuleKey){
                            searchTerminalCharactersHelper = true;

                            for(let ruleKeyForHelpSearch in rule){
                                if(rule[ruleKey][z][i] === ruleKeyForHelpSearch){
                                    searchTerminalCharactersHelper = false;
                                }
                            }

                            if(searchTerminalCharactersHelper){
                                searchTerminalCharacters = true;
                            }

                        } else {
                            searchTerminalCharacters = true;
                        }
                    }

                    if(!searchTerminalCharacters && singleRule.length > 0){
                        foundTerminalSymbol = false
                    }
                }

                if (foundTerminalSymbol) {
                    indexOfChange = -1;
                    for(let i = 0; i < rule[ruleKey][z].length; i++){
                        for(let singleRuleKey in singleRule){
                            for(let singleRuleKey in singleRule){
                                if(rule[ruleKey][z][i] === singleRuleKey){
                                    indexOfChange = singleRuleKey;
                                }
                            }
                        }
                        if(indexOfChange === -1){
                            if (stringForPushInIntermediateRule === undefined) {
                                stringForPushInIntermediateRule = rule[ruleKey][z][i];
                            } else {
                                stringForPushInIntermediateRule = stringForPushInIntermediateRule + rule[ruleKey][z][i];
                            }
                        } 
                        else{
                            stringForPushInIntermediateRule = makeIntermediateString(
                                singleRule,
                                indexOfChange,
                                counter,
                                stringForPushInIntermediateRule
                            );
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

    for(let intermediateRuleKey in intermediateRule){
        for(let i = 0; i < intermediateRule[intermediateRuleKey].length; i++){
            if(stringForPushInIntermediateRule === intermediateRule[intermediateRuleKey][i] &&
                ruleKey === intermediateRuleKey)
            {
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

function makeIntermediateString(singleRule, indexOfChange, counter, stringForPushInIntermediateRule){
    if (isArray(singleRule[indexOfChange])) {
        if (singleRule[indexOfChange][counter] !== undefined) {
            if (stringForPushInIntermediateRule === undefined) {
                stringForPushInIntermediateRule = singleRule[indexOfChange][counter];
            } else {
                stringForPushInIntermediateRule = stringForPushInIntermediateRule + singleRule[indexOfChange][counter];
            }
        } else if (stringForPushInIntermediateRule !== undefined) {
            stringForPushInIntermediateRule = singleRule[indexOfChange][0];
        }
    } else {
        if (stringForPushInIntermediateRule === undefined) {
            stringForPushInIntermediateRule = singleRule[indexOfChange];
        } else {
            stringForPushInIntermediateRule = stringForPushInIntermediateRule + singleRule[indexOfChange];
        }
    }

    return stringForPushInIntermediateRule;
}

//функция поиска однозначных правил
function searchForUniqueness(rule, singleRule){
    let allElementsIsTerminal;
    let wasNoSuchRule;
    let newElemCheck = 0;

    //Пробегаемся по всем правилам
    for (let ruleKey in rule){
        //Если правило - строка
        if(isString(rule[ruleKey])){
            allElementsIsTerminal = true;
            wasNoSuchRule = true;
            //Проверяем каждый элемент строки - является ли он терминалом
            for(let i = 0; i < rule[ruleKey].length; i++){
                for(let ruleKeyForCheckTerminal in rule){
                    if(rule[ruleKey][i] === ruleKeyForCheckTerminal){
                        allElementsIsTerminal = false;
                    }
                }
            }

            //Если все элементы строки терминалы
            if(allElementsIsTerminal){
                for(let singleRuleKey in singleRule){
                    //Проверяем было ли такое правило ранее
                    for(let i = 0; i < singleRule[singleRuleKey].length; i++){
                        if(rule[ruleKey] === singleRule[singleRuleKey][i] && ruleKey === singleRuleKey){
                            wasNoSuchRule = false;
                        }
                    }
                }
                if (wasNoSuchRule) {
                    if (!(ruleKey in singleRule)) {
                        singleRule[ruleKey] = [];
                    }

                    //Если не было, то добавляем новое правило
                    singleRule[ruleKey].push(rule[ruleKey]);
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
                    for(let ruleKeyForCheckTerminal in rule){
                        if(rule[ruleKey][i][j] === ruleKeyForCheckTerminal){
                            allElementsIsTerminal = false;
                        }
                    }
                }
                if(allElementsIsTerminal){
                    for(let singleRuleKey in singleRule){
                        for(let j = 0; j < singleRule[singleRuleKey].length; j++){
                            if(rule[ruleKey][i] === singleRule[singleRuleKey][j] &&
                                ruleKey === singleRuleKey)
                            {
                                wasNoSuchRule = false;
                            }
                        }
                    }
                    if(wasNoSuchRule){
                        if(!(ruleKey in singleRule)){
                            singleRule[ruleKey] = [];
                        }
                        singleRule[ruleKey].push(rule[ruleKey][i]);
                        newElemCheck = 1;
                    }
                }
            }
        }
    }

    return newElemCheck;
}
