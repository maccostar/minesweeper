let counter = 0
let isStart = false

const render = (data1,textStatus,jqXHR) => {
    // DOMを破棄して再構築
    const length = data1.length
    let moji = "<table>"
    

    for(let y = 0; y < length; y++){
        moji += "<tr>"
        for(let x = 0; x < length; x++){
            moji += "<th class='box' id="+x+"and"+y+">" +data1[y][x]+"</th>"
        }
        moji += "<tr>"
    }
    moji += "</table>"

    $("#app").html(moji)

    // $("#span1").text(jqXHR.status)
    // $("#span2").text(textStatus)
    // $("#span3").text(data1)
    counter += 1
    $("#span4").text(counter)
}

setInterval(() => {
    // 0.5秒ごとにサーバーにポーリング
    $.getJSON('/board', render)
}, 500)

    
$('#startbutton').click(function() {
    console.log("push_startbutton")
    isStart = true
    
    $.getJSON('/start', {
        username: "mishima",
        }
    )
    .done( //成功時
        function(data1,textStatus,jqXHR){
            // $("#span1").text(jqXHR.status)
            // $("#span2").text(textStatus)
            // $("#span3").text(data1.length)
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


$('#app').click(function(e) {
    //const _username = $("#username").val()
    let _result = e.target.id.split("and")
    if (_result.length == 2){
        $.getJSON('/board', {
            x: _result[0],
            y: _result[1],
            select: "left",
            //username: _username
        }, render)
    }
})


$('#app').bind("contextmenu",function(e) {
    e.preventDefault();

    //const _username = $("#username").val()
    let _result = e.target.id.split("and")
    if (_result.length == 2){
        $.getJSON('/board', {
            x: _result[0],
            y: _result[1],
            select: "right",
            //username: _username
        }, render)
    }
})


