const render = (board) => {
    // DOMを破棄して再構築
}


// setInterval(() => {
//     // 0.5秒ごとにサーバーにポーリング
//     $.getJSON('/board', render)
// }, 500)
    
$('#startbutton').click(function() {
    console.log("push_startbutton")
    
    $.getJSON('/start', {
        username: "mishima",
        }
    )
    .done( //成功時
        function(data1,textStatus,jqXHR){
            $("#span1").text(jqXHR.status)
            $("#span2").text(textStatus)
            $("#span3").text(data1.length)
        }
    )
    .fail( //失敗時
        function(){
            $("#span4").text("処理に失敗しました")
        }
    )
    .always( //完了したら
        function(){
            $("#span4").text("処理は完了しました")
        }
    )
}) 


$('#hoge').click(function() {
    console.log("push")
    // xとyを算出する
    $.getJSON('/board', {
        x: 3,
        y: 4,
    }, render)
    console.log(render)
})