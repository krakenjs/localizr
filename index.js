'use strict';

var fs = require('fs'),
    assert = require('assert'),
    tagfinder = require('findatag'),
    bundle = require('./lib/bundle'),
    handler = require('./lib/handler');


exports.createReadStream = function (options) {
    var handle, src, dest;

    options = options || {};

    assert.ok(options.src, 'No input file specified.');
    assert.ok(options.props, 'No properties file specified.');

    handle = handler.create(bundle.create(options.props));
    src = fs.createReadStream(options.src);
    dest = tagfinder.createParseStream(handle);

    // Forward errors
    return src.on('error', dest.emit.bind(dest, 'error')).pipe(dest);
};