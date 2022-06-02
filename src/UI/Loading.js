export class Loading{
    constructor({id}) {
        this.step = -1;
        this.steps = [
            "Генерируем слова 1/2",
            "Генерируем слова 2/2",
            "Сопоставляем",
            "Смотрим принадлежность грамматикам 1/2",
            "Сопоставляем",
            "Смотрим принадлежность грамматикам 2/2",
        ]
        this.id = id;
        this.element = document.querySelector("#" + id);
        this.resetBtn = this.element.querySelector(".reset");
        this.darkArea = this.element.querySelector(".dark");
        this.loader = this.element.querySelector(".lds-roller");
        this.loadingStep = this.element.querySelector(".layout").querySelector(".loading_step");
        this.resultField = this.element.querySelector(".layout").querySelector(".result");
        this.resetBtn.onclick = e => this.reset();
        this.darkArea.onclick = e => this.reset();
    }

    next(){
        document.body.classList.add("overflowHidden")
        this.element.classList.remove("hide");
        this.step += 1;
        this.loadingStep.children[5 - this.step].classList.add("done");
        if(typeof this.onNextObserver === "function"){
            this.onNextObserver();
        }
    }

    final({check1, check2}){
        this.loader.classList.add("hide");
        this.resultField.innerHTML = `${check1} | ${check2}`;
        this.loadingStep.classList.add("opacityHidden");
        setTimeout(() => {
            this.resultField.classList.remove("opacityHidden")
        }, 200)

    }


    error(error){
        document.body.classList.add("overflowHidden")

        this.element.classList.remove("hide");
        this.loader.classList.add("hide");
        this.resultField.innerHTML = `${error}`;
        this.loadingStep.classList.add("opacityHidden");
        setTimeout(() => {
            this.resultField.classList.remove("opacityHidden")
        }, 200)
    }

    reset(){
        this.resultField.innerHTML = "";
        this.resultField.classList.add("opacityHidden");
        this.loader.classList.remove("hide");
        this.step = -1;
        for (let i = 0; i < this.loadingStep.children.length; i++) {
            let item = this.loadingStep.children[i];
            item.classList.remove("done");
        }
        this.loadingStep.classList.remove("opacityHidden");
        this.element.classList.add("hide");
        if(typeof this.onCloseObserver === "function"){
            this.onCloseObserver();
        }

        document.body.classList.remove("overflowHidden")
    }

    setOnCloseObserver(callback) {
        this.onCloseObserver = callback;
    }
    setOnNextObserver(callback){
        this.onNextObserver = callback;
    }
}