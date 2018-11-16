const render = (board) => {
    // DOMを破棄して再構築
  };
  
  setInterval(() => {
    // 0.5秒ごとにサーバーにポーリング
    $.getJSON('/board', render)
  }, 500)
  
  $('.block').click(function() {
    // xとyを算出する
    $.getJSON('/board', {
      x: x,
      y: y,
      user: user,
    }, render)
  })