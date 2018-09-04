'use strict';

const request = require('request');
const yauzl = require('yauzl');
const wordUtils = require('./word-utils');

/**
 * Process command line parameters.  Google Api Key is required with Google Drive API enabled.
 */
if (process.argv[2]) {
    var googleApiKey = process.argv[2];
} else {
    console.log('Usage: node index.js [googleApiKey]');
    process.exit(1);
}
const debug = (process.argv[3] === 'debug') ? true: false;

if (debug) {
    console.time('Process all words');
}
/**
 * Main process.
 * 1. Makes a request to Google Drive Api to request the zipped wordlist file.
 * 2. Unzips the requested file using yauzl and loads the file contents into `data` string.
 * 3. Checks the data for friendly words using the wordUtils.processWords() function.
 */
request({
    method : 'GET',
    url : 'https://www.googleapis.com/drive/v3/files/0By5aT61a8aD8WlVpWU9CSU9ubUU?alt=media&key=' + googleApiKey,
    encoding: null
}, (error, response, body) => {
    if(error || response.statusCode !== 200) {
        console.log('Failed to download file.  Response code: ' + response.statusCode + 'Error: ' + error);
        return;
    }

    try {
        yauzl.fromBuffer(body, {lazyEntries: true}, (error, zipfile) => {
            if (error) throw error;
            zipfile.readEntry();
            zipfile.on('entry', (entry) => {
                let words = '';
                zipfile.openReadStream(entry, (error, readStream) => {
                    if (error) throw error;
                    readStream.on('data', (data) => {
                        words += data;
                    });
                    readStream.on('end', () => {
                        console.log('Found ' + words.split(/\r\n|\r|\n/).length + ' total words.');
                        let friends = wordUtils.processWords(words, debug);
                        console.log('Found ' + friends + ' words with at least 1 friend.');

                        zipfile.readEntry();

                        if (debug) {
                            console.timeEnd('Process all words');
                        }
                    });
                });
            });
        });
    } catch (error) {
        console.log('Failed to unzip file. Error: ' + error);
        process.exit(1);
    }

});

