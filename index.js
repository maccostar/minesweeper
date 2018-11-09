/* 1. expressモジュールをロードし、インスタンス化してappに代入。*/
var express = require("express");
var app = express();


/*2. 盤面の設定 */
/* 設定 */
const xy_len = 10; //盤面の大きさ
const bomb_number = 10; //爆弾の数

/* フラグ
opened  :開けられたか
owner   :誰が開けたか
hasBomb  :爆弾かどうか
display :表示
*/

// let board0 = [...Array(xy_len)].map(function(a){
//     return  [...Array(xy_len)].map(function(a){
//         return 0
//     })});

let board = [...Array(xy_len)].map(function(a){
    return  [...Array(xy_len)].map(function(a){
        return {
            opened : false,
            hasBomb : false
        }
})})


//ランダムな数を抽出
let selectRandom = function(){
    const len_digit = (xy_len - 1).toString(10).length
    let xy_num;
    while(!xy_num || xy_num >= xy_len ){
        xy_num = Math.floor(Math.random() * 10 * len_digit);    
    }
    return xy_num
}

//初期化
let start = function(){
    let bomb_counter = 0;

    while(bomb_counter < bomb_number){
        let _x = selectRandom()
        let _y = selectRandom()

        bomb_counter = 0;
        for (let x =0; x <xy_len; x++ ){
            for(let y =0; y <xy_len; y++){
                board[y][x].opened = false
                if(board[y][x].hasBomb == true ){ bomb_counter += 1 }
            }
        }

        if (bomb_counter < bomb_number){ board[_y][_x].hasBomb = true}
    }
    //console.log(bomb_counter);
}


// // 中間課題 カウントアップ
// let countup = function(x,y){
//     board0[y][x] += 1
// }



/* 3.getメソッドの定義*/
app.get('/board',(req,res) => {
    const x = req.query.x;
    const y = req.query.y;
    const button = req.query.button
    

    //スタートボタンが押された時だけ実行する
    if ( button == "start"){ start()}
    //res.json(board0);
    //countup(x,y);
    //res.json(board0[y][x]);
    res.json(board);
});

/* 4. listen()メソッドを実行して8000番ポートで待ち受け。*/
app.listen(8000);

