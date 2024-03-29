// Created by zak00aria

/*
on Pc use:

z: to move Up
q: to move Left
d: to move Right
s: to move Down

*/

onload = function() {


  
  /***********/
  let body_height=document.body.offsetHeight;
  let menu_height=document.querySelector("#menu").offsetHeight; game_height=document.querySelector("#game").offsetWidth;
  if(game_height+menu_height>body_height){
  let scale=(body_height-menu_height)/game_height;
      game.style="transform:scale("+scale+")";
  }
  /***********/
  const DUR = 160;
  const DT = 20;//you can try 16 or 160
  const delay = DUR*1.2;
  const cols = 4,
  rows = 4;
  let canimove = true;
  let cnv_bg = document.createElement("canvas");
  document.querySelector("#game").append(cnv_bg);
  let width = cnv_bg.offsetWidth;
  let height = width;
  cnv_bg.width = width;
  cnv_bg.height = height;
  let ctx_bg = cnv_bg.getContext("2d");
  draw_bg();
  let cnv = document.createElement("canvas");
  cnv.onclick=function(){
    switch(Game.state){
      case Game.states.START:
        Game.start();break;
      case Game.states.PAUSE:
        Game.state=Game.states.PLAY;
        document.querySelector("#pause_btn").style.opacity="1";
        Game.update();break;
      case Game.states.GAME_OVER:
      case Game.states.WIN:
        Game.state=Game.states.START;
        drawStart();break;
    }
  }
  document.querySelector("#game").append(cnv);
  width = cnv.offsetWidth;
  height = width;
  cnv.width = width;
  cnv.height = height;
  let ctx = cnv.getContext("2d");
  let grid = [];
  let Game = {
    states:{
      PAUSE:0,
      PLAY:1,
      START:2,
      GAME_OVER:3,
      WIN:4
    },
    state:2,
    score:0,
    hscore:0,
    interval: null,
    start:function(){
      if(Game.state==Game.states.PLAY){return;}
      init_grid();
      Game.state=Game.states.PLAY;
      Game.draw();
      Game.update();
    },
    draw: function() {
      clearCnv();
      for (let j = 0; j < rows; j++) {
        for (let i = 0; i < cols; i++) {
          grid[j][i].animate();
          grid[j][i].draw();
        }
      }
    },
    update: function() {
      Game.interval = setInterval(()=> {
        if(Game.empty_sells==0){
          if(slideUp(0)+slideRight(0)+slideDown(0)+slideLeft(0)==0){
            if(chekUp(0)+chekRight(0)+chekDown(0)+chekLeft(0)==0){
              Game.state=Game.states.GAME_OVER;
            }
          }
        }
        Game.draw();
        if(Game.state==Game.states.GAME_OVER || Game.state==Game.states.WIN){
          if(Game.sss==0){
            setTimeout(()=>{
              clearInterval(Game.interval);
              Game.sss=0;
            },DUR*2);
            Game.sss=1;
          }
        }else if(Game.state==Game.states.PAUSE){
          clearInterval(Game.interval);
        }
        if(Game.state==Game.states.GAME_OVER){
          drawGameOver();
        }else if(Game.state==Game.states.WIN){
          drawYouWin();
        }
      }, DT);
    },
    sss:0,
    empty_sells:rows*cols
  };
  
  document.querySelector("#pause_btn").onclick=function(){
    if(Game.state==Game.states.PLAY){
      Game.state=Game.states.PAUSE;
      this.style.opacity="0";
      clearInterval(Game.interval)
      drawPause();
    }
  };
  drawStart();
  function init_grid() {
    grid = [];
    Game.empty_sells=cols*rows;
    for (let j = 0; j < rows; j++) {
      grid.push([]);
      for (let i = 0; i < cols; i++) {
        let sell = new squar(i*width/rows, j*width/rows, width/rows, 0);
        grid[j].push(sell);
      }
    }
    add();
    add();
  }
  function add() {
    let v = Math.random() < 0.5 ? 2: 4;
    let i,
    j;
    do {
      i = Math.floor(Math.random()*grid[0].length);
      j = Math.floor(Math.random()*grid.length);
    }while (grid[j][i].value != 0);
    grid[j][i].value = v;
    grid[j][i].scale=0.2;
    grid[j][i].to_scale=1;
    Game.empty_sells--;
    Game.draw();
  }

  let mouse = {
    sx: 0,
    sy: 0,
    ex: NaN,
    ey: NaN
  };
  cnv.ontouchstart = function(e) {
    mouse.sx = e.touches[0].clientX;
    mouse.sy = e.touches[0].clientY;
  }
  cnv.ontouchmove = function(e) {
    mouse.ex = e.touches[0].clientX;
    mouse.ey = e.touches[0].clientY;
  }
  cnv.ontouchend = function(e) {
    let dx,
    dy;
    if (mouse.ex) {
      dx = mouse.ex-mouse.sx;
      dy = mouse.ey-mouse.sy;
    }
    mouse.sx = 0;
    mouse.sy = 0;
    mouse.ex = NaN;
    mouse.ey = NaN;
    if (!canimove || Game.state!=Game.states.PLAY) {
      return;
    }
    if (Math.abs(dx) > Math.abs(dy)) {
      if (dx > 0) {
        moveRight();
      } else if (dx < 0) {
        moveLeft();
      }
    } else if (Math.abs(dy) > Math.abs(dx)) {
      if (dy > 0) {
        moveDown();
      } else if (dy < 0) {
        moveUp();
      }
    }
  }
  onkeypress = function(e) {
    e.preventDefault();
    if (!canimove || Game.state!=Game.states.PLAY) {
      return;
    }
    let key = e.keyCode;
    switch (key) {
      case 122:
        moveUp(); break;
      case 100:
        moveRight(); break;
      case 115:
        moveDown(); break;
      case 113:
        moveLeft();
    }
  };
  function moveUp() {
    canimove = false;
    let moves = 0;
    let cheks = 0;
    if (slideUp()) {
      moves++;
    } else if (chekUp()) {
      cheks++;
    }
    setTimeout(()=> {
      if (moves > 0) {
        if (chekUp()) {
          slideUp();
          setTimeout(()=> {
            canimove = true; add();
          }, delay);
        } else {
          add();
          canimove = true;
        }
      } else if (cheks > 0) {
        slideUp();
        setTimeout(()=> {
          canimove = true;
          add();
        }, delay);
      } else {
        canimove = true;
      }
  },
    delay);
}
function moveRight() {
  canimove = false;
  let moves = 0;
  let cheks = 0;
  if (slideRight()) {
    moves++;
  } else if (chekRight()) {
    cheks++;
  }
  setTimeout(()=> {
    if (moves > 0) {
      if (chekRight()) {
        slideRight();
        setTimeout(()=> {
          canimove = true;
          add();
        }, delay);
      } else {
        add();
        canimove = true;
      }
    } else if (cheks > 0) {
      slideRight();
      setTimeout(()=> {
        canimove = true;
        add();
      }, delay);
    } else {
      canimove = true;
    }
  },
    delay);
}
function moveDown() {
  canimove = false;
  let moves = 0;
  let cheks = 0;
  if (slideDown()) {
    moves++;
  } else if (chekDown()) {
    cheks++;
  }
  setTimeout(()=> {
    if (moves > 0) {
      if (chekDown()) {
        slideDown();
        setTimeout(()=> {
          canimove = true; add();
        }, delay);
      } else {
        add();
        canimove = true;
      }
    } else if (cheks > 0) {
      slideDown();
      setTimeout(()=> {
        canimove = true; add();
      }, delay);
    } else {
      canimove = true;
    }
  },
    delay);
}
function moveLeft() {
  canimove = false;
  let moves = 0;
  let cheks = 0;
  if (slideLeft()) {
    moves++;
  } else if (chekLeft()) {
    cheks++;
  }
  setTimeout(()=> {
    if (moves > 0) {
      if (chekLeft()) {
        slideLeft();
        setTimeout(()=> {
          canimove = true; add();
        }, delay);
      } else {
        add();
        canimove = true;
      }
    } else if (cheks > 0) {
      slideLeft();
      setTimeout(()=> {
        canimove = true; add();
      }, delay);
    } else {
      canimove = true;
    }
  },
    delay);
}

function slideUp(sss) {
  let moves = 0;
  for (let i = 0; i < grid[0].length; i++) {
    for (let j = 1; j < grid.length; j++) {
      if (grid[j][i].value != 0) {
        let n = j-1;
        while (n >= 0) {
          if (grid[n][i].value != 0) {
            break;
          }
          if(sss==undefined){
            let temp = {
              value: grid[n][i].value,
              x: grid[n][i].x,
              y: grid[n][i].y,
            }
            grid[n][i].value = grid[n+1][i].value;
            grid[n][i].x = i*grid[n][i].w;
            grid[n][i].y = j*grid[n][i].w;
            grid[n][i].to_x = grid[n][i].w*i;
            grid[n][i].to_y = grid[n][i].w*n;
  
            grid[n+1][i].value = temp.value;
            grid[n+1][i].x = i*grid[n+1][i].w;
            grid[n+1][i].y = (n+1)*grid[n+1][i].w;
          }
          n--;
          moves++;
        }
      }
    }
  }
  return moves > 0;
}
function slideRight(sss) {
  let moves = 0;
  for (let j = 0; j < grid.length; j++) {
    for (let i = grid[j].length-2; i >= 0; i--) {
      if (grid[j][i].value != 0) {
        let n = i+1;
        while (n < grid[j].length) {
          if (grid[j][n].value != 0) {
            break;
          }
          if(sss==undefined){
            let temp = {
              value: grid[j][n].value,
              x: grid[j][n].x,
              y: grid[j][n].y,
            };
            grid[j][n].value = grid[j][n-1].value;
            grid[j][n].x = i*grid[j][n].w;
            grid[j][n].y = j*grid[j][n].w;
            grid[j][n].to_x = grid[j][n].w*n;
            grid[j][n].to_y = grid[j][n].w*j;
  
            grid[j][n-1].value = temp.value;
            grid[j][n-1].x = (n-1)*grid[j][n-1].w;
            grid[j][n-1].y = j*grid[j][n-1].w;
          }
          n++;
          moves++;
        }
      }
    }
  }
  return moves > 0;
}
function slideDown(sss) {
  let moves = 0;
  for (let i = 0; i < grid[0].length; i++) {
    for (let j = grid.length-2; j >= 0; j--) {
      if (grid[j][i].value != 0) {
        let n = j+1;
        while (n < grid.length) {
          if (grid[n][i].value != 0) {
            break;
          }
          if(sss==undefined){
            let temp = {
              value: grid[n][i].value,
              x: grid[n][i].x,
              y: grid[n][i].y,
            };
            grid[n][i].value = grid[n-1][i].value;
            grid[n][i].x = i*grid[n][i].w;
            grid[n][i].y = j*grid[n][i].w;
            grid[n][i].to_x = grid[n][i].w*i;
            grid[n][i].to_y = grid[n][i].w*n;
  
            grid[n-1][i].value = temp.value;
            grid[n-1][i].x = i*grid[n-1][i].w;
            grid[n-1][i].y = (n-1)*grid[n-1][i].w;
          }
          n++;
          moves++;
        }
      }
    }
  }
  return moves > 0;
}
function slideLeft(sss) {
  let moves = 0;
  for (let j = 0; j < grid.length; j++) {
    for (let i = 1; i < grid[j].length; i++) {
      if (grid[j][i].value != 0) {
        let n = i-1;
        while (n >= 0) {
          if (grid[j][n].value != 0) {
            break;
          }
          if(sss==undefined){
            let temp = {
              value: grid[j][n].value,
              x: grid[j][n].x,
              y: grid[j][n].y,
            }
            grid[j][n].value = grid[j][n+1].value;
            grid[j][n].x = i*grid[j][n].w;
            grid[j][n].y = j*grid[j][n].w;
            grid[j][n].to_x = grid[j][n].w*n;
            grid[j][n].to_y = grid[j][n].w*j;
  
            grid[j][n+1].value = temp.value;
            grid[j][n+1].x = (n+1)*grid[j][n+1].w;
            grid[j][n+1].y = j*grid[j][n+1].w;
          }
          n--;
          moves++;
        }
      }
    }
  }
  return moves > 0;
}

function chekUp(sss) {
  let n = 0;
  for (let i = 0; i < grid[0].length; i++) {
    for (let j = 0; j < grid.length-1; j++) {
      if (grid[j][i].value != 0 && grid[j][i].value == grid[j+1][i].value) {
        if(sss==undefined){
          grid[j][i].value *= 2;
          grid[j+1][i].value = 0;
          Game.empty_sells++;
          grid[j][i].scale=1.3;
          grid[j][i].to_scale=1;
          inc_score(grid[j][i].value);
          if(grid[j][i].value==2048){
            Game.state=Game.states.WIN;
          }
        }
        n++;
      }
    }
  }
  return n > 0;
}
function chekRight(sss) {
  let n = 0;
  for (let j = 0; j < grid.length; j++) {
    for (let i = grid[j].length-1; i > 0; i--) {
      if (grid[j][i].value != 0 && grid[j][i].value == grid[j][i-1].value) {
        if(sss==undefined){
          grid[j][i].value *= 2;
          grid[j][i-1].value = 0;
          Game.empty_sells++;
          grid[j][i].scale=1.3;
          grid[j][i].to_scale=1;
          inc_score(grid[j][i].value);
          if(grid[j][i].value==2048){
            Game.state=Game.states.WIN;
          }
        }
        n++;
      }
    }
  }
  return n > 0;
}
function chekDown(sss) {
  let n = 0;
  for (let i = 0; i < grid[0].length; i++) {
    for (let j = grid.length-1; j > 0; j--) {
      if (grid[j][i].value != 0 && grid[j][i].value == grid[j-1][i].value) {
        if(sss==undefined){
          grid[j][i].value *= 2;
          grid[j-1][i].value = 0;
          Game.empty_sells++;
          grid[j][i].scale=1.3;
          grid[j][i].to_scale=1;
          inc_score(grid[j][i].value);
          if(grid[j][i].value==2048){
            Game.state=Game.states.WIN;
          }
        }
        n++;
      }
    }
  }
  return n > 0;
}
function chekLeft(sss) {
  let n = 0;
  for (let j = 0; j < grid.length; j++) {
    for (let i = 0; i < grid[j].length-1; i++) {
      if (grid[j][i].value != 0 && grid[j][i].value == grid[j][i+1].value) {
        if(sss==undefined){
          grid[j][i].value *= 2;
          grid[j][i+1].value = 0;
          Game.empty_sells++;
          grid[j][i].scale=1.3;
          grid[j][i].to_scale=1;
          inc_score(grid[j][i].value);
          if(grid[j][i].value==2048){
            Game.state=Game.states.WIN;
          }
        }
        n++;
      }
    }
  }
  return n > 0;
}

function inc_score(v){
  Game.score+=v;
  document.getElementById("score_v").innerHTML=""+Game.score;
  if(Game.score>Game.hscore){
    Game.hscore=Game.score;
  document.getElementById("hscore_v").innerHTML=""+Game.hscore;
  }
}

function squar(x, y, w, value) {
  this.x = x;
  this.y = y;
  this.w = w;
  this.to_x = this.x;
  this.to_y = this.y;
  this.dx = 0; this.dy = 0;
  this.scale=1;
  this.to_scale=1;
  this.ds=0;
  this.value = value;
  this.margin = 6;
  this.bg = {
    c_2: "hsl(120,90%,70%)",
    c_4: "hsl(20,100%,75%)",
    c_8: "hsl(180,100%,60%)",
    c_16: "hsl(200,100%,80%)",
    c_32: "hsl(250,100%,80%)",
    c_64: "hsl(330,100%,90%)",
    c_128: "hsl(160,100%,85%)",
    c_256: "hsl(120,100%,85%)",
    c_512: "hsl(80,70%,60%)",
    c_1024: "hsl(350,80%,75%)",
    c_2048: "hsl(60,100%,80%)"
  };
  this.draw = function() {
    if (this.value === 0) {
      return false;
    }
    ctx.save();
    let tx=this.x+this.w/2;
    let ty=this.y+this.w/2;
    ctx.translate(tx,ty)
    ctx.scale(this.scale,this.scale);
    ctx.translate(-tx,-ty);
    ctx.beginPath();
    ctx.fillStyle = this.bg['c_'+this.value];
    drawRect(ctx,this.x+this.margin, this.y+this.margin, this.w-2*this.margin, 8);
    ctx.fill();
    ctx.beginPath()
    ctx.fillStyle = "#454545";
    ctx.lineWidth = "2";
    ctx.textAlign = "center";
    let fsize=(this.w*.5)*(1-(""+this.value).length/10);
    ctx.font = "bold "+fsize+"px sans serif";
    ctx.fillText(""+this.value, this.x+this.w/2, this.y+this.w/2+fsize/2.8);
    ctx.restore();
  }
  this.animate = function() {
    if (this.value == 0) {
      return false;
    }
    let n = DUR/DT;
    n = (n >= 1 ? n: 1);
    if(this.ds==0){
      this.ds=(this.to_scale-this.scale)/n;
    }
    this.scale+=this.ds;
    if(this.ds<0 && this.scale<this.to_scale || this.ds>0 && this.scale>this.to_scale){
      this.scale=this.to_scale;
      this.ds=0;
    }
    if (this.dx == 0 && this.dy == 0) {
      this.dx = (this.to_x-this.x)/n;
      this.dy = (this.to_y-this.y)/n;
    }
    this.x += this.dx;
    if (this.x > this.to_x && this.dx > 0 || this.x < this.to_x && this.dx < 0) {
      this.x = this.to_x;
      this.dx = 0;
    }
    this.y += this.dy;
    if (this.y > this.to_y && this.dy > 0 || this.y < this.to_y && this.dy < 0) {
      this.y = this.to_y;
      this.dy = 0;
    }
    return this.dx != 0 || this.dy != 0;
  }
}
function clearCnv() {
  ctx.clearRect(0, 0, cnv.offsetWidth, cnv.offsetHeight);
}
function draw_bg() {
  ctx_bg.fillStyle = "hsl(35,25%,60%)";
  ctx_bg.beginPath();
  drawRect(ctx_bg,0, 0, width, 8);
  ctx_bg.fill();
  ctx_bg.fillStyle = "hsl(35,45%,80%)";
  let w = width/rows;
  let margin = 6;
  for (let j = 0; j < rows; j++) {
    for (let i = 0; i < cols; i++) {
      ctx_bg.beginPath();
      drawRect(ctx_bg,i*w+margin, j*w+margin, w-2*margin, 8);
      ctx_bg.fill();
    }
  }
}

function drawGameOver(){
  let fsize=width/cols*0.45;
  ctx.fillStyle="rgba(0,0,0,.8)";
  drawRect(ctx,0,0,width,8);
  ctx.fill();
  ctx.fillStyle="#fff";
  ctx.font=fsize+"px Open Sans";
  ctx.textAlign="center";
  ctx.fillText("Game Over",width/2,height/2);
  
  ctx.fillStyle="#aaa";
  ctx.font=(fsize/2)+"px Open Sans";
  ctx.fillText("Press To Restart",width/2,height/2+fsize);
}
function drawYouWin(){
  let fsize=width/cols*0.45;
  ctx.fillStyle="rgba(0,0,0,.8)";
  drawRect(ctx,0,0,width,8);
  ctx.fill();
  ctx.fillStyle="#fff";
  ctx.font=fsize+"px Open Sans";
  ctx.textAlign="center";
  ctx.fillText("You Win!",width/2,height/2);
  
  ctx.fillStyle="#aaa";
  ctx.font=(fsize/2)+"px Open Sans";
  ctx.fillText("Press To Restart",width/2,height/2+fsize);
}
function drawStart(){
  let fsize=width/cols*0.3;
  clearCnv();
  if(Game.score>0){
    inc_score(-Game.score);
  }
  ctx.fillStyle="rgba(0,0,0,.8)";
  drawRect(ctx,0,0,width,8);
  ctx.fill();
  ctx.fillStyle="#fff";
  ctx.font=fsize+"px Open Sans";
  ctx.textAlign="center";
  ctx.fillText("Press To Start!",width/2,height/2);
}
function drawPause(){
  let fsize=width/cols*0.3;
  ctx.fillStyle="rgba(0,0,0,.7)";
  drawRect(ctx,0,0,width,8);
  ctx.fill();
  ctx.fillStyle="#fff";
  ctx.font=fsize+"px Open Sans";
  ctx.textAlign="center";
  ctx.fillText("Press To Continue",width/2,height/2);
}

function drawRect(ctx_, x, y, w, r) {
  if (r > w/2) {
    r = w/2
  }
  ctx_.beginPath();
  // top left corner
  ctx_.arc(x+r,y+r,r,Math.PI,-Math.PI/2);
  // top right corner
  ctx_.arc(x+w-r,y+r,r,-Math.PI/2,0);
  // bottom right corner
  ctx_.arc(x+w-r,y+w-r,r,0,Math.PI/2);
  // bottom left corner
  ctx_.arc(x+r,y+w-r,r,Math.PI/2,Math.PI);
  ctx_.closePath();
}


}