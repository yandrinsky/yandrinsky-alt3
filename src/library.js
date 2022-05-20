import {replaceAllDeterminate} from "./construction/construction";
import {includes} from "./construction/construction";
import {combinationIndexes} from "./construction/construction";
import {CHF, CYK_algorithm, CYK_algorithm2, Unambiguous_conversion} from "./check/check";



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
 @param CHF - функция, принимает transformedCluster, препобразовывает в нормальную форму хомского, мутирует объект
 */

/**
 @param CYK_algorithm - функция, принимает результат CHF и слово, проверяет слово на принадлежность грамматике
 */

/**
 @param Unambiguous_conversion - функция, принимает transformedCluster, преобразовывает правила грамматики по все тернарныеё
 */


export {replaceAllDeterminate, includes, combinationIndexes, Unambiguous_conversion, CHF, CYK_algorithm, CYK_algorithm2};