let objects = []






class Fo {
    constructor({pos=[5,5], dir=[0,0], size=1, color='grey', id}){
        this.pos = pos;
        this.dir = dir;
        this.size = size;
        this.color = color;
        this.id = id;
    }
    gravity = (b,g,d) => {
        const dx = b.pos[0]-this.pos[0];
        const dy = b.pos[1]-this.pos[1];
        const distanse = Math.sqrt(dx*dx+dy*dy);
        if(distanse == 0 || distanse > d) return this;
        const F = g/(distanse*distanse);
        this.dir = [this.dir[0]+(F*dx), this.dir[1]+(F*dy)]
        return this;
    };
    friction = ( fr) => {
        const speed2 = (this.dir[0]*this.dir[0]+this.dir[1]*this.dir[1]) / 1000
        let coff = 1/(fr*speed2 + 1);
        this.dir = [this.dir[0]*coff, this.dir[1]*coff]
        return this;
    }
}

const rules = {
    'white.white': (a,b) => a.gravity(b, 4, 160).friction(0.1),
    'green.white': (a,b) => a.gravity(b, 5, 120).gravity(b, -8, 60).friction(0.01),
    'green.green': (a,b) => a.gravity(b, -4, 20),
    'white.yellow': (a,b) => a.gravity(b, 1, 190),
    'yellow.green': (a,b) => a.gravity(b, -3, 180).friction(0.1),
    'red.white': (a,b) => a.gravity(b, 3, 80),
    'red.red': (a,b) => a.gravity(b, 0.5, 160).friction(0.01),
    'red.green': (a,b) => a.gravity(b, -1, 5),
}

create(100, 'red', 1);
create(200, 'green', 1);
create(60, 'yellow', 1);
create(100, 'white', 1)












const ctx = document.getElementById('life').getContext("2d");
function drow({pos, size, color}){
    ctx.fillStyle = color;
    ctx.strokeStyle	= color;
    ctx.beginPath();
    ctx.arc(pos[0], pos[1], size, 0, 2 * Math.PI);
    ctx.fill()
    ctx.stroke();
}

function erace({pos, size}){
    size = size+2
    ctx.clearRect(pos[0]-size,pos[1]-size,size*2,size*2);
}
function create(count=1, color='red', size=2){
    objects.push(...new Array(count).fill('a').map((_,i) => new Fo({pos: [Math.random()*900,Math.random()*900], dir: [0,0], size, color, id: Date.now()+i})));
}
function update(a,b){
    if(a.id !== b.id && !!rules[`${a.color}.${b.color}`]) 
        return rules[`${a.color}.${b.color}`](a,b);
    return a
}

let interval;
if(objects.length){
    console.log(objects);
    interval = setInterval(function(){
        objects.forEach(o => erace(o));
        objects = objects.map(o => {
            objects.forEach(another => o = update(o, another));
            o.pos = [o.pos[0]+o.dir[0], o.pos[1]+o.dir[1]];
            o.dir = [o.pos[0] < 0 || o.pos[0]>900? -o.dir[0]: o.dir[0], o.pos[1] < 0 || o.pos[1]>900? -o.dir[1]: o.dir[1]]
            return o
        });
        objects.forEach(o => drow(o));
    }, 30)
} else clearInterval(interval);

