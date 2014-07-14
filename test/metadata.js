#!/usr/bin/env node
/*global describe:false, it:false, before:false, beforeEach:false, after:false, afterEach:false*/
'use strict';

var test = require('tape'),
    path = require('path'),
    finder = require('findatag'),
    metadata = require('../lib/metadata'),
    handler = require('../lib/handler'),
    path = require('path'),
    bundle = require('../lib/bundle');

var file = __dirname + '/fixtures/content/handler.properties';

var content = metadata.decorate(bundle.create(file));

test('metadata', function (t) {
    runScenarios(t, [
        {
            it: 'should replace a pre tag with localized content',
            input: 'Hello, {@pre type="content" key="name" /}!',
            expected: 'Hello, <edit data-key="name" data-bundle="' + __dirname + '/fixtures/content/handler.properties" data-original="world">world</edit>!'
        },
        {
            it: 'should ignore a pre tag with editable attribute set to false',
            input: 'Hello, {@pre type="content" editable="false" key="name" /}!',
            expected: 'Hello, world!'
        },
        {
            it: 'should ignore unrecognized tags',
            input: 'Hello, {@pre type="link" /}!',
            expected: 'Hello, !'
        }
    ]);

});

function runScenarios(t, scenarios) {
    content.load(function (err, content) {
        t.notOk(err, "content bundle loaded");
        var tagHandler = handler.create(content);
        var n = 0;
        scenarios.forEach(function (scenario) {
            evaluate(scenario.input, tagHandler, function (err, result) {
                t.equal(result, scenario.expected, scenario.it);
            });
        });
        t.end();
    });
}

test('list', function (t) {
    runScenarios(t, [
        {
            it: 'should recognize list type',
            input: 'Hello, {@pre type="content" key="states" /}!',
            expected: 'Hello, <edit data-key=\"states[0]\" data-bundle=\"' + process.cwd()  + '/test/fixtures/content/handler.properties\" data-original=\"CA\">CA</edit><edit data-key=\"states[1]\" data-bundle=\"' + process.cwd()  + '/test/fixtures/content/handler.properties\" data-original=\"MI\">MI</edit><edit data-key=\"states[2]\" data-bundle=\"' + process.cwd()  + '/test/fixtures/content/handler.properties\" data-original=\"OR\">OR</edit>!'
        },
        {
            it: 'should support the "sep" attribute',
            input: 'Hello: {@pre type="content" key="states" sep=", " /}!',
            expected: 'Hello: <edit data-key="states[0]" data-bundle="' + process.cwd()  + '/test/fixtures/content/handler.properties" data-original="CA">CA</edit>, <edit data-key="states[1]" data-bundle="' + process.cwd()  + '/test/fixtures/content/handler.properties" data-original="MI">MI</edit>, <edit data-key="states[2]" data-bundle="' + process.cwd()  + '/test/fixtures/content/handler.properties" data-original="OR">OR</edit>!'
        },
        {
            it: 'should allow newlines',
            input: 'Hello:\r\n{@pre type="content" key="states" sep="\r\n" /}!',
            expected: 'Hello:\r\n<edit data-key="states[0]" data-bundle="' + process.cwd()  + '/test/fixtures/content/handler.properties" data-original="CA">CA</edit>\r\n<edit data-key="states[1]" data-bundle="' + process.cwd()  + '/test/fixtures/content/handler.properties" data-original="MI">MI</edit>\r\n<edit data-key="states[2]" data-bundle="' + process.cwd()  + '/test/fixtures/content/handler.properties" data-original="OR">OR</edit>!'
        },
        {
            it: 'should support the "before" attribute',
            input: 'Hello: {@pre type="content" key="states" before="->" /}!',
            expected: 'Hello: -><edit data-key="states[0]" data-bundle="' + process.cwd()  + '/test/fixtures/content/handler.properties" data-original="CA">CA</edit>-><edit data-key="states[1]" data-bundle="' + process.cwd()  + '/test/fixtures/content/handler.properties" data-original="MI">MI</edit>-><edit data-key="states[2]" data-bundle="' + process.cwd()  + '/test/fixtures/content/handler.properties" data-original="OR">OR</edit>!'
        },
        {
            it: 'should support the "after" attribute',
            input: 'Hello: {@pre type="content" key="states" after="->" /}!',
            expected: 'Hello: <edit data-key="states[0]" data-bundle="' + process.cwd()  + '/test/fixtures/content/handler.properties" data-original="CA">CA</edit>-><edit data-key="states[1]" data-bundle="' + process.cwd()  + '/test/fixtures/content/handler.properties" data-original="MI">MI</edit>-><edit data-key="states[2]" data-bundle="' + process.cwd()  + '/test/fixtures/content/handler.properties" data-original="OR">OR</edit>->!'
        },
        {
            it: 'should support the "before" and "after" attributes',
            input: '<ul>{@pre type=content key=states before="<li>" after="</li>" /}</ul>',
            expected: '<ul><li><edit data-key="states[0]" data-bundle="' + process.cwd()  + '/test/fixtures/content/handler.properties" data-original="CA">CA</edit></li><li><edit data-key="states[1]" data-bundle="' + process.cwd()  + '/test/fixtures/content/handler.properties" data-original="MI">MI</edit></li><li><edit data-key="states[2]" data-bundle="' + process.cwd()  + '/test/fixtures/content/handler.properties" data-original="OR">OR</edit></li></ul>'
        },
        {
            it: 'should support the "before," "after," and "sep" attributes',
            input: '<ul>{@pre type=content key=states before="<li>" after="</li>" sep="\r\n" /}</ul>',
            expected: '<ul><li><edit data-key="states[0]" data-bundle="' + process.cwd()  + '/test/fixtures/content/handler.properties" data-original="CA">CA</edit></li>\r\n<li><edit data-key="states[1]" data-bundle="' + process.cwd()  + '/test/fixtures/content/handler.properties" data-original="MI">MI</edit></li>\r\n<li><edit data-key="states[2]" data-bundle="' + process.cwd()  + '/test/fixtures/content/handler.properties" data-original="OR">OR</edit></li></ul>'
        },
        {
            it: 'should support the editable attribute set to false',
            input: 'Hello, {@pre type="content" editable="false" key="states" sep=" " /}!',
            expected: 'Hello, CA MI OR!'
        }
    ]);
});


test('map', function (t) {
    runScenarios(t, [
        {
            it: 'should recognize list type',
            input: 'Hello, {@pre type="content" key="state" /}!',
            expected: 'Hello, <edit data-key=\"state[CA]\" data-bundle=\"' + process.cwd()  + '/test/fixtures/content/handler.properties\" data-original=\"California\">California</edit><edit data-key=\"state[MI]\" data-bundle=\"' + process.cwd()  + '/test/fixtures/content/handler.properties\" data-original=\"Michigan\">Michigan</edit><edit data-key=\"state[OR]\" data-bundle=\"' + process.cwd()  + '/test/fixtures/content/handler.properties\" data-original=\"Oregon\">Oregon</edit>!'
        },
        {
            it: 'should support the "sep" attribute',
            input: 'Hello: {@pre type="content" key="state" sep=", " /}!',
            expected: 'Hello: <edit data-key="state[CA]" data-bundle="' + process.cwd()  + '/test/fixtures/content/handler.properties" data-original="California">California</edit>, <edit data-key="state[MI]" data-bundle="' + process.cwd()  + '/test/fixtures/content/handler.properties" data-original="Michigan">Michigan</edit>, <edit data-key="state[OR]" data-bundle="' + process.cwd()  + '/test/fixtures/content/handler.properties" data-original="Oregon">Oregon</edit>!'
        },
        {
            it: 'should allow newlines',
            input: 'Hello:\r\n{@pre type="content" key="state" sep="\r\n" /}!',
            expected: 'Hello:\r\n<edit data-key="state[CA]" data-bundle="' + process.cwd()  + '/test/fixtures/content/handler.properties" data-original="California">California</edit>\r\n<edit data-key="state[MI]" data-bundle="' + process.cwd()  + '/test/fixtures/content/handler.properties" data-original="Michigan">Michigan</edit>\r\n<edit data-key="state[OR]" data-bundle="' + process.cwd()  + '/test/fixtures/content/handler.properties" data-original="Oregon">Oregon</edit>!'
        },
        {
            it: 'should support the "before" attribute',
            input: 'Hello: {@pre type="content" key="state" before="->" /}!',
            expected: 'Hello: -><edit data-key="state[CA]" data-bundle="' + process.cwd()  + '/test/fixtures/content/handler.properties" data-original="California">California</edit>-><edit data-key="state[MI]" data-bundle="' + process.cwd()  + '/test/fixtures/content/handler.properties" data-original="Michigan">Michigan</edit>-><edit data-key="state[OR]" data-bundle="' + process.cwd()  + '/test/fixtures/content/handler.properties" data-original="Oregon">Oregon</edit>!'
        },
        {
            it: 'should support the "after" attribute',
            input: 'Hello: {@pre type="content" key="state" after="->" /}!',
            expected: 'Hello: <edit data-key="state[CA]" data-bundle="' + process.cwd()  + '/test/fixtures/content/handler.properties" data-original="California">California</edit>-><edit data-key="state[MI]" data-bundle="' + process.cwd()  + '/test/fixtures/content/handler.properties" data-original="Michigan">Michigan</edit>-><edit data-key="state[OR]" data-bundle="' + process.cwd()  + '/test/fixtures/content/handler.properties" data-original="Oregon">Oregon</edit>->!'
        },
        {
            it: 'should support the "before" and "after" attributes',
            input: '<ul>{@pre type=content key=state before="<li>" after="</li>" /}</ul>',
            expected: '<ul><li><edit data-key="state[CA]" data-bundle="' + process.cwd()  + '/test/fixtures/content/handler.properties" data-original="California">California</edit></li><li><edit data-key="state[MI]" data-bundle="' + process.cwd()  + '/test/fixtures/content/handler.properties" data-original="Michigan">Michigan</edit></li><li><edit data-key="state[OR]" data-bundle="' + process.cwd()  + '/test/fixtures/content/handler.properties" data-original="Oregon">Oregon</edit></li></ul>'
        },
        {
            it: 'should support the "before," "after," and "sep" attributes',
            input: '<ul>{@pre type=content key=state before="<li>" after="</li>" sep="\r\n" /}</ul>',
            expected: '<ul><li><edit data-key="state[CA]" data-bundle="' + process.cwd()  + '/test/fixtures/content/handler.properties" data-original="California">California</edit></li>\r\n<li><edit data-key="state[MI]" data-bundle="' + process.cwd()  + '/test/fixtures/content/handler.properties" data-original="Michigan">Michigan</edit></li>\r\n<li><edit data-key="state[OR]" data-bundle="' + process.cwd()  + '/test/fixtures/content/handler.properties" data-original="Oregon">Oregon</edit></li></ul>'
        },
        {
            it: 'should support the editable attribute set to false',
            input: 'Hello, {@pre type="content" key="state" editable="false" sep=" " /}!',
            expected: 'Hello, California Michigan Oregon!'
        }
    ]);
});

function evaluate(str, tagHandler, callback) {
    var stream, chunks;

    stream = finder.createParseStream(tagHandler);
    chunks = [];

    stream.on('data', function (chunk) {
        chunks.push(chunk);
    });

    stream.on('error', function (err) {
        callback(err);
    });

    stream.on('finish', function () {
        callback(null, Buffer.concat(chunks).toString('utf8'));
    });

    stream.write(str);
    stream.end();
}
