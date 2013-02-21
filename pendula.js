//global variables
var width = 1200;
var height = 800;
var SPRING_STRENGTH = 100.0;
var SPRING_DAMPING = 10.0;
var SPRING_LENGTH = 100.0;
var pSys;
var particleList = [];

function setup() {
    /*Setup -- run once to setup the canvas*/
    //stuff that's independent of geometry
    canvas = document.getElementById("pendula");
    ctx = canvas.getContext("2d");
    ctx.fillStyle = "#000000";
    ctx.fillRect(0,0,width,height);
    //initialize geometry
    initializePendulum();
    //begin simulation
    interval = setInterval(draw,20);
}
    
function draw() {
    //runs every frame
    ctx.fillStyle = "#000000";
    ctx.fillRect(0,0,width,height);
    pSys.tick(0.1);
    render();
}

function initializePendulum() {
    //create new particle system
    pSys = new ParticleSystem();
    pSys.setGravity(9.8);
    //fixed particle
    var p = pSys.makeParticle(1.0, width/2, height/2, 0);
    p.fixed = true;
    //moving particle
    var q1 = pSys.makeParticle(1.0, width/2 + SPRING_LENGTH, height/2 - 100, 0);
    var s1 = pSys.makeSpring(p, q1, SPRING_STRENGTH, SPRING_DAMPING, SPRING_LENGTH);
    //again
    var q2 = pSys.makeParticle(1.0, width/2 + 2*SPRING_LENGTH, height/2 - 100, 0);
    var s2 = pSys.makeSpring(q1, q2, SPRING_STRENGTH, SPRING_DAMPING, SPRING_LENGTH);
    //and again
    var q3 = pSys.makeParticle(1.0, width/2 + 3*SPRING_LENGTH, height/2 - 100, 0);
    var s3 = pSys.makeSpring(q2, q3, SPRING_STRENGTH, SPRING_DAMPING, SPRING_LENGTH);
}

function render() {
    ctx.strokeStyle="#FFFFFF";
    ctx.fillStyle="#FFFFFF";
    for(i = 0; i < pSys.particles.length; i++) {
	var p = pSys.particles[i];
	ctx.beginPath();
	ctx.arc(p.position.x, p.position.y, 20, 0, 2*Math.PI, true);
	ctx.stroke();
	ctx.fill();
    }
    for(i = 0; i < pSys.springs.length; i++) {
	var p = pSys.springs[i].a;
	var q = pSys.springs[i].b;
	ctx.beginPath();
	ctx.moveTo(p.position.x, p.position.y);
	ctx.lineTo(q.position.x, q.position.y);
	ctx.stroke();
    }
}

function clamp(value,min,max) {
    return Math.max(min, Math.min(value,max));
}