/* 1. expressモジュールをロードし、インスタンス化してappに代入。*/
var express = require("express")
var app = express()


/*2. 盤面の設定 */
/* 設定 */
const xy_len = 10 //盤面の大きさ
const bomb_number = 10 //爆弾の数

/* フラグ
opened  :開けられたか
owner   :誰が開けたか
hasBomb  :爆弾かどうか
display :表示
*/

// let board0 = [...Array(xy_len)].map(function(a){
//     return  [...Array(xy_len)].map(function(a){
//         return 0
//     })})

let board = [...Array(xy_len)].map(function(a){
    return  [...Array(xy_len)].map(function(a){
        return {
            opened : false,
            hasBomb : false,
            owner : "none",
            class : "N"
        }
})})


//ランダムな数を抽出
let selectRandom = function(){
    const len_digit = (xy_len - 1).toString(10).length
    let xy_num
    while(!xy_num || xy_num >= xy_len ){
        xy_num = Math.floor(Math.random() * 10 * len_digit);    
    }
    return xy_num
}

//初期化
let start = function(){
    let bomb_counter = 0

    while(bomb_counter < bomb_number){
        let _x = selectRandom()
        let _y = selectRandom()

        bomb_counter = 0;
        for (let x =0; x <xy_len; x++ ){
            for(let y =0; y <xy_len; y++){
                //爆弾があればカウントアップする
                if(board[y][x].hasBomb == true ){ bomb_counter += 1 }
            }
        }
        //全部数えた結果、bomb_number数が足りなければセットする
        if (bomb_counter < bomb_number){ board[_y][_x].hasBomb = true}
    }

    for (let x =0; x <xy_len; x++ ){
        for(let y =0; y <xy_len; y++){
            //全部非表示にする
            board[y][x].opened = false

            /* もうちょっとおしゃれにできるはず */
            let count = 0;
            if (y-1 > 0 && x-1 > 0      ){if (board[y-1][x-1].hasBomb == true){count += 1}} 
            if (y-1 > 0                 ){if (board[y-1][x].hasBomb == true ){count += 1}}
            if (y-1 > 0 && x+1 < xy_len ){if (board[y-1][x+1].hasBomb == true){count += 1}}             
            if (x-1 > 0                 ){if (board[y][x-1].hasBomb == true){count += 1}}
            if (x+1 < xy_len            ){if (board[y][x+1].hasBomb == true){count += 1}} 
            if (y+1 < xy_len && x-1 > 0 ){if (board[y+1][x-1].hasBomb == true){count += 1}} 
            if (y+1 < xy_len            ){if (board[y+1][x].hasBomb == true){count += 1}} 
            if (y+1 < xy_len && x+1 < xy_len){if (board[y+1][x+1].hasBomb == true ){count += 1}}

            //表示数をセットする
            if (board[y][x].hasBomb == true ){ board[y][x].class = "B"} else { board[y][x].class = String(count)}
        }
    }
}



// // 中間課題 カウントアップ
// let countup = function(x,y){
//     board0[y][x] += 1
// }



let load = function(){
    let display = board.map((elem, idx, arr) => { 
        return elem.map((elem, idx, arr) => {
            //console.log(elem)
            //return elem.class
            if (elem.opened == true){ return elem.class } else {return "h" }
            
        })
    })
    return display
    //console.log(display)
}

let select = function(x,y){
    if( board[y][x].opened == true ){ 
        'alert("すでに開いています") '
    } else { board[y][x].opened = true }
}

let explosion = function(x,y){
    if(board[y][x].hasBomb == true ){
        return "NG"
    } else {
        return "OK"
    }
}

/* 3.getメソッドの定義*/
app.get('/board',(req,res) => {
    const x = req.query.x
    const y = req.query.y
    const button = req.query.button
    //スタートボタンが押された時だけ実行する
    if ( button == "start"){ start()}

    //xyを選択したとき
    if (x && y){ 
        select(x,y) 
        console.log(explosion(x,y))
    }

    //res.json(board0);
    //countup(x,y);
    //res.json(board0[y][x]);
    res.json(load())
})

/* 4. listen()メソッドを実行して8000番ポートで待ち受け。*/
app.listen(8000);

