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
        }
        .compare{
            margin-top: 30px;
            padding: 5px;
            background-color: greenyellow;
        }
        .side{
            width: 100%;
            margin-left: 10px;
        }
        .side:first-of-type{
            border-right: 1px solid black;
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
    </style>`;
