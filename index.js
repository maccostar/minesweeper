
const xy_len = 10;
const bomb_number = 10;

let board = [...Array(xy_len)].map(function(a){
    return  [...Array(xy_len)].map(function(a){
        return {
            isOpen : 0,
            isBomb : 0,
            display : 0
        }
    })});

/*
*/

//真ん中に白黒を配置
console.log(board);

