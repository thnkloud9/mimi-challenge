'use strict';

const request = require('request');
const yauzl = require('yauzl');
const util = require('util');

/**
 * Process command line parameters.  Google Api Key is required with Google Drive API enabled.
 */
if (process.argv[2]) {
    var googleApiKey = process.argv[2];
} else {
    log('Usage: node index.js [googleApiKey]');
    process.exit(1);
}

/**
 * Main process.
 * 1. Makes a request to Google Drive Api to request the zipped wordlist file.
 * 2. Unzips the requested file using yauzl and loads the file contents into `data` string.
 * 3. Checks the data for friendly words using the processWords() function.
 */
request({
    method : 'GET',
    url : 'https://www.googleapis.com/drive/v3/files/0By5aT61a8aD8WlVpWU9CSU9ubUU?alt=media&key=' + googleApiKey,
    encoding: null
}, (error, response, body) => {
    if(error || response.statusCode !== 200) {
        log('Failed to download file.  Response code: ' + response.statusCode + 'Error: ' + error);
        return;
    }

    try {
        yauzl.fromBuffer(body, {lazyEntries: true}, (error, zipfile) => {
            if (error) throw error;
            zipfile.readEntry();
            zipfile.on('entry', (entry) => {
                var word = '';
                zipfile.openReadStream(entry, (error, readStream) => {
                    if (error) throw error;
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
    } catch (error) {
        log('Failed to unzip file. Error: ' + error);
        process.exit(1);
    }

});


/**
 * Checks a string containing multiple words, separated by newline char, for friendly words in the same list.
 *
 * @param {string} words string for separated by newline char
 *
 * @return {undefined}
 */
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
            normal: normalizeWord(word),
            length: word.length,
            uniq: parseInt(uniq.length)
        });
    });

    wordMetaObjects.forEach((word) => {
        wordMetaObjects.some((compareWord) => {
            if ((compareWord.word !== word.word) &&
            (compareWord.length === word.length) &&
            (compareWord.uniq === word.uniq) && 
            (arraysEqual(compareWord.normal, word.normal))) {
                log('match found', word, compareWord);
                friends++;
                return true;
            }
        });
    });

    log('Found ' + friends + ' words with at least 1 friend.  Out of a total of ' + wordMetaObjects.length + ' words.');
}

/**
 * Normalizes a word by replacing each letter with its first occurrance integer value.
 *
 * @param {string} word string to normalize
 *
 * @return {array} normalized word
 */
function normalizeWord(word) {
    var newWordArray = [];
    for(let x = 0, length = word.length; x < length; x++) {
        let firstLetterPosition = word.indexOf(word[x]);
        newWordArray.push(firstLetterPosition);
    }

    return newWordArray;
}

/**
 * Checks if two arrays have indentical values.
 *
 * @param {array} arr1 first array
 * @param {array} arr1 first array
 *
 * @return {boolean} true only if all values are identical in both arrays
 */
function arraysEqual(arr1, arr2) {
    if(arr1.length !== arr2.length)
        return false;
    for(var i = arr1.length; i--;) {
        if(arr1[i] !== arr2[i])
            return false;
    }

    return true;
}

/**
 * Prints a string to stdout
 *
 * @param {mixed} arguments variable number of arguments of mixed type
 *
 * @return {undefined}
 */
function log() {
  process.stdout.write(util.format.apply(this, arguments) + '\n');
}

