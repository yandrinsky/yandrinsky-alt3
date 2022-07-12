import {replaceAllDeterminate} from "./construction/construction";
import {includes} from "./construction/construction";
import {combinationIndexes} from "./construction/construction";
import {algorithm_of_earley, unambiguous_conversion} from "./check/check";



/**
@param replaceAllDeterminate - функция, принимает str, transformedCluster, determinate, includes
Возвращает массив новых цепочек и слов {chains, words}
 */

/**
 @param includes - функция, принимает str, determinate
 Возвращает найденный нетерминант или undefined;
 */

/**
 @param combinationIndexes - функция, произвольное количество чиселел и стоит по ним двумерный массив -
 всех возможных перестановок индексов
 */

/**
 @param algorithm_of_earley - функция, принимает и слово, проверяет слово на принадлежность грамматике, не нуждается в форме хомского, более надежная
 */

/**

/**

/**
 @param unambiguous_conversion - функция, принимает transformedCluster, преобразовывает правила грамматики по все тернарныеё
 */


export {replaceAllDeterminate, includes, combinationIndexes, unambiguous_conversion, algorithm_of_earley};