class Block {
  constructor(x, y, block_type) {
    this.x = x;
    this.y = y;
    this.block_type = block_type
    switch(block_type) {
      case "F": this.color = "gray";      break; // floor
      case "W": this.color = "gray";      break; // wall
      case "E": this.color = "black";     break; // empty
      case "T": this.color = "pink";      break; // T mino
      case "Z": this.color = "green";     break; // Z mino
      case "S": this.color = "red";       break; // S mino
      case "L": this.color = "orange";    break; // L mino
      case "J": this.color = "blue";      break; // J mino
      case "O": this.color = "yellow";    break; // O mino
      case "I": this.color = "lightblue"; break; // I mino
    }
  }

  draw() {
    push();
    let s = 25;
    fill(this.color);
    rect(s*this.x, s*this.y, s, s);
    pop();
  }
}

class Mino {
  constructor(x, y, rot, shape) {
    this.x = x;
    this.y = y;
    this.rot = rot;
    this.shape = shape;
  }

  calcBlocks() {
    let blocks = []
    let s = this.shape
    switch(s) {
      case "T": blocks = [new Block(-1,  0, s), new Block( 0,  0, s), new Block( 0, -1, s), new Block(1,  0, s)]; break; //T
      case "Z": blocks = [new Block(-1, -1, s), new Block( 0, -1, s), new Block( 0,  0, s), new Block(1,  0, s)]; break; //Z
      case "S": blocks = [new Block(-1,  0, s), new Block( 0,  0, s), new Block( 0, -1, s), new Block(1, -1, s)]; break; //S
      case "L": blocks = [new Block(-1, -2, s), new Block(-1, -1, s), new Block(-1,  0, s), new Block(0,  0, s)]; break; //L
      case "J": blocks = [new Block( 0, -2, s), new Block( 0, -1, s), new Block(-1,  0, s), new Block(0,  0, s)]; break; //J
      case "O": blocks = [new Block(-1, -1, s), new Block(-1,  0, s), new Block( 0,  0, s), new Block(0, -1, s)]; break; //O
      case "I": blocks = [new Block(-2,  0, s), new Block(-1,  0, s), new Block( 0,  0, s), new Block(1,  0, s)]; break; //I
    }

    let rot_mod = (40000000 + this.rot) % 4
    for(let r=0; r<rot_mod; r++) {
      blocks = blocks.map(b => new Block(b.y, -b.x, s));
    }
    blocks.forEach(b => (b.x+=this.x, b.y+=this.y));
    return blocks
  }

  draw() {
    let blocks = this.calcBlocks();
    for(let b of blocks) {
      b.draw()
    }
  }
  copy() {
    return new Mino(this.x, this.y, this.rot, this.shape);
  }
}

class Field {
  constructor() {
    this.tiles = [
      ["W", "E", "E", "E", "E", "E", "E", "E", "E", "E", "E", "W"],
      ["W", "E", "E", "E", "E", "E", "E", "E", "E", "E", "E", "W"],
      ["W", "E", "E", "E", "E", "E", "E", "E", "E", "E", "E", "W"],
      ["W", "E", "E", "E", "E", "E", "E", "E", "E", "E", "E", "W"],
      ["W", "E", "E", "E", "E", "E", "E", "E", "E", "E", "E", "W"],
      ["W", "E", "E", "E", "E", "E", "E", "E", "E", "E", "E", "W"],
      ["W", "E", "E", "E", "E", "E", "E", "E", "E", "E", "E", "W"],
      ["W", "E", "E", "E", "E", "E", "E", "E", "E", "E", "E", "W"],
      ["W", "E", "E", "E", "E", "E", "E", "E", "E", "E", "E", "W"],
      ["W", "E", "E", "E", "E", "E", "E", "E", "E", "E", "E", "W"],
      ["W", "E", "E", "E", "E", "E", "E", "E", "E", "E", "E", "W"],
      ["W", "E", "E", "E", "E", "E", "E", "E", "E", "E", "E", "W"],
      ["W", "E", "E", "E", "E", "E", "E", "E", "E", "E", "E", "W"],
      ["W", "E", "E", "E", "E", "E", "E", "E", "E", "E", "E", "W"],
      ["W", "E", "E", "E", "E", "E", "E", "E", "E", "E", "E", "W"],
      ["W", "E", "E", "E", "E", "E", "E", "E", "E", "E", "E", "W"],
      ["W", "E", "E", "E", "E", "E", "E", "E", "E", "E", "E", "W"],
      ["W", "E", "E", "E", "E", "E", "E", "E", "E", "E", "E", "W"],
      ["W", "E", "E", "E", "E", "E", "E", "E", "E", "E", "E", "W"],
      ["W", "E", "E", "E", "E", "E", "E", "E", "E", "E", "E", "W"],
      ["F", "F", "F", "F", "F", "F", "F", "F", "F", "F", "F", "F"]
    ];
  }

  tileAt(x, y) {
    return this.tiles[y][x];
  }

  putBlock(x, y, block_type) {
    this.tiles[y][x] = block_type;
  }

  findLineFilled() {
    for(let y=0; y<20; y++) {
      // ※every関数について: https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/Array/every
      let isFilled = this.tiles[y].every(t => t!=="E");
      if (isFilled) return y;
    }
    return -1;
  }

  cutLine(y) {
    this.tiles.splice(y, 1);
    this.tiles.unshift(["W", "E", "E", "E", "E", "E", "E", "E", "E", "E", "E", "W"]);
  }

  draw() {
    this.tiles.forEach(function(row, y){
      row.forEach(function(block_type, x){
        new Block(x, y, block_type).draw();;
      })
    });
  }
}

class Game {
  constructor() {
    let block_type = ["T", "Z", "S", "L", "J", "O", "I"][floor(random(0, 7))]
    this.mino = new Mino(5, 2, 0 , block_type);
    this.minoVx = 0;
    this.minoVrot = 0;
    this.field = new Field();
    this.fc = 0;
  }

  static isMinoMovable(mino, field) {
    let blocks = mino.calcBlocks();
    return blocks.every(b => field.tileAt(b.x, b.y) === "E");
  }

  proc() {
    if (this.fc % 20 === 0) {
      let futureMino = this.mino.copy();
      futureMino.y += 1;
      if (Game.isMinoMovable(futureMino, this.field)) {
        this.mino.y ++;
      }else{
        for(let b of this.mino.calcBlocks()) {
          let block_type = ["T", "Z", "S", "L", "J", "O", "I"][floor(random(0, 7))]
          this.field.putBlock(b.x, b.y, b.block_type);
          this.mino = new Mino(5, 2, 0 , block_type);
        }
      }

      // 消去
      let line;
      while((line = this.field.findLineFilled()) !== -1) {
        this.field.cutLine(line);
      }
      // this.minoDrop = false;
    }

    if (this.minoVx !== 0) {
      let futureMino = this.mino.copy();
      futureMino.x += this.minoVx;
      if (Game.isMinoMovable(futureMino, this.field)) {
        this.mino.x += this.minoVx;
      }
      this.minoVx = 0;
    }

    if (this.minoVrot !== 0) {
      let futureMino = this.mino.copy();
      futureMino.rot += this.minoVrot;
      if (Game.isMinoMovable(futureMino, this.field)) {
        this.mino.rot += this.minoVrot;
      }
      this.minoVrot = 0;
    }

    background(64);
    this.field.draw();
    this.mino.draw();
    this.fc++;
  }
}

let game;

function keyPressed() {
  if (keyCode === 65) game.minoVx -= 1;
  if (keyCode === 68) game.minoVx += 1;
  if (keyCode === 188) game.minoVrot += 1;
  if (keyCode === 190) game.minoVrot -= 1;
}

function setup() {
  createCanvas(300, 525);
  game = new Game();
}

function draw() {
  game.proc();
}
