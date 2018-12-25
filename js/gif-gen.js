import Controller from './controller.js';
import Canvas from 'canvas';
import fs from 'fs';
import singleLineLog from 'single-line-log';
import format from 'string-format';
import { join } from 'path';
import mkdirp from 'mkdirp';

function renderFrame(context, controller, width, height) {
    context.resetTransform();
    context.fillStyle = 'white';
    context.fillRect(0, 0, width, height);

    // Set origin to middle.
    context.translate(width / 2, height / 2);
    
    controller.render(context);
}

function averageImageDatas(imageDatas, outImageData) {
    for (let i = 0; i < outImageData.data.length; i ++) {
        let sum = imageDatas.map(imageData => imageData.data[i]).reduce((a, b) => a + b, 0);
        outImageData.data[i] = sum / imageDatas.length;
    }
    return outImageData;
}

/**
 * Outputs a bunch of frames as pngs to a directory.
 */
function generateFrames(controller, options, outDirectory) {
    const {width, height, fps, numSubFrames, length} = options;
    const canvas = new Canvas(width, height);
    const context = canvas.getContext('2d');
    controller.update(0);
    
    const dt = (1 / fps);
    const subFrameTime = dt / numSubFrames;

    mkdirp(outDirectory);
    
    let frameNumber = 0;
    for (let time = 0; time < length; time += dt) {
        const subframes = [];
        for (let i = 0; i < numSubFrames; i ++) {
            renderFrame(context, controller, width, height);
            subframes.push(context.getImageData(0, 0, width, height));
    
            controller.update(subFrameTime);
        }
    
        const averagedFrame = averageImageDatas(subframes, context.createImageData(width, height));
        context.putImageData(averagedFrame, 0, 0);

        const paddedFrame = frameNumber.toString().padStart(4, '0');
        const fileName = `frame${paddedFrame}.png`;
        const filePath = join(outDirectory, fileName);

        fs.writeFileSync(filePath, canvas.toBuffer());
    
        const doneAmt = time / length;
        singleLineLog.stdout(format(
            "Generating frames: {}",
            doneAmt.toLocaleString('en', {style: 'percent'})
        ));

        frameNumber ++;
    }
    
    singleLineLog.stdout("Generating Done!\n")
}

function main() {
    const controller = new Controller();
    const options = {
        width: 500,
        height: 500,
        fps: 30,
        numSubFrames: 4,
        length: controller.period,
    }

    generateFrames(controller, options, '/tmp/gif');
}

main();