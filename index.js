#! /usr/bin/env node

const ID3Writer = require('browser-id3-writer');
const fs = require('fs');
const program = require('commander');

program
  .version('0.1.0')
  .usage('[options] <mp3 file>')
  .option('-a, --art [file]', 'Art File', '')
  .option('-c, --composer [composer]', 'Album Composer', '')
  .option('-p, --podcast [podcast]', 'Podcast', '')
  .option('-t, --title [title]', 'Title', '')
  .parse(process.argv);

const songBuffer = fs.readFileSync(program.args[0]);
const coverBuffer = fs.readFileSync(program.art);

const writer = new ID3Writer(songBuffer);
writer.setFrame('TIT2', program.title)
  .setFrame('TPE2', program.composer)
  .setFrame('TALB', program.podcast)
  .setFrame('APIC', {
    type: 3,
    data: coverBuffer,
    description: program.podcast
  });
writer.addTag();

const taggedSongBuffer = Buffer.from(writer.arrayBuffer);
fs.writeFileSync(program.args[0].split('.')[0] + '-ready.mp3', taggedSongBuffer);
console.log("Wrote out: " + program.args[0].split('.')[0] + '-ready.mp3');
