// phina.js をグローバル領域に展開
phina.globalize();

var MOVETYPE = 0;
var TIME = 3.5 * 1000;
var INPUTFLG = false;     //文字入力状態判定フラグ
var RETRYFLG = false;     //もう一度ボタン判定フラグ
var RETRYCNT = 0;         //もう一度を1回だけにするためのカウント
var DECISIONFLG = false;  //得点計算判定フラグ
var NEXTFLG = false;      //次の問題へボタン判定フラグ
var RETURNFLG = false;    //入力前にもう一度見るか確認するフラグ
var ANSWARFLG = false;    //入力画面に行くフラグ
var STAGE = 1;
var SCORE = 0;
var MAXSTAGE = 10;
var HIGHSCORE = 0;
var SPEED_8 = 8;  //移動量（大きいほど速くなる）
var SPEED_10 = 10;
var SPEED_12 = 12;
var SPEED_14 = 14;
var SPEED_16 = 16;
var ROTATE_COUNT = ROTATE_CNT_MOVE1 = ROTATE_CNT_MOVE5 = ROTATE_CNT_MOVE6 = ROTATE_CNT_MOVE7 =  ROTATE_CNT_MOVE8 = 0;
var POS_X_CENTER = POS_Y_CENTER = 0;
var SCALE_X = SCALE_Y = 1;
var COLOR_RND = 0;

var ARY_MOVETYPE;
var WORD_EASY1;
var WORD_POS;
var WORD_POS_RND;
var WORD_EASY2;
var ARY_WORD_EASY1NO;
var ARY_WORD_POS;
var ARY_WORD_EASY2NO;
var INPUTWORD;
var WORDS;
var WORD_LENGTH;

var ASSETS = {
  image:{
    "bg": "./img/back.png",
    "title": "./img/title.png",
  },
};

// Titleシーン クラスを定義
phina.define('TitleScene', {

  superClass: 'DisplayScene', //継承
  init: function() {  //初期化
    this.superInit();   //親クラス初期化
    //this.backgroundColor = '#389723';   //背景色を指定

    $.getJSON("./data/data.json", function(data){  //  問題準備
      WORD_EASY1 = data.word_easy1;
      WORD_POS = data.word_pos;
      WORD_EASY2 = data.word_easy2;
    });

    HIGHSCORE = localStorage.getItem("highscore");
    if(HIGHSCORE == null){
      HIGHSCORE = 0;
    }

    Sprite("bg").addChildTo(this).setPosition(this.gridX.center(), this.gridY.center());  //背景
    var sprite_title = Sprite("title").addChildTo(this).setPosition(this.gridX.center(), this.gridY.span(3)); //タイトル
    this.sprite_title = sprite_title;

    // var label_title = Label({
    //   text: "うごもじくん",
    //   fill: "white",
    //   fontSize: 64,
    // }).addChildTo(this).setPosition(this.gridX.center(), this.gridY.span(3));
    // this.label_title = label_title;
    var centerX = this.gridX.center();
    var centerY = this.gridY.span(3);

    var label_highscore = Label({
      text: "ハイスコア：" + HIGHSCORE,
      fill: "white",
      fontSize: 40,
    }).addChildTo(this).setPosition(this.gridX.center(), this.gridY.span(5));
    this.label_highscore = label_highscore;

    var self = this;
    var button_tutorial = Button({
      text: "あそびかた",
      width: 300,
      height: 80,
      fill: "#243829",
    }).addChildTo(this).setPosition(this.gridX.center(), this.gridY.span(10))
      .onpush = function(){
        self.app.pushScene(TutorialScene());
      };

    var button_start = Button({
      text: "ゲームスタート",
      width: 300,
      height: 80,
      fill: "#243829",
    }).addChildTo(this).setPosition(this.gridX.center(), this.gridY.span(12));
    var rnd = Math.floor(Math.random() * ((3 + 1) - 0)) + 0;  //0~3の乱数
    moveTitle().move(this.sprite_title, centerX, centerY, rnd);


    button_start.onpointstart = () => { //ゲームスタートボタンが押された
      this.exit();
    };
  },
  // onpointstart: function(){
  //   this.exit();
  // }
});
// Mainシーン クラスを定義
phina.define('GameScene', {
  superClass: 'DisplayScene', //継承
  init: function() {    //初期化
    this.superInit();   //親クラス初期化
    this.timer = TIME;  //表示されるまでのタイマー
    //this.backgroundColor = '#389723'; // 背景色を指定

    INPUTFLG = false;
    RETRYFLG = false;
    RETRYCNT = 0;
    DECISIONFLG = false;
    NEXTFLG = false;
    RETURNFLG = false;
    ANSWARFLG = false;
    STAGE = 1;
    SCORE = 0;
    WORD_LENGTH = 0;
    ROTATE_COUNT = ROTATE_CNT_MOVE1 = ROTATE_CNT_MOVE5 = ROTATE_CNT_MOVE6 = ROTATE_CNT_MOVE7 =  ROTATE_CNT_MOVE8 = 0;
    //動きを初期化
    ARY_MOVETYPE = randomIndex(10);
    //console.log(ARY_MOVETYPE);
    MOVETYPE = ARY_MOVETYPE[0];
    ARY_MOVETYPE.shift();
    //console.log("MOVETYPE:" + MOVETYPE);
    //console.log(ARY_MOVETYPE);
    //問題を初期化
    ARY_WORD_EASY1NO = randomIndex(20);
    ARY_WORD_POS = randomIndex(7);
    ARY_WORD_EASY2NO = randomIndex(20);
    //console.log("WORD_EASY1NO:" + ARY_WORD_EASY1NO);
    //console.log("WORD_POS:" + ARY_WORD_POS);
    //console.log("WORD_EASY2NO:" + ARY_WORD_EASY2NO);
    WORD_POS_RND = Math.floor(Math.random() * ((6 + 1) - 0)) + 0; //0～5の乱数
    COLOR_RND = Math.floor(Math.random() * ((4 + 1) - 0)) + 0; //0～4の乱数

    Sprite("bg").addChildTo(this).setPosition(this.gridX.center(), this.gridY.center());  //背景

    var label_word = Label('問題の文字列').addChildTo(this);
    label_word.x = this.gridX.center(); // x 座標
    label_word.y = this.gridY.center(); // y 座標
    label_word.fill = 'white'; // 塗りつぶし色
    label_word.fontSize = 64;

    label_word.hide();
    this.label_word = label_word;
    POS_X_CENTER = this.gridX.center();
    POS_Y_CENTER = this.gridY.center();
    SCALE_X = this.label_word.scaleX;
    SCALE_Y = this.label_word.scaleY;
    setWordPos(this.label_word);   //最初の文字位置の調整関数へ

    var label_stage = Label({   //ステージ
      text: "STAGE : " + STAGE,
      fill: "white",
      fontSize: 48,
    }).addChildTo(this).setPosition(this.gridX.center(), this.gridY.span(1));
    this.label_stage = label_stage;

    var label_score = Label({   //スコア
      text: "SCORE : " + SCORE,
      fill: "white",
      fontSize: 48,
    }).addChildTo(this).setPosition(this.gridX.center(), this.gridY.span(2));
    this.label_score = label_score;

    var label_count = Label({   //問題文のカウントダウン
      text: TIME,
      fill: "white",
      fontSize: 72,
    }).addChildTo(this).setPosition(this.gridX.center(), this.gridY.center());
    this.label_count = label_count;

    var label_input = Label({
      text: "入力した文字列",
      fill: "white",
      fontSize: 64,
    }).addChildTo(this).setPosition(this.gridX.center(), this.gridY.center(0));
    label_input.hide();
    this.label_input = label_input;

    var label_answer = Label({
      text: "答えの文字列",
      fill: "white",
      fontSize: 64,
    }).addChildTo(this).setPosition(this.gridX.center(), this.gridY.center(-2));
    label_answer.hide();
    this.label_answer = label_answer;

    var label_loop = Label({
      text: "もう一度見たい時は\n左下のボタンを押してください\n（１回だけです）",
      fill: "white",
      fontSize: 40,
    }).addChildTo(this).setPosition(this.gridX.center(), this.gridY.center(-2));
    label_loop.hide();
    this.label_loop = label_loop;

    var label_getscore = Label({
      text: "答えの文字列",
      fill: "white",
      fontSize: 48,
    }).addChildTo(this).setPosition(this.gridX.center(), this.gridY.center(2));
    label_getscore.hide();
    this.label_getscore = label_getscore;

    var button_next = Button({
      text: "次の問題へ",
      width: 200,
      height: 80,
      fill: "#243829",
    }).addChildTo(this).setPosition(this.gridX.center(), this.gridY.center(4));
    button_next.hide();
    this.button_next = button_next;

    var button_ansinput = Button({
      text: "解答する",
      width: 200,
      height: 80,
      fill: "#243829",
    }).addChildTo(this).setPosition(this.gridX.center(), this.gridY.center(2));
    button_ansinput.hide();
    this.button_ansinput = button_ansinput;

    var button_retry = Button({
      text: "もう一度",
      width: 200,
      height: 80,
      fill: "#243829",
    }).addChildTo(this).setPosition(this.gridX.center(-5), this.gridY.center(7));

    var button_retire = Button({
      text: "リタイア",
      width: 200,
      height: 80,
      fill: "#243829",
    }).addChildTo(this).setPosition(this.gridX.center(5), this.gridY.center(7));

    button_ansinput.setInteractive(true);
    button_ansinput.onclick = function(){
      //console.log("解答するボタンを押した new");
      if(!ANSWARFLG){
        INPUTWORD = window.prompt('見えた文字を入力してください', '');
        ANSWARFLG = true;
        //inputDialog();
      }
    }

    button_next.onpointstart = () =>{ //次の問題へボタンを押した
      //console.log("次の問題へボタンを押した:" + NEXTFLG);
      if(!NEXTFLG){
        MOVETYPE = ARY_MOVETYPE[0];
        if(MAXSTAGE <= STAGE){
          this.exit({
            score: SCORE,
            word_length: WORD_LENGTH,
          });
        }
        ARY_MOVETYPE.shift();
        //console.log("MOVETYPE" + MOVETYPE);
        //console.log(ARY_MOVETYPE);
        STAGE++;
        this.label_stage.text = "STAGE : " + STAGE;
        INPUTFLG = false;
        RETRYFLG = false;
        RETRYCNT = 0;
        NEXTFLG = true;
        RETURNFLG = false;
        reset(this.label_word);
        this.label_word.hide();
        this.label_input.hide();
        this.label_answer.hide();
        this.label_getscore.hide();
        this.button_next.hide();
        this.label_loop.hide();
        this.button_ansinput.hide();
        this.timer = TIME;
        label_word.x = POS_X_CENTER;
        label_word.y = POS_Y_CENTER;
        label_word.vx = SPEED_8;
        setWordPos(this.label_word);
        WORD_POS_RND = Math.floor(Math.random() * ((5 + 1) - 0)) + 0; //0～5の乱数
        COLOR_RND = Math.floor(Math.random() * ((4 + 1) - 0)) + 0; //0～4の乱数
      }
    };

    button_retry.onpointstart = () => { //もう一度ボタンを押した
      if(!RETRYFLG && RETRYCNT == 0){
        //console.log("もう一度ボタンが実行された");
        RETRYFLG = true;
        RETRYCNT = 1;
        INPUTFLG = false;
        RETURNFLG = false;
        reset(this.label_word);
        this.label_word.hide();
        this.label_input.hide();
        this.label_answer.hide();
        this.label_getscore.hide();
        this.button_next.hide();
        this.label_loop.hide();
        this.button_ansinput.hide();
        this.timer = TIME;
        label_word.x = POS_X_CENTER;
        label_word.y = POS_Y_CENTER;
        label_word.vx = SPEED_8;
        setWordPos(this.label_word);
      }
    };

    button_retire.onpointstart = () => {  //リタイアボタンを押した
      this.exit({
        score: SCORE,
        word_length: WORD_LENGTH,
      });
    };
  },

  //毎フレーム更新
  update: function(app){
    this.timer -= app.deltaTime;
    this.nowTime = (this.timer/1000).toFixed(0);
    this.label_count.text = this.nowTime

    if (this.nowTime <= 0) {
      this.label_count.text = "";
      WORDS = WORD_EASY1[ARY_WORD_EASY1NO[STAGE-1]] + WORD_POS[ARY_WORD_POS[WORD_POS_RND]] + WORD_EASY2[ARY_WORD_EASY2NO[STAGE-1]];
      this.label_word.text = WORDS;
      this.label_answer.text = WORDS;
      this.label_word.show();
      //文字が動く関数へ移動する
      if(MOVETYPE == 0){ moveWord_yoko(this.label_word, COLOR_RND); }
      else if(MOVETYPE == 1){ moveWord_rotate(this.label_word, COLOR_RND); }
      else if(MOVETYPE == 2){ moveWord_scaleUP(this.label_word, COLOR_RND); }
      else if(MOVETYPE == 3){ moveWord_scaleDOWN(this.label_word, COLOR_RND); }
      else if(MOVETYPE == 4){ moveWord_yoko2(this.label_word, COLOR_RND); }
      else if(MOVETYPE == 5){ moveWord_RotAndRight(this.label_word, COLOR_RND); }
      else if(MOVETYPE == 6){ moveWord_RotAndRLeft(this.label_word, COLOR_RND); }
      else if(MOVETYPE == 7){ moveWord_RotAndScaleUP(this.label_word, COLOR_RND); }
      else if(MOVETYPE == 8){ moveWord_RotAndScaleDOWN(this.label_word, COLOR_RND); }
      else if(MOVETYPE == 9){ moveWord_UPDOWNAndscaleDOWN(this.label_word, COLOR_RND); }
    }
    if(this.nowTime < -1){
      this.label_word.hide();
    }
    if(this.nowTime < -2){
      if(!INPUTFLG && !DECISIONFLG){
        if(!RETURNFLG){
          this.button_ansinput.show();
          this.label_loop.show();
          RETURNFLG = true;
          ANSWARFLG = false;
        }
        else if(ANSWARFLG == true){
          this.label_loop.hide();
          this.button_ansinput.hide();
          //INPUTWORD = window.prompt('見えた文字を入力してください', '');
          //console.log("入力文字：" + INPUTWORD);
          if(INPUTWORD !="" && INPUTWORD !=null){
            //console.log("なんか入力した　残り：" + ARY_MOVETYPE.length);
            if(MAXSTAGE <= STAGE){
              this.button_next.text = "結果を見る";
            }
            window.focus();
            click_one(POS_X_CENTER, POS_Y_CENTER);
            this.label_input.text = INPUTWORD;
            this.label_input.show();
            this.label_answer.show();
            this.label_getscore.show();
            this.button_next.show();
            INPUTFLG = true;
            RETRYFLG = true;
            NEXTFLG = false;
            RETURNFLG = false;
            ANSWARFLG = false;
            score = decision(INPUTWORD, this.label_answer.text);
            //console.log("得点：" + score);
            SCORE += score;
            this.label_score.text = "SCORE : " + SCORE;
            WORD_LENGTH += WORDS.toString().length;
            //console.log("WORD_LENGTH:" + WORD_LENGTH);
            if(score > 0){ this.label_getscore.text = score + "点ゲット！"; }
            else{ this.label_getscore.text = "0点・・・";}
          }
          else{
            //console.log("何も入力されなかった　残り：" + ARY_MOVETYPE.length);
            window.focus();
            click_one(POS_X_CENTER, POS_Y_CENTER);
            RETURNFLG = false;
            ANSWARFLG = false;
          }
        }
      }
    }
  },
});
// Endシーン クラスを定義
phina.define('GameEndScene', {
  //継承
  superClass: 'DisplayScene',
  //初期化
  init: function(param) {
    //親クラス初期化
    this.superInit(param);
    // 背景色を指定
    //this.backgroundColor = '#389723';
    Sprite("bg").addChildTo(this).setPosition(this.gridX.center(), this.gridY.center());  //背景

    var highscore = localStorage.getItem("highscore");
    if(highscore < param.score){
      localStorage.setItem("highscore", param.score);
    }

    var label_wordlength = Label({
      text: "総文字数 : " + param.word_length,
      fill: "white",
      fontSize: 64,
    }).addChildTo(this).setPosition(this.gridX.center(), this.gridY.span(2));
    this.label_wordlength = label_wordlength;

    var label_score = Label({
      text: "SCORE : " + param.score,
      fill: "white",
      fontSize: 64,
    }).addChildTo(this).setPosition(this.gridX.center(), this.gridY.span(4));
    this.label_score = label_score;

    var button_twitter = Button({
      text: "Twitterでシェア",
      width: 350,
      height: 80,
      fill: "#243829",
    }).addChildTo(this).setPosition(this.gridX.center(), this.gridY.span(12));
    this.button_twitter = button_twitter;

    var button_end_back = Button({
      text: "タイトルへ戻る",
      width: 350,
      height: 80,
      fill: "#243829",
    }).addChildTo(this).setPosition(this.gridX.center(), this.gridY.span(14));
    this.button_end_back = button_end_back;

    var centerX = this.gridX.center();
    var centerY = this.gridY.center();
    var wordlength_y = this.gridY.span(2);
    var score_y = this.gridY.span(4);
    var twitter_y = this.gridY.span(12);
    var endback_y = this.gridY.span(14);
    moveEndWordLength(this.label_wordlength, this.label_score, this.button_twitter, this.button_end_back, centerX, centerY, wordlength_y, score_y, twitter_y, endback_y);

    var url = "https://capricalm.com/game/ugomoji/";
    var tweetTxt = encodeURIComponent("このゲーム（うごもじくん）で遊んでいます！" +  param.score + "点ゲットしました！ " + url + " #ugomojikun #うごもじくん");
    button_twitter.setInteractive(true);
    button_twitter.onclick = function(){
      window.open("http://twitter.com/intent/tweet?text=" + tweetTxt);
    }

    // button_twitter.onpointstart = () => {
    //   //var shareURL = "https://twitter.com/share?text=このゲーム（うごもじくん）で遊んでいます！" + param.score + "点ゲットしました！%0a&url=https://capricalm.com/game/ugomoji/&hashtags=ugomojikun,うごもじくん";
    //   //window.open(shareURL, "_blank");
    // }

    button_end_back.onpointstart = () => {
      this.exit();
    }
  },
});
// Resultシーン　クラスを定義（使っていない）
phina.define('ResultScene', {
  // デフォルトの ResultScene を上書き
  superClass: 'ResultScene',

  init: function() {
    this.superInit();
    //console.log(this);
    // // デフォルトの処理(Twitter シェア)を上書きする
    // this.shareButton.onclick = function() {
    //   // 特定の URL を開く
    //   window.open('https://phiary.me');
    // };

    // オリジナルのボタンを追加してみる
    var circle = CircleShape({
      radius: 64,
      fill: 'white',
      stroke: null,
    }).addChildTo(this);
    // 位置を調整
    circle.setPosition(320, 840);
    // タッチを有効に
    circle.interactive = true;
    // クリック時の処理を登録
    circle.onclick = function() {
      // 特定の URL を開く
      window.open('https://capricalm.com');
    };
  },
})
// Tutorialシーン　クラスを定義
phina.define('TutorialScene', {
  superClass: 'DisplayScene', //継承

  init: function() {  //初期化
    this.superInit(); //親クラス初期化
    //this.backgroundColor = 'rgba(0, 0, 0, 0.7)';  // 背景色を指定
    Sprite("bg").addChildTo(this).setPosition(this.gridX.center(), this.gridY.center());  //背景
    // 説明ラベルを生成
    var label_tutorial_title = Label({
      text: "- あそびかた -",
      fill: "white",
      fontSize: 64,
    }).addChildTo(this).setPosition(this.gridX.center(), this.gridY.span(1));
    this.label_tutorial_title = label_tutorial_title;

    var text = "3秒のカウントダウン後\n画面に文字が表示されます\n文字を覚えて入力してください\n合っている文字が多いほど\n高得点になります";
    var label_tutorial_text = Label({
      text: text,
      fill: "white",
      fontSize: 32,
    }).addChildTo(this).setPosition(this.gridX.center(), this.gridY.span(4));
    this.label_tutorial_text = label_tutorial_text;

    var text = "文字を一文字ずつ比較して\n合っている数で\n得点が決まります\nはみ出したり足りないと\n減点になります";
    var label_tutorial_text = Label({
      text: text,
      fill: "white",
      fontSize: 32,
    }).addChildTo(this).setPosition(this.gridX.center(), this.gridY.span(8));
    this.label_tutorial_text = label_tutorial_text;

    var label_tutorial_back = Label({
      text: "画面をタップすると\nタイトルに戻ります",
      fill: "white",
      fontSize: 32,
    }).addChildTo(this).setPosition(this.gridX.center(), this.gridY.span(14));
    this.label_tutorial_back = label_tutorial_back;
  },
  onpointstart: function(){
    this.exit();
  }
});
// メイン処理
phina.main(function() {
  // アプリケーション生成
  var app = GameApp({
    startLabel: 'titlescene', // タイトルシーンから開始する
    assets: ASSETS,
    scenes: [
      {
        className: "TitleScene",
        label: "titlescene",
        nextLabel: "gamescene",
      },
      // {
      //   className: "TutorialScene",
      //   label: "tutorialscene",
      //   nextLabel: "gamescene",
      // },
      {
        className: "GameScene",
        label: "gamescene",
        nextLabel: "gameendscene",
      },
      {
        className: "GameEndScene",
        label: "gameendscene",
        nextLabel: "titlescene",
      },
      // {
      //   className: "ResultScene",
      //   label: "ResultScene",
      //   nextLabel: "titlescene",
      // },
    ]
  });
  // アプリケーション実行
  app.run();
});
