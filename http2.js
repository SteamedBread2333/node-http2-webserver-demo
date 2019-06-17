const http2 = require('http2');
const path = require('path')
const express = require('express')
const fs = require('fs');
const { HTTP2_HEADER_PATH } = http2.constants

const server = http2.createSecureServer({
    key: fs.readFileSync(__dirname + '/configs/server.key'),
    cert: fs.readFileSync(__dirname + '/configs/server.crt')
});

// Push file
function push(stream, path) {
    console.log(__dirname + path)

    stream.pushStream({ [HTTP2_HEADER_PATH]: path }, (err, pushStream, headers) => {
        // console.log(err)
        // console.log(pushStream)
        // console.log(headers)
        if (err) throw err;
        pushStream.respond({
            'content-type': 'application/javascript',
            ':status': 200
        })
        pushStream.end(fs.readFileSync(__dirname + path))
    })
}

server.on('error', (err) => console.error(err));

server.on('stream', (stream, headers) => {
    if (headers[':path'] === '/home') {
        const fd = fs.openSync(__dirname + '/web/index.html', 'r');

        // stream 是一个双工流
        stream.respond({
            'content-type': 'text/html',
            ':status': 200
        });
        push(stream, '/web/bundle1.js')
        push(stream, '/web/bundle2.js')
        stream.end(fs.readFileSync(__dirname + '/web/index.html'));
    }
});

server.listen(3030);

