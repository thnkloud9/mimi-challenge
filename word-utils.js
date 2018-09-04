const util = require('util');

/**
 * Checks a string containing multiple words, separated by newline char, for friendly words in the same list.
 *
 * @param {string} words string for separated by newline char
 *
 * @return {undefined}
 */
function processWords(words, debug = false) {
    if (typeof words !== 'string') {
        return 0;
    }

    var wordsArray = words.split(/\r\n|\r|\n/);
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
                if (debug) {
                    log('match found', word, compareWord);
                }
                friends++;
                return true;
            }
        });
    });

    return friends;
};

/**
 * Normalizes a word by replacing each letter with its first occurrance integer value.
 *
 * @param {string} word string to normalize
 *
 * @return {array} normalized word
 */
function normalizeWord(word) {
    if (typeof word !== 'string') {
        return [];
    }

    var newWordArray = [];

    for(let x = 0, length = word.length; x < length; x++) {
        let firstLetterPosition = word.indexOf(word[x]);
        newWordArray.push(firstLetterPosition);
    }

    return newWordArray;
};

/**
 * Checks if two arrays have indentical values.
 *
 * @param {array} arr1 first array
 * @param {array} arr1 first array
 *
 * @return {boolean} true only if all values are identical in both arrays
 */
function arraysEqual(arr1, arr2) {
    if ((arr1.constructor !== Array) || (arr2.constructor !== Array)) {
        return false;
    }
    if(arr1.length !== arr2.length)
        return false;
    for(var i = arr1.length; i--;) {
        if(arr1[i] !== arr2[i])
            return false;
    }

    return true;
};

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

module.exports = { processWords, normalizeWord, arraysEqual, log };