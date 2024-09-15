'use strict';
const expect = require('chai').expect;
const Redis78 = require('../dist/index').default;
var iconv = require('iconv-lite');
var fs = require('fs'); 
console.log(process.argv)
var fspath = process.argv[3]
var config = loadjson(fspath);
console.log('??:', JSON.stringify(config, null, 2));

function loadjson(filepath) {
    var data;
    try {
        var jsondata = iconv.decode(fs.readFileSync(filepath, "binary"), "utf8");
        data = JSON.parse(jsondata); 
    }
    catch (err) {
        console.log(err);
    }
    return data;
}

console.log('Redis78?:', Redis78);
let redis = new Redis78(config);
console.log('Redis??:', redis);

describe('test set', () => {
    it('should return OK', async () => { 
        let result = await redis.set("testitem", 8, 60) 
        expect(result).to.equal("OK");
    });
});

describe('test get', () => {
    it('should return 8', async () => {
        let result = await redis.get("testitem") 
        expect(result).to.equal("8");
    });
}); 

describe('test del', () => {
    it('should return 1', async () => {
        let result = await redis.del("testitem")
        expect(result).to.equal(1);
    });
}); 

