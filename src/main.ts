import './style.css'
import  PhysicsParticles from './Physics/PhysicsParticle';
import  SC_Director from './SpaceColonization/SC_Director_V2';

let urlParams = new URLSearchParams(window.location.search);
let seed = undefined;

if (urlParams.has('seed')) seed = parseInt(urlParams.get('seed'));


// @ts-ignore 
// let physicsParticle = new PhysicsParticles("#canvas_board");
let sc_director = new SC_Director("#canvas_board", seed);

//sc_canvas.render();