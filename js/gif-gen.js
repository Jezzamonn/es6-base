import Controller from './controller.js';
import Canvas from 'canvas';
import fs from 'fs';
import GIFEncoder from 'gifencoder';
import singleLineLog from 'single-line-log';
import gifsicle from 'gifsicle';
import {execFile} from 'child_process'
import format from 'string-format';
import filesize from 'filesize';

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

function generateGif(controller, options, outFileName) {
    const {width, height, fps, numSubFrames, length} = options;
    // we wrap this whole thing in a promise so we can deal with the async nature of dealing with the file.
    return new Promise((resolve, reject) => {
        const canvas = new Canvas(width, height);
        const context = canvas.getContext('2d');
        controller.update(0);
        
        const encoder = new GIFEncoder(width, height);
        const stream = encoder.createReadStream().pipe(fs.createWriteStream(outFileName))
        encoder.start();
        encoder.setRepeat(0);
        encoder.setDelay(1000 / fps);
        encoder.setQuality(10);
        
        const dt = (1 / fps);
        const subFrameTime = dt / numSubFrames;
        
        for (let time = 0; time < length; time += dt) {
            const subframes = [];
            for (let i = 0; i < numSubFrames; i ++) {
                renderFrame(context, controller, width, height);
                subframes.push(context.getImageData(0, 0, width, height));
        
                controller.update(subFrameTime);
            }
        
            const averagedFrame = averageImageDatas(subframes, context.createImageData(width, height));
            context.putImageData(averagedFrame, 0, 0);
            encoder.addFrame(context);
        
            const doneAmt = time / length;
            singleLineLog.stdout(format(
                "Generating gif: {}",
                doneAmt.toLocaleString('en', {style: 'percent'})
            ));
        }
        
        singleLineLog.stdout("Generating Done!\n")
        
        encoder.finish();

        // Call the resolve method of the promise when this is done.
        stream.on('finish', () => resolve());
    })
}

function optimiseGif(inFileName, outFileName) {
    return new Promise((resolve, reject) => {
        console.log('Optimizing...')
        // Woot passing unsanitized arguments to a commandline.
        execFile(gifsicle, ['-O3', inFileName, '-o', outFileName, '--colors', '16'], err => {
            if (err) {
                reject(err);
            }
            else {
                console.log('Optimizing done!');

                const startFileSize = fs.statSync(inFileName).size;
                const optFileSize = fs.statSync(outFileName).size;
                console.log(format(
                    '{} file size reduction ({} => {})',
                    (1 - optFileSize / startFileSize).toLocaleString('en', {style: 'percent'}),
                    filesize(startFileSize),
                    filesize(optFileSize)
                ));
                resolve();
            }
        })
    })
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

    generateGif(controller, options, 'build/gen.gif')
        .then(() => optimiseGif('build/gen.gif', 'build/opt.gif'))
        .catch(err => console.log('Something went wrong!\n' + err));
}

main();