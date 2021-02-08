//テスト
phina.define("game", {
  superClass: "DisplayElement",
  // 初期化
  init: function(maker, name) {
    // クラスメンバ
    this.maker = maker;
    this.name = name;

  },
});

//文字位置の初期化関数
phina.define("reset",{
  init: function(label_word){
    if(ROTATE_CNT_MOVE1 != 0){
      label_word.rotation -= ROTATE_CNT_MOVE1
      ROTATE_CNT_MOVE1 = 0;
    }
    else if(ROTATE_CNT_MOVE5 != 0){
      label_word.rotation -= ROTATE_CNT_MOVE5
      ROTATE_CNT_MOVE5 = 0;
    }
    else if(ROTATE_CNT_MOVE6 != 0){
      label_word.rotation -= ROTATE_CNT_MOVE6
      ROTATE_CNT_MOVE6 = 0;
    }
    else if(ROTATE_CNT_MOVE7 != 0){
      label_word.rotation -= ROTATE_CNT_MOVE7
      ROTATE_CNT_MOVE7 = 0;
    }
    else if(ROTATE_CNT_MOVE8 != 0){
      label_word.rotation -= ROTATE_CNT_MOVE8
      ROTATE_CNT_MOVE8 = 0;
    }
    // label_word.rotation -= ROTATE_COUNT;
    // ROTATE_COUNT = 0;
    label_word.scaleX = SCALE_X;
    label_word.scaleY = SCALE_Y;
  },
});

//最初の文字位置の調整関数
phina.define("setWordPos",{
  init: function(label_word){
    if(MOVETYPE == 0){
      label_word.x = 1;
    }
    else if(MOVETYPE == 2){
      label_word.scaleX = 0.8;
      label_word.scaleY = 0.8;
    }
    else if(MOVETYPE == 3){
      label_word.scaleX = 1.2;
      label_word.scaleY = 1.2;
    }
    else if(MOVETYPE == 4){
      label_word.x = 600;
    }
    else if(MOVETYPE == 5){
      label_word.x = 1;
    }
    else if(MOVETYPE == 6){
      label_word.x = 600;
    }
    else if(MOVETYPE == 7){
      label_word.scaleX = 0.8;
      label_word.scaleY = 0.8;
    }
    else if(MOVETYPE == 8){
      label_word.scaleX = 1.2;
      label_word.scaleY = 1.2;
    }
    else if(MOVETYPE == 9){
      label_word.y = 0;
    }
  },
});

//問題文と入力文の比較関数
function decision(input, answer){

  var scoreCnt = 0;
  if(input == null || input == ""){
    return 0;
  }
  else if(input.length <= answer.length){
    for(var i=0 ; i<input.length ; i++){
      if(input[i] == answer[i]){
        scoreCnt++;
      }
    }
    if(input.length < answer.length){ scoreCnt = scoreCnt - (answer.length - input.length); }
    if(scoreCnt <= 0){ scoreCnt = 0; }
    return scoreCnt;
  }
  else if(input.length > answer.length){
    for(var i=0 ; i<answer.length ; i++){
      if(input[i] == answer[i]){
        scoreCnt++;
      }
    }
    scoreCnt = scoreCnt - (input.length - answer.length);
    if(scoreCnt <= 0){ scoreCnt = 0; }
    return scoreCnt;
  }
  else{
    //console.log("あとで");
  }
}

//１回キャンバスをクリックする
phina.define("click_one",{
  init: function(x, y){
    // const elem = document.elementFromPoint(x, y);
    // console.log(elem);
    // elem.dispatchEvent(new MouseEvent("click", {
    //   clientX: x,
    //   clientY: y
    // }));

    var canvas = document.querySelector("canvas");
    var event = document.createEvent("MouseEvents");
    event.initEvent("click", false, true);
    canvas.dispatchEvent(event);
  },
});

//重複なしの番号を作り出す
function makeNum(n){
  var i, j, tmp, a = new Array(n);
  return function (){
    if(n > 0){
        i = n - 1;
        j = Math.floor(Math.random() * (n));
        tmp = a[i] || i;
        a[i] = a[j] || j;
        a[j] = tmp;
        n = i;
        return a[i];
    }else{
        return null;
    }
  }
}
function randomIndex(n){
  var i, j, tmp, a = new Array(n);
  a[0] = 0;
  for(i = n - 1; i > 0; i--) {
    j = Math.floor(Math.random() * (i+1));
    tmp = a[i] || i;
    a[i] = a[j] || j;
    a[j] = tmp;
  };
  return a;
}

// 入力ダイアログを定義
function inputDialog(){

  $("#inputWord").val('');
  $("#input").dialog({
    autoOpen: false,
    modal: true,
    buttons: {
      "ＯＫ": function() {
        INPUTWORD = $("#inputWord").val();
        ANSWARFLG = true;
        $(this).dialog("close");},
      "キャンセル": function() {
        ANSWARFLG = false;
        $(this).dialog("close");}
    }
  });
  $("#input").dialog("open");
}

//問題文を取り出す（使っていない）
function getJson(){
  var xmlhttp = new XMLHttpRequest();

  xmlhttp.onreadystatechange = function () {
    if (xmlhttp.readyState == 4) {
      if (xmlhttp.status == 200) {
        try{
          var data = JSON.parse(xmlhttp.responseText);
          //console.log(data.word_easy1);
          return data.word_easy1;
        }
        catch(error){
          //console.log("データのパース失敗");
          return "parse error";
        }
      }
    }
  }
  xmlhttp.open("GET", "./data/data.json");
  xmlhttp.send();
}

function getJson2(){
  $.getJSON("../data/data.json", function(data){
    var moveID = data.moveID;
    var word_e1 = data.word_e1;
    var word_pos = data.word_pos;
    var word_e2 = data.word_e2;

    //console.log(moveID);
    return [moveID, word_e1, word_pos, word_e2];
  });
}

function createTextArea(){
  var canvasName = document.getElementsByTagName("canvas");
  var canvas = canvasName[0];

  var textarea = document.createElement("textarea");
  document.body.appendChild(textarea);

  textarea.style.position = "absolute";
  textarea.style.top = 480 + "px";
  textarea.style.left = 320 + "px";

}

function tutorialShow(){
  var canvas = document.getElementsByTagName("canvas");
  //console.log(canvas);
  $(canvas[0]).wrap("<div id='area' />");
  var area = document.getElementById("area");
  // var div_bg = document.createElement("div");
  // area.appendChild(div_bg);
  // div_bg.id = "tutorial_bg";
  // div_bg.style.position = "absolute";

  var div_front = "<div id='tutorial_bg' ";
  var style_position = "style='position: absolute; ";
  var style_margin = "margin: auto; ";
  var style_width = "width: 417px; ";
  var style_height = "height: 626px; ";
  var div_end = "'></div>";
  $("#area").append(div_front + style_position + style_margin + style_width + style_height + div_end);
}
