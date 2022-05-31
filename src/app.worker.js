import Engine from "./Engine";

function next(){
    postMessage({
        message: "NEXT",
    })
}

onmessage = ({ data: {message, payload} }) => {

    if(message === "start"){
        let time = Engine.speedtest(() => {
            console.log("start worker");
            let engine1 = new Engine();
            let engine2 = new Engine();
            engine1.setGrammar(payload.grammar1);
            engine2.setGrammar(payload.grammar2);
            console.log("ENGINE1");
            console.log("NTC", engine1.options.rules.NTC);
            console.log("UTC", engine1.options.rules.UTC);
            console.log("ENGINE2");
            console.log("NTC", engine2.options.rules.NTC);
            console.log("UTC", engine2.options.rules.UTC);

            next();

            let result1 = engine1.generation();
            postMessage({
                message: "GEN_1",
                payload: result1,
            })
            next();
            let result2 = engine2.generation();

            postMessage({
                message: "GEN_2",
                payload: result2,
            })

            next();

            let unmatched;
            let match;
            let time1 = Engine.speedtest(() => {
                unmatched = engine1.unmatched(result1, result2);
                next()
                match = unmatched.length ? unmatched.map((item) => engine2.checkWord(item)) : [true];
            })

            console.log("time1", time1);


            const failed1 = match.map((item, index) => {
                if(item === false) {
                    return unmatched[index];
                }
            }).filter(item => item !== undefined);


            const check1 = (match.filter(item => item === true).length + result1.length - match.length) / result1.length * 100

            next();
            let time2 = Engine.speedtest(() => {
                unmatched = engine2.unmatched(result2, result1);
                next();
                match = unmatched.length ? unmatched.map((item) => engine1.checkWord(item)) : [true];
            })

            console.log("time2", time2);


            const failed2 = match.map((item, index) => {
                if(item === false) {
                    return unmatched[index];
                }
            }).filter(item => item !== undefined);

            const check2 = (match.filter(item => item === true).length + result2.length - match.length) / result2.length * 100

            postMessage({
                message: "FINAL",
                payload: {
                    check1: check1,
                    check2: check2,
                }
            });
        })
        console.log("time", time);
    }

};