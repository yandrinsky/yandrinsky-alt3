export const styles = `<style>
        body{
            margin: 0;
            padding: 0;
        }
        
   
        .rules{
            display: flex;
            flex-direction: column;
        }
        .ruleBlock{
            display: flex;
            align-items: center;
            font-family: Calibri;
            margin-top: 10px;
        }
        .term_input{
            width: 25px;
            height: 25px;
            margin-right: 10px;
            padding: 5px;
            font-size: 20px;
            text-align: center;
        }
        .noterm_input{
            height: 25px;
            padding: 5px;
            font-size: 16px;
            margin-left: 10px;
        }
        .add_ruleBlock{
            width: 30px;
            height: 30px;
            border-radius: 100%;
            border: 1px solid black;
            display: flex;
            justify-content: center;
            align-items: center;
            background-color: greenyellow;
            font-size: 20px;
            padding: 0px;
            cursor: pointer;
            margin-top: 10px;
            margin-left: 3px;
            margin-bottom: 10px;
        }
          .compare{
            margin-top: 30px;
            padding: 7px 10px;
            background-color: greenyellow;
            position: fixed;
            bottom: 30px;
            right: 30px;
            /*z-index: -1;*/
            cursor: pointer;
            border-radius: 6px;
            font-size: 16px;
            
        }
        .side{
            width: 100%;
            margin-left: 10px;
            display: flex;
            flex-direction: column;
            align-items: center;
        }
     
        .layout{
            display: flex;
        }
        .del{
            width: 15px;
            height: 15px;
            background-color: orangered;
            padding: 5px;
            display: flex;
            justify-content: center;
            align-items: center;
            border-radius: 100%;
            margin-left: 10px;
            cursor: pointer;
        }
        .overflowHidden{
            overflow: hidden;
        }
        .loading{
            width: 100%;
            height: 100%;
            position: fixed;
        }
      

        .loading .reset{
            position: absolute;
            right: 10px;
            top: 10px;
            font-size: 20px;
            cursor: pointer;
        }
        .loading .layout{
            font-family: "Calibri Light";
            background: white;
            max-width: 700px;
            width: 100%;
            position: fixed;
            transform: translate(-50%, -50%);
            left: 50%;
            top: 50%;
            height: 500px;
            border: 1px solid black;
            opacity: 1;
            z-index: 10;
        }

        .loading .dark{
            position: absolute;
            top: 0;
            left: 0;
            height: 100vh;
            width: 100vw;
            background: #000;
            opacity: 0.3;
            z-index: 9;
        }

        .loading_step{
            height: 100%;
            width: 100%;
            display: flex;
            justify-content: center;
            align-items: center;
            flex-direction: column;
            text-align: center;

            font-weight: bold;
        }
        .loading_step div{
            transition: opacity 0.3s ease-in;
            opacity: 0;
            font-size: 30px;
        }
        .loading_step .done{
            transition: opacity 0.3s ease-in;
            opacity: 1;
            color: black;
        }

        .result{
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            transition: opacity 0.3s ease-in;
            font-size: 40px;
            text-align: center;
        }

        .opacityHidden{
            opacity: 0;
            transition: opacity 0.3s ease-in;
        }

        .hide{
            display: none !important;
        }
        
        .genFiend{
            border: 2px solid yellowgreen;
            max-width: 800px;
            height: 300px;
            width: 100%;
            padding: 10px;
            margin-bottom: 30px;
            border-radius: 5px;
        }
        
        .genFiend:disabled{
            color: black;
        }

        .loader{
            position: absolute;
            left: 50%;
            transform: translateX(-50%);
            bottom: 20px;
        }

        .lds-roller {
            display: inline-block;
            position: relative;
            width: 80px;
            height: 80px;
        }
        .lds-roller div {
            animation: lds-roller 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
            transform-origin: 40px 40px;
        }
        .lds-roller div:after {
            content: " ";
            display: block;
            position: absolute;
            width: 7px;
            height: 7px;
            border-radius: 50%;
            background: yellowgreen;
            /*background: #cef;*/
            margin: -4px 0 0 -4px;
        }
        .lds-roller div:nth-child(1) {
            animation-delay: -0.036s;
        }
        .lds-roller div:nth-child(1):after {
            top: 63px;
            left: 63px;
        }
        .lds-roller div:nth-child(2) {
            animation-delay: -0.072s;
        }
        .lds-roller div:nth-child(2):after {
            top: 68px;
            left: 56px;
        }
        .lds-roller div:nth-child(3) {
            animation-delay: -0.108s;
        }
        .lds-roller div:nth-child(3):after {
            top: 71px;
            left: 48px;
        }
        .lds-roller div:nth-child(4) {
            animation-delay: -0.144s;
        }
        .lds-roller div:nth-child(4):after {
            top: 72px;
            left: 40px;
        }
        .lds-roller div:nth-child(5) {
            animation-delay: -0.18s;
        }
        .lds-roller div:nth-child(5):after {
            top: 71px;
            left: 32px;
        }
        .lds-roller div:nth-child(6) {
            animation-delay: -0.216s;
        }
        .lds-roller div:nth-child(6):after {
            top: 68px;
            left: 24px;
        }
        .lds-roller div:nth-child(7) {
            animation-delay: -0.252s;
        }
        .lds-roller div:nth-child(7):after {
            top: 63px;
            left: 17px;
        }
        .lds-roller div:nth-child(8) {
            animation-delay: -0.288s;
        }
        .lds-roller div:nth-child(8):after {
            top: 56px;
            left: 12px;
        }
        @keyframes lds-roller {
            0% {
                transform: rotate(0deg);
            }
            100% {
                transform: rotate(360deg);
            }
        }
    </style>
`