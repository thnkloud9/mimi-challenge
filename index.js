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
            var word = '';
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
    var wordsArray = words.split('\n');
    var wordMetaObjects = [];
    var friends = 0;
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
                let wordLetters = getLetterCount(word.word);
                let compareWordLetters = getLetterCount(compareWord.word);

                if (arraysEqual(Object.values(wordLetters), Object.values(compareWordLetters))) {
                    console.log('match found', word, compareWord);
                    friends++;
                    return true;
                }
                return true;
            }
        });
    });

    process.stdout.write('Found ' + friends + ' words with at least 1 friend.  Out of a total of ' + words.length + ' words.');
}

function getLetterCount(word) {
    var letters = new Object;

    var count = 1;
    for(let x = 0, length = word.length; x < length; x++) {
        var letter = word.charAt(x);
        var nextLetter = (x < (length-1)) ? word.charAt(x+1) : '';
        if (letter === nextLetter) {
           count++;
        } else {
            letters[x] = count;
            count = 1;
        }
    }

    return letters;
}

function arraysEqual(arr1, arr2) {
    if(arr1.length !== arr2.length)
        return false;
    for(var i = arr1.length; i--;) {
        if(arr1[i] !== arr2[i])
            return false;
    }

    return true;
}


