import Engine from '../Engine';

function next() {
  postMessage({
    message: 'NEXT'
  });
}

onmessage = ({ data: { message, payload } }) => {
  const CHECK_TIME_LIMIT = 1500;
  if (message === 'start') {
    let time = Engine.speedtest(() => {
      let isError = false;
      let engine1 = new Engine();
      let engine2 = new Engine();

      engine1.setSettings({
        RESULT_LIMIT: 1000,
        STACK_LIMIT: 2000,
        DEATH_TIME: 1500
      });

      engine2.setSettings({
        RESULT_LIMIT: 1000,
        STACK_LIMIT: 2000,
        DEATH_TIME: 1500
      });

      try {
        engine1.setGrammar(payload.grammar1);
        engine2.setGrammar(payload.grammar2);
      } catch (e) {
        postMessage({
          message: 'ERROR',
          payload: e.message
        });

        isError = true;
      }
      if (isError) {
        return;
      }

      next();

      let result1 = engine1.generation();

      postMessage({
        message: 'GEN_1',
        payload: result1
      });

      next();

      let result2 = engine2.generation();

      postMessage({
        message: 'GEN_2',
        payload: result2
      });

      next();

      let unmatched;
      let match = [];
      let time1 = Engine.speedtest(() => {
        unmatched = engine1.unmatched(result1, result2);
        next();
        //Проверяем все слова на checkWord. Ограничиваем эту операцию по времени

        if (unmatched.length) {
          let time = Date.now();
          for (let i = 0; i < unmatched.length; i++) {
            if (Date.now() - time >= CHECK_TIME_LIMIT) {
              break;
            }
            match.push(engine2.checkWord(unmatched[i]));
          }
        } else {
          match = [true];
        }
      });

      let matchTrue = match.filter(item => item === true);
      // result1.length - unmatched.length - сколько верных после сопоставления
      // match.length - сколько смогли проверить на checkWord (могли не успеть проверить все)
      const check1 =
        ((matchTrue.length + result1.length - unmatched.length) /
          (result1.length - unmatched.length + match.length)) *
        100;

      next();

      let time2 = Engine.speedtest(() => {
        unmatched = engine2.unmatched(result2, result1);
        next();
        match = [];
        //Проверяем все слова на checkWord. Ограничиваем эту операцию по времени
        if (unmatched.length) {
          let time = Date.now();
          for (let i = 0; i < unmatched.length; i++) {
            if (Date.now() - time >= CHECK_TIME_LIMIT) {
              break;
            }
            match.push(engine1.checkWord(unmatched[i]));
          }
        } else {
          match = [true];
        }
        //match = unmatched.length ? unmatched.map((item) => engine1.checkWord(item)) : [true];
      });

      matchTrue = match.filter(item => item === true);
      // result1.length - unmatched.length - сколько верных после сопоставления
      // match.length - сколько смогли проверить на checkWord (могли не успеть проверить все)

      const check2 =
        ((matchTrue.length + result2.length - unmatched.length) /
          (result2.length - unmatched.length + match.length)) *
        100;

      postMessage({
        message: 'FINAL',
        payload: {
          check1: check1,
          check2: check2
        }
      });
    });
  }
};
