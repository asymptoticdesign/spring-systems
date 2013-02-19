//global variables
var cell_width = 40;
var cell_height = 40;
var width = 800;
var height = 600;
var numParticles_X = width / cell_width;
var numParticles_Y = height / cell_height;
var SPRING_STRENGTH = 1.0;
var SPRING_DAMPING = 3.0;
var SPRING_LENGTH = 0.1;
var ATTRACT_STRENGTH = -100000;
var grey = 68;
var numParticles;
var numSprings;


//object managers
var pSys;
var particleGrid = [];
var force_particles = [];

function setup() {
    /*Setup -- run once to setup the canvas*/
    //stuff that's independent of geometry
    canvas = document.getElementById("radiolaria");
    ctx = canvas.getContext("2d");
    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(0,0,width,height);
    //initialize geometry
    initializeGrid();
    //add a force
    var p = pSys.makeParticle(1, width/2, height/2, 0);
    p.makeFixed();
    force_particles.push(p);
    for(i = 0; i < numParticles - 1; i++) {
	pSys.makeAttraction(p, pSys.particles[i], -1 * ATTRACT_STRENGTH, 5.0);
    }
    //begin simulation
    interval = setInterval(draw,1);

}
    
function draw() {
    //runs every frame
    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(0,0,width,height);
    pSys.tick(0.2);
    console.log("Tick");
    render();
}

function initializeGrid() {
    //create new particle system
    pSys = new ParticleSystem();
    //create grid of particles
    var particleRow = []
    var pos_x = 0;
    var pos_y = 0;
    for(j = 0; j < numParticles_Y; j++) {
	var particleRow = [];
	for(i = 0; i < numParticles_X; i++) {
	    var p = pSys.makeParticle(1, pos_x, pos_y, 0);
	    if (j == 0 || j == numParticles_Y - 1 || i == 0 || i == numParticles_X -1) {
		p.makeFixed();
	    }
	    particleRow[particleRow.length] = p;
	    pos_x += cell_width;
	}	    
	particleGrid[particleGrid.length] = particleRow;
	pos_y += cell_height;
	pos_x = 0;
    }
    numParticles = pSys.particles.length;
    //now create grid of springs connecting them
    for(i = 0; i < numParticles_X; i++) {
	for(j = 0; j < numParticles_Y; j++) {
	    if (i < numParticles_X - 1 && j < numParticles_Y - 1) {
		pSys.makeSpring(particleGrid[j][i], particleGrid[j][i+1], SPRING_STRENGTH, SPRING_DAMPING, SPRING_LENGTH);
		pSys.makeSpring(particleGrid[j][i], particleGrid[j+1][i], SPRING_STRENGTH, SPRING_DAMPING, SPRING_LENGTH);
	    }
	}
    }
    numSprings = pSys.springs.length;
}

//function initializeLattice() {
//}

//function intiializeRad

function render() {
//    ctx.strokeStyle="#000000";
//    for(i = 0; i < pSys.particles.length - 1; i++) {
//	p = pSys.particles[i];
//	ctx.beginPath();
//	ctx.arc(p.position.x, p.position.y, 5, 0, 2*Math.PI, true);
//	ctx.stroke();
//    }
    for(i = 0; i < pSys.springs.length - 1; i++) {
	p = pSys.springs[i].a;
	q = pSys.springs[i].b;
	ctx.beginPath();
	ctx.moveTo(p.position.x, p.position.y);
	ctx.lineTo(q.position.x, q.position.y);
	ctx.stroke();
    }
}