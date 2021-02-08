//タイトルを動かす
phina.define("moveTitle",{
  init: function(){
  },
  move: function(title, x, y, rnd){
    if(rnd == 0){
      title.tweener
      .to({ x: x+100 }, 2500, "swing")
      .to({ x: x-100 }, 2500, "swing")
      .setLoop(true)
      .play();
    }
    else if(rnd == 1){
      title.setPosition(x, y-200);
      title.tweener
      .to({ y: y }, 2000, "swing")
      .play();
    }
    else if(rnd == 2){
      title.setPosition(x, y+300);
      title.tweener
      .to({ y: y }, 2000, "swing")
      .play();
    }
    else if(rnd == 3){
      title.tweener
      .to({ y: y+70 }, 2500, "swing")
      .to({ y: y-70 }, 2500, "swing")
      .setLoop(true)
      .play();
    }
  },
});

//ゲーム終了画面の文字を動かす
phina.define("moveEndWordLength",{
  init: function(label_wordlength, label_score, button_twitter, button_end_back, centerX, centerY, wordlength_y, score_y, twitter_y, endback_y){
    label_wordlength.setPosition(centerX+500, wordlength_y);
    label_score.setPosition(centerX+500, score_y);
    button_twitter.setPosition(centerX+500, twitter_y);
    button_end_back.setPosition(centerX+500, endback_y);

    label_wordlength.tweener
    .to({ x: centerX }, 1500, "easeInOutQuad")
    .play();
    label_score.tweener.wait(500)
    .to({ x: centerX }, 1500, "easeInOutQuad")
    .play();
    button_twitter.tweener.wait(700)
    .to({ x: centerX }, 1500, "easeInOutQuad")
    .play();
    button_end_back.tweener.wait(900)
    .to({ x: centerX }, 1500, "easeInOutQuad")
    .play();
  },
});


//問題の文字列の動き
//左から右移動（MOVETYPE＝０）
phina.define("moveWord_yoko",{
  init: function(label_word, rnd){
    if(rnd == 0){ label_word.fill = "red"; }
    else if(rnd == 1){ label_word.fill = "green"; }
    else if(rnd == 2){ label_word.fill = "blue"; }
    else if(rnd == 3){ label_word.fill = "black"; }
    else if(rnd == 4){ label_word.fill = "white"; }
    label_word.moveBy(20, 0);
    //console.log(label_word.right);
    //if (label_word.right > 640 || label_word.left < 0) label_word.vx *= -1;   //  画面外にはみ出さない
    // label_word.width = label_word.calcCanvasWidth();  //ラベルのサイズ検出
    // label_word.height = label_word.calcCanvasHeight();  //ラベルのサイズ検出
  },
});
//回転（MOVETYPE＝１）
phina.define("moveWord_rotate",{
  init: function(label_word, rnd){
    if(rnd == 0){ label_word.fill = "red"; }
    else if(rnd == 1){ label_word.fill = "green"; }
    else if(rnd == 2){ label_word.fill = "blue"; }
    else if(rnd == 3){ label_word.fill = "black"; }
    else if(rnd == 4){ label_word.fill = "white"; }
    label_word.rotation += 10;
    ROTATE_CNT_MOVE1 += 10;
  },
});
//拡大（MOVETYPE＝２）
phina.define("moveWord_scaleUP",{
  init: function(label_word, rnd){
    if(rnd == 0){ label_word.fill = "red"; }
    else if(rnd == 1){ label_word.fill = "green"; }
    else if(rnd == 2){ label_word.fill = "blue"; }
    else if(rnd == 3){ label_word.fill = "black"; }
    else if(rnd == 4){ label_word.fill = "white"; }
    label_word.scaleX += 0.08;
    label_word.scaleY += 0.08;
  },
});
//縮小（MOVETYPE＝３）
phina.define("moveWord_scaleDOWN",{
  init: function(label_word, rnd){
    if(rnd == 0){ label_word.fill = "red"; }
    else if(rnd == 1){ label_word.fill = "green"; }
    else if(rnd == 2){ label_word.fill = "blue"; }
    else if(rnd == 3){ label_word.fill = "black"; }
    else if(rnd == 4){ label_word.fill = "white"; }
    if(label_word.scaleX > 0 || label_word.scaleY > 0 ){
      label_word.scaleX -= 0.03;
      label_word.scaleY -= 0.03;
    }
  },
});
//右から左移動（MOVETYPE＝４）
phina.define("moveWord_yoko2",{
  init: function(label_word, rnd){
    if(rnd == 0){ label_word.fill = "red"; }
    else if(rnd == 1){ label_word.fill = "green"; }
    else if(rnd == 2){ label_word.fill = "blue"; }
    else if(rnd == 3){ label_word.fill = "black"; }
    else if(rnd == 4){ label_word.fill = "white"; }
    label_word.moveBy(-20, 0);
  },
});
//回転しながら左から右移動（MOVETYPE＝５）
phina.define("moveWord_RotAndRight",{
  init: function(label_word, rnd){
    if(rnd == 0){ label_word.fill = "red"; }
    else if(rnd == 1){ label_word.fill = "green"; }
    else if(rnd == 2){ label_word.fill = "blue"; }
    else if(rnd == 3){ label_word.fill = "black"; }
    else if(rnd == 4){ label_word.fill = "white"; }
    label_word.moveBy(20, 0);
    label_word.rotation += 5;
    ROTATE_CNT_MOVE5 += 5
  },
});
//回転しながら右から左移動（MOVETYPE＝６）
phina.define("moveWord_RotAndRLeft",{
  init: function(label_word, rnd){
    if(rnd == 0){ label_word.fill = "red"; }
    else if(rnd == 1){ label_word.fill = "green"; }
    else if(rnd == 2){ label_word.fill = "blue"; }
    else if(rnd == 3){ label_word.fill = "black"; }
    else if(rnd == 4){ label_word.fill = "white"; }
    label_word.moveBy(-20, 0);
    label_word.rotation += 5;
    ROTATE_CNT_MOVE6 += 5
  },
});
//回転しながら拡大（MOVETYPE＝７）
phina.define("moveWord_RotAndScaleUP",{
  init: function(label_word, rnd){
    if(rnd == 0){ label_word.fill = "red"; }
    else if(rnd == 1){ label_word.fill = "green"; }
    else if(rnd == 2){ label_word.fill = "blue"; }
    else if(rnd == 3){ label_word.fill = "black"; }
    else if(rnd == 4){ label_word.fill = "white"; }
    label_word.scaleX += 0.05;
    label_word.scaleY += 0.05;
    label_word.rotation += 5;
    ROTATE_CNT_MOVE7 += 5
  },
});
//回転しながら縮小（MOVETYPE＝８）
phina.define("moveWord_RotAndScaleDOWN",{
  init: function(label_word, rnd){
    if(rnd == 0){ label_word.fill = "red"; }
    else if(rnd == 1){ label_word.fill = "green"; }
    else if(rnd == 2){ label_word.fill = "blue"; }
    else if(rnd == 3){ label_word.fill = "black"; }
    else if(rnd == 4){ label_word.fill = "white"; }
    if(label_word.scaleX > 0 || label_word.scaleY > 0 ){
      label_word.scaleX -= 0.02;
      label_word.scaleY -= 0.02;
      label_word.rotation += 5;
      ROTATE_CNT_MOVE8 += 5
    }
  },
});
//上から下へ移動しながら小さくなる（MOVETYPE＝９）
phina.define("moveWord_UPDOWNAndscaleDOWN",{
  init: function(label_word, rnd){
    if(rnd == 0){ label_word.fill = "red"; }
    else if(rnd == 1){ label_word.fill = "green"; }
    else if(rnd == 2){ label_word.fill = "blue"; }
    else if(rnd == 3){ label_word.fill = "black"; }
    else if(rnd == 4){ label_word.fill = "white"; }
    if(label_word.scaleX > 0 || label_word.scaleY > 0 ){
      label_word.scaleX -= 0.03;
      label_word.scaleY -= 0.03;
      label_word.moveBy(0, 40);
    }
  },
});
