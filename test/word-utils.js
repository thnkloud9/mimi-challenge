const wordUtils = require("../word-utils");
const assert = require('assert');

describe("wordUtils", () => {
    describe("processWords", () => {
        it("returns the correct number of friends from a new-line-char separated word string", () => {
            var words = 'LALALA\nXOXOXO'
            assert.equal(wordUtils.processWords(words), 2);

            words = 'HHHCCC\nBBBMMM'
            assert.equal(wordUtils.processWords(words), 2);

            words = 'LALALA\nXOXOXO\nGCGCGC\nHHHCCC\nBBBMMM\n\nEGONUH\n\nHHRGOE';
            assert.equal(wordUtils.processWords(words), 5);
        });
        it("returns 0 if non-string type is passed", () => {
            words = {}
            assert.equal(wordUtils.processWords(words), 0);
        })
    });

    describe("normalizeWord", () => {
        it("replaces each letter in a string with its first position integer value in an array format", () => {
            var word = 'AABBAC';
            var expectedResult = [0,0,2,2,0,5];
            assert.deepEqual(wordUtils.normalizeWord(word), expectedResult);
        });
        it("returns an empty array if a non-string type is passed", () => {
            var word = {};
            assert.deepEqual(wordUtils.normalizeWord(word), []);

        });
    });

    describe("arraysEqual", () => {
        it("returns true for two identical arrays", () => {
            var arr1 = [1, 2, 3];
            var arr2 = [1, 2, 3];
            assert.equal(wordUtils.arraysEqual(arr1, arr2), true);
        });
        it("returns false for two mixed arrays", () => {
            var arr1 = [1, 2, 3];
            var arr2 = [1, 2, 4];
            assert.equal(wordUtils.arraysEqual(arr1, arr2), false);
        });
        it("returns false if a non-array is passed", () => {
            var arr1 = [1, 2, 3];
            var arr2 = 'not-an-array';
            assert.equal(wordUtils.arraysEqual(arr1, arr2), false);
        });
    });
});