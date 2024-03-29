const commandLineArgs = require('command-line-args');
const fs = require('fs');
const { mkdirp } = require('mkdirp');
const mustache = require('mustache');

function main() {
    const commandLineOptions = [
        { name: 'title', type: String },
        { name: 'path', type: String },
        { name: 'description', type: String, defaultValue: '&hellip;'},
    ]
    const args = commandLineArgs(commandLineOptions);
    checkOptionProvided(args, 'title');
    checkOptionProvided(args, 'path');

    const template = fs.readFileSync('src/index.html').toString();

    const view = args;
    const html = mustache.render(template, view);

    mkdirp('build/web/');
    fs.writeFileSync('build/web/index.html', html);
}

function checkOptionProvided(args, name) {
    if (!args[name]) {
        throw new Error(`Oi mate-o. Give me a ${name}, hey`)
    };
}

main();