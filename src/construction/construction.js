export function replaceAllDeterminate(str, transformedCluster, determinate, includes, STACK_LIMIT, WORDS_LIMIT){
    const replaces = [];
    //Пример replaces:
    //replaces [ [ '[З0]', 'BB', 'a' ], [ '[З1]', 'AB', 'b' ] ]

    for (let i = 0; i < str.length; i++) {
        let index = determinate.indexOf(str[i]);
        if(index !== -1){
            let sign = `[З${replaces.length}]`;
            let rule = transformedCluster[determinate[index]];
            !Array.isArray(rule) ? rule = [rule] : null; //Если правило одно, то оно не в массиве, сделаем массив
            replaces.push([sign, ...rule]);
            str = str.replace(determinate[index], sign)
            i += sign.length - 1;
        }
    }


    let chains = [];
    let words = [];
    if(replaces.length){
        const indexes = combinationIndexes(...replaces.map(item => item.length - 1));
        for (let i = 0; i < indexes.length; i++) {
            let combination = indexes[i];
            let newStr = str;
            combination.forEach((item, index) => {
                newStr = newStr.replace(replaces[index][0], replaces[index][item + 1]); // + 1 т.к. нулевой индекс - это сама замена
            })
            if(includes(newStr, determinate)){
                if(chains.length >= STACK_LIMIT) break;
                chains.push(newStr);
            } else {
                if(words.length >= WORDS_LIMIT) break;
                words.push(newStr);
            }
        }
    }


    return {chains, words};
}

export function includes(str, determinate){
    let found;
    for (let i = 0; i < determinate.length; i++) {
        let indexOf = str.indexOf(determinate[i]);
        if(indexOf !== -1){
            found = determinate[i];
            break;
        }
    }
    return found;
}

export function combinationIndexes(...args){
    let limit = args.reduce((cur, acc) => acc *= cur);
    let multiples = [];
    for (let i = args.length - 1; i > 0 ; i--) {
        if(i === args.length - 1){
            multiples.push(args[i]);
        } else {
            multiples.push(args[i] * multiples[multiples.length - 1]);
        }
    }
    multiples.unshift(1);
    multiples.reverse();
    let res = [];
    for (let i = 0; i < limit; i++) {
        let current = [];
        for (let j = 0; j < args.length; j++) {
            current.push(Math.floor(i / multiples[j] % args[j]));
        }
        res.push(current);
    }
    return res;
}
