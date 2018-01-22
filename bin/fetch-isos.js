// Script to download all of the ISO files within the distros json file

// We probably could have done this in a simple bash script, but this
// way we are able to easily parse hashes from json and do some more
// complex things a little easier.

const async = require('async');
const crypto = require('crypto');
const fs = require('fs');
const request = require('request');
const progress = require('request-progress');
const url = require('url');

const destdir = 'isos/';
const distrosFile = 'distros.json';

const distros = JSON.parse(fs.readFileSync(distrosFile));

function deleteLocalISO(distro, errorCB) {
    const localFileName = destdir + url.parse(distro.url).pathname.split('/').pop();
    fs.unlink(localFileName, error => {
        if (error.code !== 'ENOENT') {
            errorCB(error);
        }
    });
}

function checkFileHash(distro, matchCB, mismatchCB, errorCB) {
    if (distro.hash_type === 'pass') {
        console.log(`Skipping ${distro.name} hash check.`)
        return;
    }

    const localFileName = destdir + url.parse(distro.url).pathname.split('/').pop();
    const stream = fs.createReadStream(localFileName);
    const hasher = crypto.createHash(distro.hash_type);
    console.log(`Checking ${distro.name} hash matches index.`)

    stream.on('data', data => {
        hasher.update(data);
    }).on('end', () => {
        const hash = hasher.digest('hex');
        if (distro.hash === hash) {
            console.log(`${distro.name} hash ${hash} matches index.`)
            matchCB(distro);
        } else {
            console.log(`${distro.name} hash ${hash} does not match hash from index ${distro.hash}.`)
            mismatchCB(distro, hash);
        }
    }).on('error', errorCB);
}

function fetchISO(distro, successCB, errorCB) {
    const localFileName = destdir + url.parse(distro.url).pathname.split('/').pop();
    const hasher = crypto.createHash(distro.hash_type);
    const stream = fs.createWriteStream(localFileName);

    const options = {
        url: distro.url,
        timeout: 5000
    };

    stream.on('open', () => {
        console.log(`Downloading ${distro.name} from <${distro.url}>.`);
        progress(request.get(options).on('error', errorCB)).on('progress', state => {
            const percent = (state.percent * 100).toFixed(2);
            const total = Math.round(state.time.remaining);
            const seconds = total % 60;
            const minutes = Math.trunc(total / 60);
            process.stdout.clearLine();
            process.stdout.cursorTo(0);
            process.stdout.write(`Downloaded ${percent}% Time remaining: ${minutes} minutes ${seconds} seconds.`)
        }).pipe(stream).on('finish', () => {
            console.log('');//reset newline
            successCB(distro);
        });
    }).on('error', errorCB);
}

function fetchISOCheckHash(distro, successCB, errorCB) {
    fetchISO(distro, distro => {
        checkFileHash(distro, distro => {
            //matched hash
            successCB();
        },distro => {
            //invalid hash so delete file so it won't accidentally be flashed
            deleteLocalISO(distro, errorCB);
        }, errorCB);
    }, error => {
        // network error. Delete partially downloaded file if necessary
        deleteLocalISO(distro, errorCB);
        errorCB(error);
    });
}

async.forEachOfSeries(distros, (distro, distroId, callback) => {
    const localFileName = destdir + url.parse(distro.url).pathname.split('/').pop();

    fs.stat(localFileName, (error, data) => {
        if (error) { //file likely doesn't exist so skip error for now
        } else if (data.size !== distro.size) {
            console.log(`Warning: ${distro.name} has listed size of ${distro.size} bytes while ${localFileName} has ${data.size} bytes.`);
        }
    });

    checkFileHash(distro, distro => {
        //matched hash
        callback();
    }, distro => {
        //mismatched hash attempt to download
        fetchISOCheckHash(distro, callback, error => {
            console.log(error);
            callback();
        });
    }, error => {
        if (error.code === 'ENOENT') {
            console.log(`${localFileName} does not exist.`);
            fetchISOCheckHash(distro, callback, error => {
                console.log(error);
                callback();
            });
        } else {
            callback(error);
        }
    });
}, error => {
    if (error) {
        console.log(error);
    }
});
