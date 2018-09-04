const wordUtils = require('../word-utils');
const assert = require('assert');
const fs = require('fs');

describe('wordUtils', () => {
    describe('processWords', () => {
        it('returns the correct number of friends from a new-line-char separated word string', () => {
            let words = 'LALALA\nXOXOXO';
            assert.equal(wordUtils.processWords(words), 2);

            words = 'HHHCCC\nBBBMMM';
            assert.equal(wordUtils.processWords(words), 2);

            words = 'LALALA\nXOXOXO\nGCGCGC\nHHHCCC\nBBBMMM\n\nEGONUH\n\nHHRGOE';
            assert.equal(wordUtils.processWords(words), 5);
        });
        it('returns the correct number of friends for 10000 words.', () => {
            console.time('Process Words Performance Test');
            fs.readFile('./test/words.txt', 'utf8', function(err, words) {
                if (err) throw err;
                assert.equal(wordUtils.processWords(words), 14);
                console.timeEnd('Process Words Performance Test');
            });
        });
        it('returns 0 if non-string type is passed', () => {
            words = {};
            assert.equal(wordUtils.processWords(words), 0);
        });
    });

    describe('normalizeWord', () => {
        it('replaces each letter in a string with its first position integer value and a field separator', () => {
            let word = 'AABBAC';
            let expectedResult = '0|0|2|2|0|5|';
            assert.deepEqual(wordUtils.normalizeWord(word), expectedResult);
        });
        it('returns an empty string if a non-string type is passed', () => {
            let word = [];
            assert.deepEqual(wordUtils.normalizeWord(word), '');

        });
    });
});