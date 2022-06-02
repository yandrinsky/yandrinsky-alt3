export const HTMLLayout = `
<div id="root">
    <div class="loading hide" id="loading">
        <div class="dark"></div>
        <div class="layout">
            <div class="loader">
                <div class="lds-roller"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>
            </div>

            <div class="loading_step">
                <div>Смотрим принадлежность грамматикам 2/2</div>
                <div>Сопоставляем</div>
                <div>Смотрим принадлежность грамматикам 1/2</div>
                <div>Сопоставляем</div>
                <div>Генерируем слова 2/2</div>
                <div>Генерируем слова 1/2</div>
            </div>
            <div class="result opacityHidden">

            </div>
            <div class="reset">x</div>
        </div>
    </div>
    <div class="layout">
        <div class="side">
            <div class="rules rules1">
<!--                <div class="ruleBlock">-->
<!--                    <input type="text" class="term_input" value="S" disabled>-->
<!--                    <span>=></span>-->
<!--                    <input type="text" class="noterm_input">-->
<!--                </div>-->
            </div>
            <div class="add_ruleBlock" data-type="1">+</div>
            <textarea name="" cols="30" rows="10" class="textarea_1 genFiend" id="genFiend" disabled>

            </textarea>
        </div>
    </div>
    <button class="compare">сравнить</button>
</div>
`