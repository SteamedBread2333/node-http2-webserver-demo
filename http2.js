const http2 = require('http2');
const path = require('path')
const express = require('express')
const fs = require('fs');
const { HTTP2_HEADER_PATH, NGHTTP2_REFUSED_STREAM } = http2.constants

const server = http2.createSecureServer({
    key: fs.readFileSync(__dirname + '/configs/server.key'),
    cert: fs.readFileSync(__dirname + '/configs/server.crt')
});

// Push file
function push(stream, path, contentType) {
    console.log(__dirname + path)
    try {
        stream.pushStream({ [HTTP2_HEADER_PATH]: path }, (err, pushStream, headers) => {
            // console.log(err)
            // console.log(pushStream)
            // console.log(headers)
            if (err) throw err;
            try {
                pushStream.respond({
                    'content-type': contentType,
                    ':status': 200
                })
                pushStream.end(fs.readFileSync(__dirname + '/web' + path))
            } catch (error) {
                throw error
            }

        })
    } catch (error) {
        throw error
    }
}

server.on('error', (err) => console.error(err));

server.on('stream', (stream, headers) => {
    // if (headers[':path'] === '/home') {
    // if (headers[':method'] !== 'CONNECT') {
    //     // Only accept CONNECT requests
    //     stream.close(NGHTTP2_REFUSED_STREAM);
    //     return;
    // }
    const fd = fs.openSync(__dirname + '/web/index.html', 'r');
    // stream 是一个双工流
    stream.respond({
        'content-type': 'text/html',
        ':status': 200
    });
    // if (stream.pushAllowed) {
    push(stream, '/bundle1.js', 'application/javascript')
    push(stream, '/bundle2.js', 'application/javascript')
    push(stream, '/jquery-migrate-1.4.1.js', 'application/javascript')
    push(stream, '/style.css', 'text/css')


    stream.end(fs.readFileSync(__dirname + '/web/index.html'));
    // }
    // }
});

server.listen(8888);

