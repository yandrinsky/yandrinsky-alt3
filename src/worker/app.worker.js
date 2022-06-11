import Engine from "../Engine";

function next(){
    postMessage({
        message: "NEXT",
    })
}

onmessage = ({ data: {message, payload} }) => {
    const CHECK_TIME_LIMIT = 2500;
    console.log("start worker");
    if(message === "START"){
        let time = Engine.speedtest(() => {
            postMessage({
                message: "COMPARE_START"
            })
            let isError = false;
            let engine1 = new Engine();
            let engine2 = new Engine();

            engine1.setSettings({
                RESULT_LIMIT: 1500,
                STACK_LIMIT: 2000,
                DEATH_TIME: 1500,
            });

            engine2.setSettings({
                RESULT_LIMIT: 1500,
                STACK_LIMIT: 2000,
                DEATH_TIME: 1500,
            });

            try{
                engine1.setGrammar(payload.grammar1);
                engine2.setGrammar(payload.grammar2);
            } catch (e) {
                postMessage({
                    message: "ERROR",
                    payload: e.message,
                })
                isError = true;
            }
            if(isError) return

            next();

            let result1 = engine1.generation();
            console.log("result1.lang", result1.length);
            postMessage({
                message: "GEN_1",
                payload: result1,
            })
            next();
            let result2 = engine2.generation();
            console.log("result2.lang", result2.length);
            postMessage({
                message: "GEN_2",
                payload: result2,
            })

            next();

            let unmatched;
            let match = [];
            let time1 = Engine.speedtest(() => {
                unmatched = engine1.unmatched(result1, result2);
                next()
                //Проверяем все слова на checkWord. Ограничиваем эту операцию по времени

                if(unmatched.length){
                    let time = Date.now();
                    for (let i = 0; i < unmatched.length; i++) {
                        if(Date.now() - time >= CHECK_TIME_LIMIT){
                            break;
                        }
                        match.push(engine2.checkWord(unmatched[i]));
                    }
                } else {
                    match = [true];
                }
                // match = unmatched.length ? unmatched.map((item) => engine2.checkWord(item)) : [true];
            })

            console.log("time1", time1);


            // const failed1 = match.map((item, index) => {
            //     if(item === false) {
            //         return unmatched[index];
            //     }
            // }).filter(item => item !== undefined);

            let matchTrue = match.filter(item => item === true);
            // result1.length - unmatched.length - сколько верных после сопоставления
            // match.length - сколько смогли проверить на checkWord (могли не успеть проверить все)
            const check1 = (matchTrue.length + result1.length - unmatched.length) / (result1.length - unmatched.length + match.length) * 100

            next();

            let time2 = Engine.speedtest(() => {
                unmatched = engine2.unmatched(result2, result1);
                next()
                match = [];
                //Проверяем все слова на checkWord. Ограничиваем эту операцию по времени
                if(unmatched.length){
                    let time = Date.now();
                    for (let i = 0; i < unmatched.length; i++) {
                        if(Date.now() - time >= CHECK_TIME_LIMIT){
                            break;
                        }
                        match.push(engine1.checkWord(unmatched[i]));
                    }
                } else {
                    match = [true];
                }
                //match = unmatched.length ? unmatched.map((item) => engine1.checkWord(item)) : [true];
            })

            console.log("time2", time2);


            // const failed2 = match.map((item, index) => {
            //     if(item === false) {
            //         return unmatched[index];
            //     }
            // }).filter(item => item !== undefined);

            //const check2 = (match.filter(item => item === true).length + result2.length - match.length) / result2.length * 100

            matchTrue = match.filter(item => item === true);
            // result1.length - unmatched.length - сколько верных после сопоставления
            // match.length - сколько смогли проверить на checkWord (могли не успеть проверить все)
            const check2 = (matchTrue.length + result2.length - unmatched.length) / (result2.length - unmatched.length + match.length) * 100
            postMessage({
                message: "FINAL",
                payload: `${Number(check1.toFixed(2))}|${Number(check2.toFixed(2))}`,
            });
        })
        console.log("time", time);
    }
    else if(message === "CHECKING_USER_WORD"){
        let isError = false;
        let check1;
        let check2;
        let engine1 = new Engine();
        let engine2 = new Engine();
        try{
            engine1.setGrammar(payload.grammar1);
            engine2.setGrammar(payload.grammar2);
        } catch (e) {
            postMessage({
                message: "ERROR",
                payload: e.message,
            })
            isError = true;
        }
        if(isError) return
        postMessage({
            message: "CHECKING_USER_WORD"
        })

        next();

        check1 = engine1.checkWord(payload.word);
        check2 = engine2.checkWord(payload.word);

        postMessage({
            message: "FINAL",
            payload:
             `<div style = "font-size: 24px">Слово ${payload.word} принадлежит к грамматике пользователя: <b>${check1 ? "Да" : "Нет"}</b></div>
             <div style = "font-size: 24px">Слово ${payload.word} принадлежит к эталонной грамматике: <b>${check2 ? "Да" : "Нет"}</b></div>
            `
        });

    }

};