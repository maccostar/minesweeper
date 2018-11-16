/* 1. expressモジュールをロードし、インスタンス化してappに代入。*/
var express = require("express")
var app = express()

//これはいけなかった
//express.static(__dirname + '/static/')

//これでもいける
//app.use(express.static('./static/'))
app.use(express.static('./static/'))

/*
//原始的表示設定
const fs = require('fs')
const path = require('path')
const htmlPath = path.join(__dirname,'./static/index.html')
const html = fs.readFileSync(htmlPath,'utf8')
// console.log(htmlPath)
// console.log(html)
*/

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

// 非表示用盤面の作成
let board = [...Array(xy_len)].map(function(a){
        return [...Array(xy_len)].map(function(a){
            return {
                opened : false,
                hasBomb : false,
                hasFlag : false,
                owner : "none",
                class : "N"
            }
    })})

//ランダムな数を抽出（初期化処理内で利用）
let selectRandom = function(){
    const len_digit = (xy_len - 1).toString(10).length
    let xy_num
    do {
       let random = Math.random()
       xy_num = Math.floor(random * 10 * len_digit)    
       //console.log("random",random,"len_degit",len_digit,"xy_len",xy_len,xy_num >= xy_len)
    } while ( xy_num >= xy_len )
    return xy_num
}

//初期化
let start = function(){
    let bomb_counter = 0

    //bombのセット
    while(bomb_counter < bomb_number){
        let _x = selectRandom()
        let _y = selectRandom()
        console.log("Bomb",_x,_y)

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

    //非表示処理と表示（0-8/B）のセット
    for (let x =0; x <xy_len; x++ ){
        for(let y =0; y <xy_len; y++){
            //全部非表示にする
            board[y][x].opened = false
            board[y][x].hasFlag = false
            //検証用
            //board[y][x].opened = true

            //周囲の相対的座標
            const directions =[ [-1,-1],[0,-1],[1,-1],[-1,0],[1,0],[-1,1],[0,1],[1,1] ]

            let count = 0;
            for(let i = 0 ; i < directions.length; i++){
                let arround_x = x + directions[i][0]
                let arround_y = y + directions[i][1]
                //console.log(arround_x,arround_y)
                if ( 0 <= arround_x && arround_x < xy_len && 0 <= arround_y && arround_y < xy_len ){ if (board[arround_y][arround_x].hasBomb == true){ count += 1 }}
            }
            //表示数をセットする
            if (board[y][x].hasBomb == true ){ board[y][x].class = "B"} else { board[y][x].class = String(count)}
        }
    }
}

// // 中間課題 カウントアップ処理
// let countup = function(x,y){   board0[y][x] += 1 }

let load = function(){
    let display = board.map((elem, idx, arr) => { 
        return elem.map((elem, idx, arr) => {
            //console.log(elem)
            //return elem.class
            if (elem.opened == true){ return elem.class } 
            else if (elem.hasFlag == true){return "F"} 
            else {return "" }
            
        })
    })
    return display
    //console.log(display)
}


let select = function(_x,_y){
    const x = Number(_x)
    const y = Number(_y)

    if( board[y][x].opened == true ){ 
        'alert("すでに開いています") '
    } else {
         board[y][x].opened = true 
        
         if (board[y][x].class == "0" ){
            //周囲の相対的座標
            const directions =[ [-1,-1],[0,-1],[1,-1],[-1,0],[1,0],[-1,1],[0,1],[1,1] ]

            //周囲の座標を確認して、再帰的にselect関数を呼び出してオープンさせる。
            for(let i = 0 ; i < directions.length; i++){
                let arround_x = x + directions[i][0]
                let arround_y = y + directions[i][1]
                //console.log("再帰チェック",arround_x,arround_y)
                if ( 0 <= arround_x && arround_x < xy_len  && 0 <= arround_y && arround_y < xy_len ){ select(arround_x,arround_y) }
                //if ( 0 <= arround_x && arround_x < xy_len  && 0 <= arround_y && arround_y < xy_len && board[arround_y][arround_x].class == "0" ){ select(arround_x,arround_y) }
            }
        }
    }
}

//爆発
let explosion = function(_x,_y){
    if(board[_y][_x].hasBomb == true ){
        return "NG"
    } else {
        return "OK"
    }
}

let flag = function(_x,_y){
    const x = Number(_x)
    const y = Number(_y)
    board[y][x].hasFlag = !board[y][x].hasFlag    
}

/* 3.getメソッドの定義*/

/*
//原始的な表示方法①
app.get('/',(req,res) => {
 res.send(`
        <!DOCTYPE html>
        <html>
            <head>
                <meta charset="UTF-8">
            </head>
            <body>
                <div id="app"></div>
                <style>
                </style>
                <script src="https://code.jquery.com/jquery-3.3.1.min.js"></script>
                <script>
                </script>
            </body>
        </html> 
 `)
})
*/

/*
//原始的な表示方法②
app.get('/',(req,res) => {
 res.send(html)
})
*/

app.get('/start',(req,res) => {
    //スタートボタンが押された時
    start()
    res.json(load())
})

app.get('/board',(req,res) => {
    const x = req.query.x
    const y = req.query.y
    const clickMode = req.query.select

    //xyを選択したとき
    if (x && y){
        if (clickMode == "left"){
            select(x,y) 
            console.log(explosion(x,y))    
        } else if (clickMode == "right"){
            flag(x,y)
            //console.log("右クリック")
        }
    }

    //res.json(board0);
    //countup(x,y);
    //res.json(board0[y][x]);
    res.json(load())
})


/* 4. listen()メソッドを実行して8000番ポートで待ち受け。*/
app.listen(8000)

