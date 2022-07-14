import {replaceAllDeterminate} from "./construction/construction";
import {includes} from "./construction/construction";
import {combinationIndexes} from "./construction/construction";
import {oneToOneTransformation} from "./check/oneToOneTransformation";
import {correctGrammarCheck} from "./check/correctGrammarCheck";
import {algorithmOfEarley} from "./check/algorithmOfEarley";



/**
@param replaceAllDeterminate - функция, принимает str, transformedCluster, determinate, includes
Возвращает массив новых цепочек и слов {chains, words}
 */

/**
 @param correctGrammarCheck - функция, принимает obj(набор правил), проверяет грамматику на корректность. Возвращает true/false
 */

/**
 @param includes - функция, принимает str, determinate
 Возвращает найденный нетерминант или undefined;
 */

/**
 @param combinationIndexes - функция, произвольное количество чисел и стоит по ним двумерный массив -
 всех возможных перестановок индексов
 */

/**
 @param algorithmOfEarley - функция, принимает str(слово), проверяет слово на принадлежность грамматике, не нуждается
 в форме хомского, более надежная. Возвращает true/false
 */

/**

/**

/**
 @param oneToOneTransformation - функция, принимает transformedCluster, преобразовывает правила грамматики по все терминалы
 */


export {replaceAllDeterminate, includes, combinationIndexes, oneToOneTransformation, algorithmOfEarley, correctGrammarCheck};