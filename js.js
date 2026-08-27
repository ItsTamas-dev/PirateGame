var level = 1;
var arr = new Array(10);
var bomba = false;
var meg = false;
var time = 10;
var gameEnd = false;
function RandomSzamok(arr) {
  for (var i = 0; i < 5; i++) {
    for(var j = 0; j<10; j++){
      var num;
      do {
        num = Math.floor(Math.random() * 4) + 1;
      } while (checkAdjacent(arr, i, j, num) > 1 || checkContinuation(arr, i, j, num) > 1);
      arr[i][j] = num;
    }
  }
}
function checkAdjacent(arr, row, col, num) {
  var count = 0;
  if (col > 0 && arr[row][col - 1] === num) {
    count++;
  }
  if (col < arr[row].length - 1 && arr[row][col + 1] === num) {
    count++;
  }
  if (row > 0 && arr[row - 1][col] === num) {
    count++;
  }
  if (row < arr.length - 1 && arr[row + 1][col] === num) {
    count++;
  }
  return count;
}
function checkContinuation(arr, row, col, num) {
  var count = 1;

  for (var i = col - 1; i >= 0; i--) {
    if (arr[row][i] === num) {
      count++;
    } else {
      break;
    }
  }

  for (var i = col + 1; i < arr[row].length; i++) {
    if (arr[row][i] === num) {
      count++;
    } else {
      break;
    }
  }
  for (var i = row - 1; i >= 0; i--) {
    if (arr[i][col] === num) {
      count++;
    } else {
      break;
    }
  }

  for (var i = row + 1; i < arr.length; i++) {
    if (arr[i][col] === num) {
      count++;
    } else {
      break;
    }
  }

  return count;
}

function Rajz(arr){
  var mainDiv = $("<div class='main'></div>").css({
    width: "1500px",
    height: "750px",
    display: "flex"
  });
  for (var i = 0; i < 10; i++) {
    var childDiv = $("<div class='col'></div>").css({
      width: "150px",
      height: "750px",
      border: "none"
    });
    childDiv.attr("id", i)
    mainDiv.append(childDiv);
    for (var j = 0; j < 10; j++) {
      var id = (j * 10) + i;
      var kocka = $("<div><img src=''></div>").css({
        width: "150px",
        height: "75px",
        border: "none"
      });
      $(childDiv).append(kocka);
      kocka.attr("class", id);
      kocka.attr("id", "class" + arr[j][i]);
    }
  }
  var imgDiv = $("<div class='char'><img src='img/pirate.png' id='pirate'><img src='' id='chest'></div>").css({
    width: "1500px",
    height: "220px",
    position: "relative"
  })
  var pontDiv = $("<div class='pontDiv'><p class='pont'>0</p></div>").css({
    position: "absolute",
    bottom: "30px",
    right: "30px"
  });
  var levelDiv = $("<div class='pontDiv'><a class='level'>1</a> . Szint</div>").css({
    position: "absolute",
    bottom: "100px",
    right: "60px"
  });
  var loadDiv = $("<div class='timeDiv'><a class='time'>10</a><br><a>Másodperc múlva új sor</a></div>").css({
    position: "absolute",
    top: "60px",
    right: "60px"
  });
  $("body").append(pontDiv);
  $("body").append(mainDiv);
  $("body").append(imgDiv);
  $("body").append(levelDiv);
  $("body").append(loadDiv);
}
function Hover(){
  $(".col").hover(function(){
    $(this).css("background-color", "rgba(180, 180, 180, 0.3)");
    }, function(){
    $(this).css("background-color", "transparent");
    
  });
  $(".col").hover(function(){
    var szor = $(this).attr('id') * 150;
    $('#pirate').css("left", szor);
  });
  $(".col").hover(function(){
    var szor = $(this).attr('id') * 150;
    $('#chest').css("left", szor);
  });
}
function ItemLe(arr, leId, lent){
  $( ".col" ).click(function() {
    var id = $(this).attr("id");
    if(lent == false){
      for(var i = 9; i > -1; i--){
        if(arr[i][id] != 0){
          if(arr[i][id] == 6){
            return;
          }
          var itemId = (i * 10) + parseInt(id);
          leId = arr[i][id];
          $('.'+itemId).prop("id", "");
          $("#chest").attr("src","img/chest"+arr[i][id]+".png");
          arr[i][id] = 0;
          lent = true;
          $("#pirate").attr("src","img/pirate2.png");
          $('#money2').get(0).play();
          break;
        }
      }
    }else{
      for(var i = 0; i <10; i++){
        var r;
        var s;
        if(arr[i][id] == 0){
          var itemId = (i * 10) + parseInt(id);
          r = i;
          s = id;
          arr[i][id] = leId;
          $('.'+itemId).attr("id", "class" + arr[i][id]);
          lent = false;
          $("#pirate").attr("src","img/pirate.png");
          $("#chest").attr("src","");
          for(let i = 0; i<10; i++){
            if(arr[9][i] != 0){
              gameover();
              gameEnd = true;
            }
          }
          $('#money').get(0).play();
          if(arr[i][id] == 5){
            explosion(arr, r);
            return;
          }
          search(arr, r, s);
          break;
        }
      }
    }
  });
}
function explosion(arr, r){
  $('#bomb').get(0).play();
  bomba = false;
  console.log("bomba");
  for(var i = 0; i< 10; i++){
    if(arr[r][i] == 6){
      meg = false;
    }
    arr[r][i] = 0;
  }
  tolFel(arr);
  reClass(arr);
  var pont = $('.pont').text();
  var newPont = (2000 + parseInt(pont));
  setInterval(function(){
    if(pont != newPont){
      $(".pont").text(parseInt(pont) + 50)
      pont = parseInt(pont)+50;
    }
  }, 5);

  if(newPont/20000 > parseInt(level)){
    newlevel();
  }
}
function search(arr, i, j){
  var items = [];
  var type = arr[i][j];
  keresbal(arr, i, j);
  keresjobb(arr, i, j);
  keresfent(arr, i, j);
  kereslent(arr, i, j);
  function keresfent(arr, i, j){
    if(i-1 > -1 &&arr[i-1][j] == type){
      if(!items.includes((i-1)+"-"+j)){
        items.push((i-1)+"-"+j);
        keresfent(arr, (i-1), j);
        kereslent(arr, (i-1), j);
        keresbal(arr, (i-1), j);
        keresjobb(arr, (i-1), j);
      }
    }
  }
  function kereslent(arr, i, j){
    if(i+1 < 10 &&arr[i+1][j] == type){
      if(!items.includes((i+1)+"-"+j)){
        items.push((i+1)+"-"+j);
        keresfent(arr, (i+1), j);
        kereslent(arr, (i+1), j);
        keresbal(arr, (i+1), j);
        keresjobb(arr, (i+1), j);
      }
    }
  }
  function keresbal(arr, i, j){
    if(j-1 >-1 && arr[i][j-1] == type){
      if(!items.includes(i+"-"+(j-1))){
        items.push(i+"-"+(j-1));
        keresfent(arr, i, (j-1))
        kereslent(arr, i, (j-1));
        keresbal(arr, i, (j-1));
        keresjobb(arr, i, (j-1));
      }
    }
  }
  function keresjobb(arr, i, j){
    if(((j%10)+1) < 10 && arr[i][((j%10)+1)] == type){
      if(!items.includes(i+"-"+(j+1))){
        items.push(i+"-"+((j%10)+1));
        keresfent(arr, i, ((j%10)+1));
        kereslent(arr, i, ((j%10)+1));
        keresbal(arr, i, ((j%10)+1));
        keresjobb(arr, i, ((j%10)+1));
      }
    }
  }
  if(items.length>3){
    deleteItem(arr, items, type);
    $('#point').get(0).play();
  }
}
function deleteItem(arr, items, type){
  for(var i = 0; i<items.length; i++){
    item = items[i].split("-");
    arr[item[0]][item[1]] = 0;
  }
  tolFel(arr);
  reClass(arr);
  countPoint(items.length, type);
}
function countPoint(db, type){
    szorzo = 0;
    switch(type){
      case 1: szorzo = 300;break;
      case 2: szorzo = 500;break;
      case 3: szorzo = 600;break;
      case 4: szorzo = 400;break;
    }
    var pont = $('.pont').text();
    var newPont = ((szorzo * db) + parseInt(pont));
    setInterval(function(){
      if(pont != newPont){
        $(".pont").text(parseInt(pont) + 50)
        pont = parseInt(pont)+50;
      }
    }, 5);

    if(newPont/20000 >= parseInt(level)){
      newlevel();
    }
}
function newlevel(){
  level ++;
  $(".level").text(level)
}
function tolFel(arr) {
  for (let j = 0; j < arr[0].length; j++) {
    let zeroIndex = null;
    for (let i = 0; i < arr.length; i++) {
      if (arr[i][j] === 0) {
        zeroIndex = i;
      } else if (zeroIndex !== null) {
        arr[i - 1][j] = arr[i][j];
        arr[i][j] = 0;
      }
    }
  }
  return arr;
}
function reClass(arr){
  for(var i = 0; i<100; i++){
    $("."+i).prop("id", "");
  }
  for(var i = 0; i<10; i++){
    for(var j = 0; j<10; j++){
      var id = (i * 10) + j;
      $("."+id).attr("id", "class"+arr[i][j]);
    }
  }
}
function newRow(arr, gameEnd){
  setInterval(() => {
    if(gameEnd){
      return;
    }
    for (let i = 9; i > 0; i--) { // A tömb sorait eltoljuk lentebb
      arr[i] = [...arr[i-1]];
    }
    arr[0] = Array.from({ length: 10 }, () => 0);
    for(var j = 0; j<10; j++){
      var num;
      do {
        if(level > 2){
          if(meg && !bomba){
            num = Math.floor(Math.random() * 5) + 1;
            if(num == 5){
              bomba = true;
            }
          } else if(!meg && bomba){
            num = Math.floor(Math.random() * 5) + 1
            if(num == 5){
              meg = true;
              num = 6;
            }
          }else{
            num = Math.floor(Math.random() * 4) + 1;
          }
        }else if(level > 1){
          if(!bomba){
            num = Math.floor(Math.random() * 5) + 1;
            if(num == 5){
              bomba = true;
            }
          }else{
            num = Math.floor(Math.random() * 4) + 1;
          }
        }else{
          num = Math.floor(Math.random() * 4) + 1;
        }
        
      } while (checkAdjacent(arr, 0, j, num) > 1 || checkContinuation(arr, 0, j, num) > 1);
      arr[0][j] = num;
    }
    // A felső sort véletlen számokkal feltöltjük
    for(let i = 0; i<10; i++){
      for(let j = 0; j<10; j++){
        var itemId = (i * 10) + j;
        $('.'+itemId).prop("id", "");
        $('.'+itemId).attr("id", "class" + arr[i][j])
      }
    }
    for(let i = 0; i<10; i++){
      if(arr[9][i] != 0){
        gameover();
        gameEnd = true;
      }
    }
    
  }, 10000);
}
function gameover(){
  gameEnd = true;
  $('.main').html("");
  $('.main').removeAttr('style');
  $(".main").css({
    width: "1500px",
    height: "750px",
    position: "relative"
  });
  var resBtn = $("<button type='button' class='gameover'>Új játék</button>").css({
    position: "absolute",
    top: "75%",
    left: "50%",
    cursor: "pointer",
    padding: "1em",
    border: "none",
    background: "black"
  });
  var gameo = $("<div class='goDiv'><p class='pont'>A játék vége</p></div>").css({
    position: "absolute",
    bottom: "50%",
    right: "40%"
  });
  $('.main').append(resBtn);
  $('.main').append(gameo);
  $('#gameover').get(0).play();
  $('#myaudio').get(0).pause();
  $('.main').prop("class");
  $('.main').attr("class", "go");
  $('.gameover').click(function(){
    location.reload();
  })
}
$(document).ready(function() {
  var leId = 0;
  var lent = false;
  document.getElementById("myaudio").volume = 0.6;
  for (var i = 0; i < arr.length; i++) {
    arr[i] = new Array(10).fill(0);
  }
  RandomSzamok(arr);
  Rajz(arr);
  ItemLe(arr, leId, lent, gameEnd);
  newRow(arr, gameEnd);
  Hover();
  setInterval(function(){
    if(gameEnd == false){
      time--;
      if(time == 0){
        time = 10;
      }
      $(".time").text(time);
    }
  }
  , 1000)
});