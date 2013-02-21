//global variables
var cell_width = 40;
var cell_height = 40;
var width = 1200;
var height = 800;
var numParticles_Theta = 100;
var numParticles_R = 30;
var dR = 10;
var SPRING_STRENGTH = 1.0;
var SPRING_DAMPING = 0.01;
var SPRING_LENGTH = 5;
var ATTRACT_STRENGTH = 10000;
var grey = 68;
var numParticles;
var numSprings;

//object managers
var pSys;
var particleGrid = [];
var force_particles = [];
var radial_springs = [];

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
	pSys.makeSpiral(p, pSys.particles[i], -1 * ATTRACT_STRENGTH, 50.0);
    }
    //begin simulation
    interval = setInterval(draw,1);

}
    
function draw() {
    //runs every frame
    ctx.fillStyle = "#000000";
    ctx.fillRect(0,0,width,height);
    pSys.tick(0.1);
    render();
}

function initializeGrid() {
    //create new particle system
    pSys = new ParticleSystem();
    //create grid of particles
    var particleRow = []
    var r = 100;
    var theta = 0;
    for(j = 0; j < numParticles_R; j++) {
	var particleRow = [];
	for(i = 0; i < numParticles_Theta; i++) {
	    var p = pSys.makeParticle(1, width/2 + r*Math.sin(theta), height/2 + r*Math.cos(theta), 0);
	    if (j == 0 || j == numParticles_R - 1) {
		p.makeFixed();
	    }
	    particleRow[particleRow.length] = p;
	    theta += 2*Math.PI / numParticles_Theta;
	}	    
	particleGrid[particleGrid.length] = particleRow;
	r += dR;
	theta = 0;
    }
    numParticles = pSys.particles.length;
    for(i = 0; i < numParticles_R - 1; i++) {
	for(j = 0; j < numParticles_Theta; j++) {
	    //azimuthal springs
	    pSys.makeSpring(particleGrid[i][j], particleGrid[i][(j+1) % numParticles_Theta], Math.random(0.1,2.0)*SPRING_STRENGTH, SPRING_DAMPING, Math.random(0.1,10.0)*SPRING_LENGTH);
	    //radial springs
	    var p = pSys.makeSpring(particleGrid[i][j], particleGrid[(i+1)][j], SPRING_STRENGTH, SPRING_DAMPING, (1 - j/numParticles_Theta)*SPRING_LENGTH);
	    radial_springs.push(p);
	}
    }
    numSprings = pSys.springs.length;
}

//function initializeLattice() {
//}

//function intiializeRad

function render() {
    ctx.strokeStyle="#AFAFAF";
/*    for(i = 0; i < pSys.particles.length - 1; i++) {
	p = pSys.particles[i];
	ctx.beginPath();
	ctx.arc(p.position.x, p.position.y, 5, 0, 2*Math.PI, true);
	ctx.stroke();
    }
*/
    for(i = 0; i < radial_springs.length; i++) {
	p = radial_springs[i].a;
	q = radial_springs[i].b;
	ctx.beginPath();
	ctx.moveTo(p.position.x, p.position.y);
	ctx.lineTo(q.position.x, q.position.y);
	ctx.stroke();
    }
}

function clamp(value,min,max) {
    return Math.max(min, Math.min(value,max));
}