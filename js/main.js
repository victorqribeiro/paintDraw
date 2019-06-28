const canvas = document.getElementById("canvas");
const buffer = document.getElementById("buffer");
canvas.width = buffer.width = w = innerWidth;
canvas.height = buffer.height = h = innerHeight;
const c = canvas.getContext("2d");
const b = buffer.getContext("2d");
let mouse = false;
const path = [];

const rectangle = {
  path: [],

  brush: 1,

  action: function(x, y) {
    this.path.push({
      x: x,
      y: y
    });
    b.clearRect(0, 0, w, h);
    b.strokeRect(this.path[0].x, this.path[0].y,
      (this.path[this.path.length - 1].x - this.path[0].x),
      (this.path[this.path.length - 1].y - this.path[0].y));
  },

  endAction: function() {
    b.clearRect(0, 0, w, h);
    c.strokeRect(this.path[0].x, this.path[0].y,
      (this.path[this.path.length - 1].x - this.path[0].x),
      (this.path[this.path.length - 1].y - this.path[0].y));
    this.path = [];
  }
};

const circle = {
  path: [],

  brush: 1,

  action: function(x, y) {
    this.path.push({
      x: x,
      y: y
    });
    ini = this.path[0];
    dx = ini.x - this.path[this.path.length - 1].x;
    dy = ini.y - this.path[this.path.length - 1].y;
    rad = Math.sqrt(dx * dx + dy * dy);
    b.clearRect(0, 0, w, h);
    b.beginPath();
    b.arc(ini.x, ini.y, rad, 0, 2 * Math.PI);
    b.stroke();
  },

  endAction: function() {
    ini = this.path[0];
    dx = ini.x - this.path[this.path.length - 1].x;
    dy = ini.y - this.path[this.path.length - 1].y;
    rad = Math.sqrt(dx * dx + dy * dy);
    b.clearRect(0, 0, w, h);
    c.beginPath();
    c.arc(ini.x, ini.y, rad, 0, 2 * Math.PI);
    c.stroke();
    this.path = [];
  }
};

const line = {
  path: [],

  brush: 1,

  action: function(x, y) {
    this.path.push({
      x: x,
      y: y
    });
    b.clearRect(0, 0, w, h);
    b.beginPath();
    b.moveTo(this.path[0].x, this.path[0].y);
    b.lineTo(this.path[this.path.length - 1].x, this.path[this.path.length - 1].y);
    b.stroke();
  },

  endAction: function() {
    c.beginPath();
    c.moveTo(this.path[0].x, this.path[0].y);
    c.lineTo(this.path[this.path.length - 1].x, this.path[this.path.length - 1].y);
    b.clearRect(0, 0, w, h);
    c.stroke();
    this.path = [];
  }
};

const pencil = {
  path: [],

  brush: 1,

  action: function(x, y) {
    this.path.push({
      x: x,
      y: y
    });
    
    c.lineWidth = this.brush;
    
    if (this.path.length > 1) {
      c.lineTo(this.path[this.path.length - 1].x, this.path[this.path.length - 1].y);
      c.stroke();
      this.path.shift();
    }else{
      c.beginPath();
      c.moveTo(this.path[0].x, this.path[0].y);    
    }
  },

  endAction: function() {
    if (this.path.length < 2) {
      c.fillRect(x, y, this.brush, this.brush);
    }
    this.path = [];
  }
};

const eraser = {
  brush: 10,

  action: function(x, y) {
    c.clearRect(x - (this.brush / 2), y - (this.brush / 2),
      this.brush, this.brush);
  },
  endAction: function() {
    c.clearRect(x - (this.brush / 2), y - (this.brush / 2),
      this.brush, this.brush);
  }
};

t = pencil;


document.body.addEventListener("keypress", function(evt) {
  b.clearRect(0, 0, w, h);
  switch (evt.keyCode) {
    case 99:
      t = circle;
      break;
    case 101:
      t = eraser;
      break;
    case 108:
      t = line;
      break;
    case 112:
      t = pencil;
      break;
    case 114:
      t = rectangle;
      break;
  }
});

canvas.addEventListener("mousedown", function(evt) {
  click = evt.which || evt.button;
  if (click === 1) {
    mouse = true;
  }
});

canvas.addEventListener("mouseup", function() {
  mouse = false;
  t.endAction();
});

canvas.addEventListener("mousemove", function(evt) {
  x = evt.clientX;
  y = evt.clientY;
  if (t.brush) {
    b.clearRect(0, 0, w, h);
    b.strokeRect(x - (t.brush / 2), y - (t.brush / 2), t.brush, t.brush);
  }
  if (mouse) {
    t.action(x, y);
  }
});

