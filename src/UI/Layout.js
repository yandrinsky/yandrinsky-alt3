export const HTMLLayout = 
`<div id="root">
    <div class="loading hide" id="loading">
        <div class="dark"></div>
        <div class="layout">
            <div class="loader">
                <div class="lds-roller"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>
            </div>

            <div class="loading_step">
                
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
        <div class="side">
            <div class="rules rules2">
<!--                <div class="ruleBlock">-->
<!--                    <input type="text" class="term_input" value="S" disabled>-->
<!--                    <span>=></span>-->
<!--                    <input type="text" class="noterm_input">-->
<!--                </div>-->
            </div>
            <div class="add_ruleBlock" data-type="2">+</div>
            <textarea name="" cols="30" rows="10" class="textarea_2 genFiend" id="genFiend" disabled>

            </textarea>
        </div>
    </div>
     <div class = "check_user_word">
                <input type = "text" class="check_word_input input" size="26" placeholder = "Введите слово для проверки"></input>
                <button class = "check_word_button btn">проверить слово</button>
            </div>
    <button class="compare btn">сравнить</button>
</div>`
