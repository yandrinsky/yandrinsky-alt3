import {replaceAllDeterminate} from "./construction/construction";
import {includes} from "./construction/construction";
import {combinationIndexes} from "./construction/construction";
import {CHF, CYK_algorithm, Unambiguous_conversion} from "./check/check";



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

export {replaceAllDeterminate, includes, combinationIndexes, Unambiguous_conversion, CHF, CYK_algorithm};