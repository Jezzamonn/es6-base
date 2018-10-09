import Controller from './controller.js';
import Canvas from 'canvas';
import fs from 'fs';

const width = 500;
const height = 500;

function renderFrame(context, controller) {
    context.resetTransform();
    context.fillStyle = 'white';
    context.fillRect(0, 0, width, height);

    // Set origin to middle.
    context.translate(canvas.width / 2, canvas.height / 2);
    
    controller.render(context);
}

const canvas = new Canvas(width, height);
const context = canvas.getContext('2d');
const controller = new Controller();
controller.update(0);
renderFrame(context, controller);

const out = fs.createWriteStream('build/test.png')
const stream = canvas.pngStream();
stream.on('data', chunk => out.write(chunk));
stream.on('end', () => console.log('saved png?'));