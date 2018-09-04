
/**
 * Checks a string containing multiple words, separated by newline char, for friendly words in the same list.
 *
 * @param {string} words string for separated by newline char
 * @param {boolean} debug set to true to print debug output
 *
 * @return {undefined}
 */
function processWords(words, debug = false) {
    if (typeof words !== 'string') {
        return 0;
    }

    let wordsArray = words.split(/\r\n|\r|\n/);
    let wordMap = new Map();
    let friends = 0;

    wordsArray.forEach((word) => {
        if (word !== '') {
            let normalizedWord = normalizeWord(word);
            let wordFriends = 1;
            if (wordMap.has(normalizedWord)) {
                wordMap.set(normalizedWord, wordMap.get(normalizedWord) + 1);
            } else {
                wordMap.set(normalizedWord, wordFriends);
            }
        }
    });

    if (debug) {
        console.log(wordMap);
    }

    wordMap.forEach((value) => {
        if (value > 1) {
            friends += value;
        }
    });

    return friends;
}

/**
 * Normalizes a word by replacing each letter with its first occurrance integer value and a field separator.
 * example: AABBCD becomes 0|0|2|2|4|5|
 *
 * @param {string} word string to normalize
 *
 * @return {string} normalized word
 */
function normalizeWord(word) {
    if (typeof word !== 'string') {
        return '';
    }

    let newWord = '';

    for(let x = 0, length = word.length; x < length; x++) {
        let firstLetterPosition = word.indexOf(word[x]);
        newWord += firstLetterPosition + '|';
    }

    return newWord;
}


module.exports = { processWords, normalizeWord };