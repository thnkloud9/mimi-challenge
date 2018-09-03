'use strict';

const request = require('request');
const yauzl = require('yauzl');

request({
    method : 'GET',
    url : 'https://www.googleapis.com/drive/v3/files/0By5aT61a8aD8WlVpWU9CSU9ubUU?alt=media&key=AIzaSyCqtneeGqDwpeWJHEvm2daOBNrAmJOdNn0',
    encoding: null
}, (error, response, body) => {
    if(error ||  response.statusCode !== 200) {
        process.stdout.write('Failed to download file.  Response code: ' + response.statusCode + 'Error: ' + error);
        return;
    }

    yauzl.fromBuffer(body, {lazyEntries: true}, (err, zipfile) => {
        if (err) throw err;
        zipfile.readEntry();
        zipfile.on('entry', (entry) => {
            let word = '';
            zipfile.openReadStream(entry, (err, readStream) => {
                if (err) throw err;
                readStream.on('data', (data) => {
                    word += data;
                });
                readStream.on('end', () => {
                    processWords(word);
                    zipfile.readEntry();
                });
            });
        });
    });
});

function processWords(words) {
    let wordsArray = words.split('\n');
    let wordMetaObjects = [];
    let friends = 0;
    wordsArray.forEach((word) => {
        let uniq = '';
        for (var i = 0; i < word.length; i++) {
            if (uniq.indexOf(word[i]) == -1) {
                uniq += word[i];
            }
        }
        wordMetaObjects.push({
            word: word,
            length: word.length,
            uniq: parseInt(uniq.length)
        });
    });

    wordMetaObjects.forEach((word) => {
        wordMetaObjects.some((compareWord) => {
            if ((compareWord.word !== word.word) &&
          (compareWord.length === word.length) &&
          (compareWord.uniq === word.uniq)) {
                friends++;
                return true;
            }
        });
    });

    process.stdout.write('Found ' + friends + ' words with at least 1 friend.  Out of a total of ' + words.length + ' words.');
}


