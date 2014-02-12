'use strict';

var test = require('tape'),
    path = require('path'),
    localizr = require('../'),
    concat = require('concat-stream');


test('localizr', function (t) {

    t.test('processing', function (t) {
        var options, dest;

        options = {
            src: path.join(__dirname, 'fixtures', 'templates', 'index.dust'),
            props: path.join(__dirname, 'fixtures', 'content', 'index.properties')
        };

        dest = concat({ encoding: 'string' }, function(data) {
            t.equal(data, '<h1>Hello, {name}!</h1>');
            t.end();
        });

        localizr.createReadStream(options).pipe(dest);
    });


    t.test('invalid src', function (t) {
        var options;

        options = {
            src: undefined,
            props: path.join(__dirname, 'fixtures', 'content', 'index.properties')
        };

        t.throws(function () {
            localizr.createReadStream(options);
        });

        t.end();
    });


    t.test('invalid props', function (t) {
        var options;

        options = {
            src: path.join(__dirname, 'fixtures', 'templates', 'index.dust'),
            props: undefined
        };

        t.throws(function () {
            localizr.createReadStream(options);
        });

        t.end();
    });


    t.test('invalid options', function (t) {
        t.throws(function () {
            localizr.createReadStream();
        });

        t.end();
    });


    t.test('src ENOENT', function (t) {
        var options;

        options = {
            src: path.join(__dirname, 'fixtures', 'templates', 'nofile.dust'),
            props: path.join(__dirname, 'fixtures', 'content', 'index.properties')
        };

        function onerror(err) {
            t.ok(err);
            t.end();
        }

        localizr.createReadStream(options).on('error', onerror);
    });


    t.test('props ENOENT', function (t) {
        var options;

        options = {
            src: path.join(__dirname, 'fixtures', 'templates', 'index.dust'),
            props: path.join(__dirname, 'fixtures', 'content', 'nofile.properties')
        };

        function onerror(err) {
            t.ok(err);
            t.end();
        }

        localizr.createReadStream(options).on('error', onerror);
    });

});

