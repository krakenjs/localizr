'use strict';

var test = require('tape'),
    path = require('path'),
    bundle = require('../lib/bundle');


test('bundle', function (t) {

    t.test('create', function (t) {
        var file, bun;

        file = path.join(__dirname, 'fixtures', 'content', 'index.properties');
        bun = bundle.create(file);

        t.equal(typeof bun, 'object');
        t.equal(typeof bun.get, 'function');
        t.equal(typeof bun.load, 'function');
        t.equal(bun.file, file);
        t.equal(bun.type, 'properties');
        t.equal(bun.name, 'index');
        t.end();
    });


    t.test('load', function (t) {
        var file, orig;

        file = path.join(__dirname, 'fixtures', 'content', 'index.properties');

        orig = bundle.create(file);
        orig.load(function (err, bun) {
            t.error(err);
            t.strictEqual(bun, orig);
            t.equal(typeof bun, 'object');
            t.equal(typeof bun.get, 'function');
            t.equal(typeof bun.load, 'function');
            t.equal(bun.file, file);
            t.equal(bun.type, 'properties');
            t.equal(bun.name, 'index');
            t.end();
        });
    });


    t.test('load noop', function (t) {
        var file, orig;

        file = path.join(__dirname, 'fixtures', 'content', 'index.properties');

        orig = bundle.create(file);
        orig.load(function (err, bun) {

            t.error(err);
            t.strictEqual(bun, orig);

            bun.load(function (err, bun2) {
                t.error(err);
                t.strictEqual(bun2, bun);
                t.equal(typeof bun2, 'object');
                t.equal(typeof bun2.get, 'function');
                t.equal(typeof bun2.load, 'function');
                t.equal(bun2.file, file);
                t.equal(bun2.type, 'properties');
                t.equal(bun2.name, 'index');
                t.end();
            });
        });
    });


    t.test('load err - no file', function (t) {
        bundle.create('').load(function (err, bun) {
            t.ok(err);
            t.notOk(bun);
            t.end();
        });
    });


    t.test('get', function (t) {
        var file = path.join(__dirname, 'fixtures', 'content', 'index.properties');
        bundle.create(file).load(function (err, bun) {
            var value;

            t.error(err);

            value = bun.get('foo');
            t.equal(value, 'Hello, {name}!');
            t.end();
        });
    });


    t.test('get namespaced', function (t) {
        var file = path.join(__dirname, 'fixtures', 'content', 'index.properties');
        bundle.create(file).load(function (err, bun) {
            var value;

            t.error(err);

            value = bun.get('bar.baz');
            t.equal(value, 'Goodnight, {name}!');
            t.end();
        });
    });


    t.test('get err - no load', function (t) {
        var file = path.join(__dirname, 'fixtures', 'content', 'index.properties');
        t.throws(function () {
            bundle.create(file).get('foo');
        });
        t.end();
    });


    t.test('get missing', function (t) {
        var file = path.join(__dirname, 'fixtures', 'content', 'index.properties');
        bundle.create(file).load(function (err, bun) {
            var value;

            t.error(err);

            value = bun.get('bam');
            t.equal(value, '☃bam☃');
            t.end();
        });
    });


    t.test('get nothing', function (t) {
        var file = path.join(__dirname, 'fixtures', 'content', 'index.properties');
        bundle.create(file).load(function (err, bun) {
            var value;

            t.error(err);

            value = bun.get(undefined);
            t.equal(value, '☃undefined☃');
            t.end();
        });
    });


    t.test('isContentBundle', function (t) {
        t.ok(bundle.isContentBundle(bundle.create()));
        t.notOk(bundle.isContentBundle({}));
        t.end();
    });

});