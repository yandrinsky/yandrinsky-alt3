import {isString} from "../helpers/isString";

//Функция принимает в себя грамматику и слово. Сообщает - принадлежит ли данное слово к грамматике. Не мутирует входные данные
export function algorithmOfEarley(grammar, word){

    let allStateTable = [];
    let lastStateTable;
    let specialCharacter = "~";
    let stateString = 0;
    let stateNumber = 1;
    let saveAllStateTableLength = -1;
    let numberOfStateTable;
    let newStateSymbol = "Старт";

    //Добавляем в начальную таблицу состояний новый стартовый символ
    allStateTable[0] = [[`${newStateSymbol} -> ${specialCharacter}S`, 0]];

    for(let i = 0; i < (word.length + 1); i++){

        numberOfStateTable = i;
        scanWordForAddNewStateInCorrectStateTable(allStateTable, numberOfStateTable, grammar, word, specialCharacter);

        while(allStateTable[i] !== undefined && saveAllStateTableLength !== allStateTable[i].length){

            saveAllStateTableLength = allStateTable[i].length;
            completeState(allStateTable, numberOfStateTable, specialCharacter);
            predictNewState(allStateTable, numberOfStateTable, grammar, specialCharacter);

        }

    }

    //Берем последнюю таблицу состояний
    lastStateTable = allStateTable[word.length];

    if(lastStateTable !== undefined){

        for(let check = 0; check < lastStateTable.length; check++){

            if(lastStateTable[check][stateString] === `${newStateSymbol} -> S${specialCharacter}` &&
                lastStateTable[check][stateNumber] === 0)
            {
                return true
            }

        }

    }

    return false
}

//Данная функция сканирует слово и предыдущую таблицу состояний, чтобы добавить в текущую таблицу состояний новые состояния.
//Если это возможно
function scanWordForAddNewStateInCorrectStateTable(allStateTable, numberOfStateTable, grammar, word, specialCharacter){

    let allNonTerminal = [];
    let newStateString;
    let stateString = 0;
    let stateNumber = 1;
    let previousStateTable = allStateTable[numberOfStateTable - 1]

    //Собираем все нетерминалы
    for(let key in grammar){
        allNonTerminal.push(key);
    }

    //Если номер текущей таблицы состояний ноль, то выходит из функции, т.к. предыдущей таблицы состояний еще не существует
    if(numberOfStateTable === 0){
        return
    }

    if(previousStateTable !== undefined){

        for(let j = 0; j < previousStateTable.length; j++){

            let saveStringForChange;
            let stateStringAndStateNumber = previousStateTable[j];

            for(let z = 0; z < stateStringAndStateNumber[0].length; z++){

                //Проверяем состояние из предыдущей таблицы состояния. Если символ из этого состояния является
                //терминалом и он равен проверяемому символу из слова, то в текущую таблицу состояний новое состояние,
                //в котором специальный символ перешагнет данный терминал
                if(stateStringAndStateNumber[stateString][z] === specialCharacter &&
                    stateStringAndStateNumber[stateString][z + 1] !== undefined &&
                    !allNonTerminal.includes(stateStringAndStateNumber[stateString][z + 1]) &&
                    stateStringAndStateNumber[stateString][z + 1] === word[numberOfStateTable - 1])
                {

                    saveStringForChange = stateStringAndStateNumber[stateString][z + 1];

                    newStateString = (stateStringAndStateNumber[stateString].slice(0, z) +
                        saveStringForChange +
                        specialCharacter +
                        stateStringAndStateNumber[stateString].slice(z+2, stateStringAndStateNumber[stateString].length));

                    if(allStateTable[numberOfStateTable] === undefined){

                        allStateTable[numberOfStateTable] = [[newStateString, stateStringAndStateNumber[stateNumber]]]

                    } else{

                        allStateTable[numberOfStateTable].push([newStateString, stateStringAndStateNumber[stateNumber]]);

                    }
                }
            }
        }
    }
}

//Данная функция проверяет текущую таблицу состояний. Если в ней есть состояние, где специальный символ уже прошел
//все остальные символы и находится в конце состояния. Мы смотрим номер этого состояния и возвращаемся в таблицу состояний
//с данным номером и перемещаем там специальный символ в других состояниях, если это возможно
function completeState(allStateTable, numberOfStateTable, specialCharacter){

    let correctStateTable = allStateTable[numberOfStateTable];
    let stateTableWithCompletedStateNumber;
    let newStateString;
    let saveStringForChange;
    let stateString = 0;
    let stateNumber = 1;

    if(correctStateTable !== undefined){

        for(let j = 0; j < correctStateTable.length; j++){

            if(correctStateTable[j][stateString][correctStateTable[j][stateString].length-1] === specialCharacter){

                stateTableWithCompletedStateNumber = allStateTable[correctStateTable[j][stateNumber]];

                for(let z = 0; z < stateTableWithCompletedStateNumber.length; z++){

                    for(let w = 0; w < stateTableWithCompletedStateNumber[z][stateString].length; w++){

                        let checkRepeat = true

                        if(stateTableWithCompletedStateNumber[z][stateString][w] === specialCharacter &&
                            stateTableWithCompletedStateNumber[z][stateString][w+1] === correctStateTable[j][stateString][0])
                        {

                            saveStringForChange = stateTableWithCompletedStateNumber[z][stateString][w + 1];

                            newStateString = (stateTableWithCompletedStateNumber[z][stateString].slice(0, w) +

                                saveStringForChange + specialCharacter +

                                stateTableWithCompletedStateNumber[z][stateString].slice(w + 2,
                                    stateTableWithCompletedStateNumber[z][stateString].length));

                            for(let check = 0; check < allStateTable[numberOfStateTable].length; check++){

                                if(allStateTable[numberOfStateTable][check][stateString] === newStateString &&
                                    allStateTable[numberOfStateTable][check][stateNumber] ===
                                    stateTableWithCompletedStateNumber[z][stateNumber]
                                ){
                                    checkRepeat = false;
                                }

                            }
                            if(checkRepeat) {

                                if(numberOfStateTable === correctStateTable[j][stateNumber]){

                                    allStateTable[numberOfStateTable][z] = [newStateString,
                                        stateTableWithCompletedStateNumber[z][stateNumber]]

                                } else{

                                    allStateTable[numberOfStateTable].push([newStateString,
                                        stateTableWithCompletedStateNumber[z][stateNumber]]);

                                }

                            }
                        }
                    }
                }
            }
        }
    }
}

//Функция добавляет новые состояния, в них специальный символ перешагивает нетерминалы, который могут перейти
//в пустой символ
function workWithEpsilonSymbol(allStateTable, numberOfStateTable, StateWithEpsilonTransition,
                               numberOfStateWithEpsilonTransition, specialCharacter){

    let currentStateTable = allStateTable[numberOfStateTable];
    let saveNewStateString;
    let checkRepeat;
    let stateString = 0;
    let stateNumber = 1;

    for(let j = 0; j < currentStateTable.length; j++){

        for(let z = 0; z < currentStateTable[j][stateString].length; z++){

            checkRepeat = true;

            if(currentStateTable[j][stateString][z] === specialCharacter &&
                currentStateTable[j][stateString][z + 1] === StateWithEpsilonTransition)
            {
                saveNewStateString = (currentStateTable[j][stateString].slice(0, z) +
                    StateWithEpsilonTransition +
                    specialCharacter +
                    currentStateTable[j][stateString].slice(z+2, currentStateTable[j][stateString].length));

                for(let check = 0; check < allStateTable[numberOfStateTable].length; check++){

                    if(allStateTable[numberOfStateTable][check][stateString] === saveNewStateString &&
                        allStateTable[numberOfStateTable][check][stateNumber] === numberOfStateWithEpsilonTransition)
                    {
                        checkRepeat = false;
                    }

                }

                if(checkRepeat){
                    allStateTable[numberOfStateTable].push([saveNewStateString, numberOfStateWithEpsilonTransition])
                }

                if(checkRepeat){
                    z = 0;
                }
            }
        }
    }
}

//Функция предсказывает и добавляет новые состояния в таблицу состояний
function predictNewState(allStateTable, numberOfStateTable, grammar, specialCharacter){

    let currentStateTable = allStateTable[numberOfStateTable];
    let nonTerm = [];
    let checkRepeat;

    for(let key in grammar){
        nonTerm.push(key);
    }

    if(currentStateTable !== undefined){

        for(let j = 0; j < currentStateTable.length; j++){
            for(let z = 0; z < currentStateTable[j][0].length; z++){

                checkRepeat = true;

                if(currentStateTable[j][0][z] !== undefined &&
                    currentStateTable[j][0][z] === specialCharacter &&
                    currentStateTable[j][0][z+1] !== undefined &&
                    nonTerm.includes(currentStateTable[j][0][z+1]))
                {

                    if(isString(grammar[currentStateTable[j][0][z+1]])){

                        if(grammar[currentStateTable[j][0][z+1]] === ""){
                            workWithEpsilonSymbol(allStateTable, numberOfStateTable,
                                currentStateTable[j][0][z+1], currentStateTable[j][1], specialCharacter);
                        }

                        for(let check = 0; check < allStateTable[numberOfStateTable].length; check++){

                            if(allStateTable[numberOfStateTable][check][0] ===
                                `${currentStateTable[j][0][z+1]} -> ${specialCharacter}${grammar[currentStateTable[j][0][z+1]]}`
                                && allStateTable[numberOfStateTable][check][1] === numberOfStateTable)
                            {
                                checkRepeat = false;
                            }

                        }

                        if(checkRepeat !== false) {
                            checkRepeat = true;
                        }

                        if(checkRepeat) {
                            allStateTable[numberOfStateTable].push([`${currentStateTable[j][0][z+1]} -> ${specialCharacter}${grammar[currentStateTable[j][0][z+1]]}`,
                                numberOfStateTable])
                        }
                    }else{

                        for(let o = 0; o < grammar[currentStateTable[j][0][z+1]].length; o++){

                            if(grammar[currentStateTable[j][0][z+1]][o] === "") {
                                workWithEpsilonSymbol(allStateTable, numberOfStateTable, currentStateTable[j][0][z+1], currentStateTable[j][1], specialCharacter);
                            }

                            checkRepeat = true;

                            for(let check = 0; check < allStateTable[numberOfStateTable].length; check++){
                                if(allStateTable[numberOfStateTable][check][0] ===
                                    `${currentStateTable[j][0][z+1]} -> ${specialCharacter}${grammar[currentStateTable[j][0][z+1]][o]}`
                                    && allStateTable[numberOfStateTable][check][1] === numberOfStateTable)
                                {
                                    checkRepeat = false;
                                }
                            }

                            if(checkRepeat !== false) {
                                checkRepeat = true;
                            }

                            if(checkRepeat) {
                                allStateTable[numberOfStateTable].push([`${currentStateTable[j][0][z+1]} -> ${specialCharacter}${grammar[currentStateTable[j][0][z+1]][o]}`,
                                    numberOfStateTable])
                            }

                        }
                    }
                }
            }
        }
    }
}