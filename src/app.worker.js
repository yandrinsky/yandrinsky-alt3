import Engine from "./Engine";

onmessage = ({ data: {message, payload} }) => {

    if(message === "start"){
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
        postMessage({
            message: "NEXT",
        })
        let result1 = engine1.generation();
        postMessage({
            message: "GEN_1",
            payload: result1,
        })
        postMessage({
            message: "NEXT",
        })
        let result2 = engine2.generation();

        postMessage({
            message: "GEN_2",
            payload: result2,
        })

        postMessage({
            message: "NEXT",
        })
        let unmatched = engine1.unmatched(result1, result2);
        let match = unmatched.length ? unmatched.map((item) => engine2.checkWord(item)) : [true];

        console.log("match 1", [...match]);

        let failed = match.map((item, index) => {
            if(item === false) {
                return unmatched[index];
            }
        }).filter(item => item !== undefined);

        console.log("failed1", failed);

        postMessage({
            message: "NEXT",
        })

        const check1 = (match.filter(item => item === true).length + result1.length - match.length) / result1.length * 100
        postMessage({
            message: "NEXT",
        })
        unmatched = engine2.unmatched(result2, result1);
        match = unmatched.length ? unmatched.map((item) => engine1.checkWord(item)) : [true];

        console.log("match 2", [...match]);
        postMessage({
            message: "NEXT",
        })

        const check2 = (match.filter(item => item === true).length + result2.length - match.length) / result2.length * 100

        postMessage({
            message: "FINAL",
            payload: {
                check1: check1,
                check2: check2,
            }
        });
    }

};