"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const ioredis_1 = require("ioredis");
const generic_pool_1 = require("generic-pool");
class Redis78 {
    constructor(config = {}) {
        var _a, _b, _c, _d, _e;
        this._pool = null;
        this.local = "";
        this.host = "";
        if (config === null) {
            console.warn("Null config provided. Redis78 instance may not function correctly.");
            return;
        }
        const port = (_a = config.port) !== null && _a !== void 0 ? _a : 6379;
        const max = (_b = config.max) !== null && _b !== void 0 ? _b : 100;
        this.host = (_c = config.host) !== null && _c !== void 0 ? _c : "127.0.0.1";
        this.local = (_d = config.local) !== null && _d !== void 0 ? _d : "";
        const pwd = (_e = config.pwd) !== null && _e !== void 0 ? _e : "";
        this._pool = (0, generic_pool_1.createPool)({
            create: () => __awaiter(this, void 0, void 0, function* () {
                let client;
                if (pwd) {
                    client = new ioredis_1.default({
                        port,
                        host: this.host,
                        family: 4,
                        password: pwd,
                        db: 0
                    });
                }
                else {
                    client = new ioredis_1.default(port, this.host);
                }
                return client;
            }),
            destroy: (client) => __awaiter(this, void 0, void 0, function* () {
                try {
                    yield client.quit();
                }
                catch (err) {
                    console.log('Failed to close redis connection: ' + err);
                }
            })
        }, {
            max,
            min: 10,
            idleTimeoutMillis: 3000
        });
    }
    pipeGet() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this._pool)
                return null;
            const client = yield this._pool.acquire();
            return client.pipeline();
        });
    }
    pipeRelase(pipe) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this._pool)
                return "";
            if (pipe.redis instanceof ioredis_1.default) {
                yield this._pool.release(pipe.redis);
            }
            else {
                console.error('Unexpected redis instance type in pipeline');
            }
            return "OK";
        });
    }
    clientGet() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this._pool)
                return null;
            return yield this._pool.acquire();
        });
    }
    clientRelase(client) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this._pool)
                return "";
            yield this._pool.release(client);
            return "OK";
        });
    }
    ltrim(key, start, end) {
        return __awaiter(this, void 0, void 0, function* () {
            key += this.local;
            if (!this._pool)
                return "";
            const client = yield this._pool.acquire();
            try {
                const reply = yield client.ltrim(key, start, end);
                return reply;
            }
            catch (err) {
                console.error('redis ltrim Error:', err, key);
                throw err;
            }
            finally {
                yield this._pool.release(client);
            }
        });
    }
    set(key, value, sec = 86400) {
        return __awaiter(this, void 0, void 0, function* () {
            key += this.local;
            if (!this._pool)
                return "";
            const client = yield this._pool.acquire();
            try {
                const reply = yield client.set(key, value);
                if (sec !== -1) {
                    yield client.expire(key, sec);
                }
                return reply;
            }
            catch (err) {
                console.error('redis SetData Error:', err, key, value);
                throw err;
            }
            finally {
                yield this._pool.release(client);
            }
        });
    }
    get(key, debug = false) {
        return __awaiter(this, void 0, void 0, function* () {
            key += this.local;
            if (!this._pool)
                return null;
            const client = yield this._pool.acquire();
            try {
                const reply = yield client.get(key);
                if (debug) {
                    console.log("redis get:", key, "value:", reply);
                }
                return reply;
            }
            catch (err) {
                console.error('redis GetData Error:', err, key);
                throw err;
            }
            finally {
                yield this._pool.release(client);
            }
        });
    }
    del(key) {
        return __awaiter(this, void 0, void 0, function* () {
            key += this.local;
            if (!this._pool)
                return 0;
            const client = yield this._pool.acquire();
            try {
                const reply = yield client.del(key);
                return reply;
            }
            catch (err) {
                console.error('redis DelData Error:', err, key);
                throw err;
            }
            finally {
                yield this._pool.release(client);
            }
        });
    }
    llen(key) {
        return __awaiter(this, void 0, void 0, function* () {
            key += this.local;
            if (!this._pool)
                return 0;
            const client = yield this._pool.acquire();
            try {
                const reply = yield client.llen(key);
                return reply;
            }
            catch (err) {
                console.error('redis llen Error:', err, key);
                throw err;
            }
            finally {
                yield this._pool.release(client);
            }
        });
    }
    sadd(key, value) {
        return __awaiter(this, void 0, void 0, function* () {
            key += this.local;
            if (!this._pool)
                return 0;
            const client = yield this._pool.acquire();
            try {
                const reply = yield client.sadd(key, value);
                return reply;
            }
            catch (err) {
                console.error('redis sadd Error:', err, key, value);
                throw err;
            }
            finally {
                yield this._pool.release(client);
            }
        });
    }
    rpush(key, value) {
        return __awaiter(this, void 0, void 0, function* () {
            key += this.local;
            if (!this._pool)
                return 0;
            const client = yield this._pool.acquire();
            try {
                const reply = yield client.rpush(key, value);
                return reply;
            }
            catch (err) {
                console.error('redis rpush Error:', err, key, value);
                throw err;
            }
            finally {
                yield this._pool.release(client);
            }
        });
    }
    lpush(key, value) {
        return __awaiter(this, void 0, void 0, function* () {
            key += this.local;
            if (!this._pool)
                return 0;
            const client = yield this._pool.acquire();
            try {
                const reply = yield client.lpush(key, value);
                return reply;
            }
            catch (err) {
                console.error('redis lpush Error:', err, key, value);
                throw err;
            }
            finally {
                yield this._pool.release(client);
            }
        });
    }
    lrange(key, start, end) {
        return __awaiter(this, void 0, void 0, function* () {
            key += this.local;
            if (!this._pool)
                return [];
            const client = yield this._pool.acquire();
            try {
                const reply = yield client.lrange(key, start, end);
                return reply;
            }
            catch (err) {
                console.error('redis lrange Error:', err, key);
                throw err;
            }
            finally {
                yield this._pool.release(client);
            }
        });
    }
    lpop(key) {
        return __awaiter(this, void 0, void 0, function* () {
            key += this.local;
            if (!this._pool)
                return null;
            const client = yield this._pool.acquire();
            try {
                const reply = yield client.lpop(key);
                return reply;
            }
            catch (err) {
                console.error('redis lpop Error:', err, key);
                throw err;
            }
            finally {
                yield this._pool.release(client);
            }
        });
    }
    scard(key) {
        return __awaiter(this, void 0, void 0, function* () {
            key += this.local;
            if (!this._pool)
                return 0;
            const client = yield this._pool.acquire();
            try {
                const reply = yield client.scard(key);
                return reply;
            }
            catch (err) {
                console.error('redis scard Error:', err, key);
                throw err;
            }
            finally {
                yield this._pool.release(client);
            }
        });
    }
    spop(key) {
        return __awaiter(this, void 0, void 0, function* () {
            key += this.local;
            if (!this._pool)
                return null;
            const client = yield this._pool.acquire();
            try {
                const reply = yield client.spop(key);
                return reply;
            }
            catch (err) {
                console.error('redis spop Error:', err, key);
                throw err;
            }
            finally {
                yield this._pool.release(client);
            }
        });
    }
    rpop(key) {
        return __awaiter(this, void 0, void 0, function* () {
            key += this.local;
            if (!this._pool)
                return null;
            const client = yield this._pool.acquire();
            try {
                const reply = yield client.rpop(key);
                return reply;
            }
            catch (err) {
                console.error('redis rpop Error:', err, key);
                throw err;
            }
            finally {
                yield this._pool.release(client);
            }
        });
    }
    zadd(name, value, key) {
        return __awaiter(this, void 0, void 0, function* () {
            name += this.local;
            if (!this._pool)
                return 0;
            const client = yield this._pool.acquire();
            try {
                const reply = yield client.zadd(name, value, key);
                return reply;
            }
            catch (err) {
                console.error('redis zadd Error:', err, name, key, value);
                throw err;
            }
            finally {
                yield this._pool.release(client);
            }
        });
    }
    zincrby(name, value, key) {
        return __awaiter(this, void 0, void 0, function* () {
            name += this.local;
            if (!this._pool)
                return 0;
            const client = yield this._pool.acquire();
            try {
                const reply = yield client.zincrby(name, value, key);
                return parseFloat(reply);
            }
            catch (err) {
                console.error('redis zincrby Error:', err, name, key, value);
                throw err;
            }
            finally {
                yield this._pool.release(client);
            }
        });
    }
    zrange(name, start, end) {
        return __awaiter(this, void 0, void 0, function* () {
            name += this.local;
            if (!this._pool)
                return [];
            const client = yield this._pool.acquire();
            try {
                const reply = yield client.zrange(name, start, end, 'WITHSCORES');
                return reply;
            }
            catch (err) {
                console.error('redis zrange Error:', err, name);
                throw err;
            }
            finally {
                yield this._pool.release(client);
            }
        });
    }
    zrevrange(name, start, end) {
        return __awaiter(this, void 0, void 0, function* () {
            name += this.local;
            if (!this._pool)
                return [];
            const client = yield this._pool.acquire();
            try {
                const reply = yield client.zrevrange(name, start, end, 'WITHSCORES');
                return reply;
            }
            catch (err) {
                console.error('redis zrevrange Error:', err, name);
                throw err;
            }
            finally {
                yield this._pool.release(client);
            }
        });
    }
    zscore(name, key) {
        return __awaiter(this, void 0, void 0, function* () {
            name += this.local;
            if (!this._pool)
                return null;
            const client = yield this._pool.acquire();
            try {
                const reply = yield client.zscore(name, key);
                return reply;
            }
            catch (err) {
                console.error('redis zscore Error:', err, name, key);
                throw err;
            }
            finally {
                yield this._pool.release(client);
            }
        });
    }
    zrem(name, key) {
        return __awaiter(this, void 0, void 0, function* () {
            name += this.local;
            if (!this._pool)
                return 0;
            const client = yield this._pool.acquire();
            try {
                const reply = yield client.zrem(name, key);
                return reply;
            }
            catch (err) {
                console.error('redis zrem Error:', err, name, key);
                throw err;
            }
            finally {
                yield this._pool.release(client);
            }
        });
    }
}
exports.default = Redis78;
//# sourceMappingURL=Redis78.js.map