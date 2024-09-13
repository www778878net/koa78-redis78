'use strict';
const expect = require('chai').expect;
const Redis78 = require('../dist/index').default;
var iconv = require('iconv-lite');
var fs = require('fs'); 
console.log(process.argv)
var fspath = process.argv[3]
var config = loadjson(fspath);
console.log('????:', JSON.stringify(config, null, 2));

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
let redis = new Redis78(config);  // ?????? config ??
console.log('Redis??:', redis);

describe('test null ', () => {
    it(' return anything', async() => {
        let testclient = new Redis78(null)
        let reback= await testclient.set("test", 1, 20) 
        expect(reback).to.equal("");
    });
});

describe('test set  ', () => {
    it(' return true',async () => { 
        let result = await redis.set("testitem", 8, 60) 
        expect(result).to.equal("OK");
    });
});

describe('test get  ', () => {
    it(' return 1',async () => {
        let result = await redis.get("testitem") 
        expect(result).to.equal("8");
    });
}); 

describe('test del  ', () => {
    it(' return true',async () => {
        let result = await redis.del("testitem")
        expect(result).to.equal(1);
    });
}); 

