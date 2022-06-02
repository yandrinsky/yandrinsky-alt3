// grammar:
let a = [
    {sign: "S", res: "AB"},
    {sign: "A", res: "BB"}, {sign: "A", res: "a"},
    {sign: "B", res: "AB"}, {sign: "B", res: "b"},
]

let b = [
    {sign: "S", res: "AB"},
    {sign: "A", res: "BB"}, {sign: "A", res: "a"},
    {sign: "B", res: "F"}, {sign: "F", res: "AB"},
    {sign: "B", res: "b"},
]

let c = [
    {sign: "S", res: "aA"},
    {sign: "A", res: "+aA"},
    {sign: "A", res: ""}
]

let d = [
    {sign: "S", res: "A"},
    {sign: "A", res: "BC"} , {sign: "A", res: "CB"},
    {sign: "B", res: "bB"}, {sign: "B", res: ""},
    {sign: "C", res: "cC"}, {sign: "C", res: ""},
]

let my = [
    {sign: "S", res: "GN"},
    {sign: "N", res: "+GN"},
    {sign: "N", res: ""},
    {sign: "G", res: "x"},
    {sign: "G", res: "Kx"},
    {sign: "G", res: "xL"},
    {sign: "G", res: "KxL"},
    {sign: "K", res: "2M"}, {sign: "K", res: "3M"},
    {sign: "K", res: "4M"}, {sign: "K", res: "5M"},
    {sign: "K", res: "6M"}, {sign: "K", res: "7M"},
    {sign: "K", res: "8M"}, {sign: "K", res: "9M"},
    {sign: "M", res: ""},
    {sign: "M", res: "1M"}, {sign: "M", res: "2M"},
    {sign: "M", res: "3M"},    {sign: "M", res: "4M"},
    {sign: "M", res: "5M"},    {sign: "M", res: "6M"},
    {sign: "M", res: "7M"},    {sign: "M", res: "8M"},
    {sign: "M", res: "9M"},    {sign: "M", res: "0M"},
    {sign: "L", res: "^K"}, {sign: "L", res: ""},
]