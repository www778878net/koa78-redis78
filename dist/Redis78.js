"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Util = require('util');
const Redis = require('ioredis');
const Pool = require('generic-pool').Pool;
const genericPool = require('generic-pool');
//redis Ӧע���������Ԫ��
class Redis78 {
    constructor(config) {
        this._pool = null;
        this.local = ""; //���ݵص㻮��
        this.host = ""; //redis������
        if (!config)
            return;
        //host: string, pwd: string, local: string, max ?: number
        let port = config["port"] || 6379;
        let max = config["max"] || 100;
        this.host = config["host"] || "127.0.0.1";
        if (this.host == "")
            return;
        this.local = config["local"] || "";
        let pwd = config["pwd"] || "";
        //�ò������ӳ� һ�þͱ���
        //this.client=new MemCache(host+':'+port, {poolSize:500,reconnect:1000,retry:1000});
        let self = this;
        this._pool = genericPool.createPool({
            create: function () {
                //let client = redis.createClient(port, host);
                //if(pwd!="")
                //client.auth(pwd);
                let client;
                if (pwd)
                    client = new Redis({
                        port: port, // Redis port
                        host: self.host, // Redis host
                        family: 4, // 4 (IPv4) or 6 (IPv6)
                        password: pwd,
                        db: 0
                    });
                else
                    client = new Redis(port, self.host);
                return client;
            },
            destroy: function (client) {
                //if (client.connected) {
                try {
                    client.quit();
                }
                catch (err) {
                    console.log('Failed to redis connection: ' + err);
                }
                //}
            }
        }, {
            max: max,
            min: 10,
            idleTimeoutMillis: 3000
        });
    }
    pipeGet() {
        var self = this;
        return new Promise((resolve, reject) => {
            if (self._pool == null) {
                resolve("");
                return;
            }
            self._pool.acquire().then(function (client) {
                resolve(client.pipeline());
            });
        });
    }
    //�����в���
    pipeRelase(pipe) {
        var self = this;
        return new Promise((resolve, reject) => {
            if (self._pool == null) {
                resolve("");
                return;
            }
            self._pool.release(pipe.redis);
            resolve("OK");
        });
    }
    clientGet() {
        var self = this;
        return new Promise((resolve, reject) => {
            if (self._pool == null) {
                resolve("");
                return;
            }
            self._pool.acquire().then(function (client) {
                resolve(client);
            });
        });
    }
    clientRelase(client) {
        var self = this;
        return new Promise((resolve, reject) => {
            if (self._pool == null) {
                resolve("");
                return;
            }
            self._pool.release(client);
            resolve("OK");
        });
    }
    /**
     * �����������п�
     *
    */
    ltrim(key, start, end) {
        var self = this;
        key += self.local;
        return new Promise((resolve, reject) => {
            if (self._pool == null) {
                resolve("");
                return;
            }
            self._pool.acquire().then(function (client) {
                client.ltrim(key, start, end, (err, reply) => {
                    self._pool.release(client);
                    if (err) {
                        reject(err);
                        console.error('redis ltrim Error: ' + err + key);
                        return;
                    }
                    resolve(reply);
                });
            });
        });
    }
    /**
     *
     * @param key
     * @param value
     * @param sec -1Ϊ����(������Ҫ������)
     */
    set(key, value, sec) {
        sec = sec || 86400;
        var self = this;
        key += self.local;
        return new Promise((resolve, reject) => {
            if (self._pool == null) {
                resolve("");
                return;
            }
            self._pool.acquire().then(function (client) {
                client.set(key, value, (err, reply) => {
                    if (sec != -1)
                        client.expire(key, sec);
                    self._pool.release(client);
                    if (err) {
                        reject(err);
                        console.error('redis SetData Error: ' + err + key + value);
                        return;
                    }
                    resolve(reply);
                });
            });
        });
    }
    ;
    get(key, debug) {
        debug = debug || false;
        let self = this;
        key += self.local;
        return new Promise((resolve, reject) => {
            if (self._pool == null) {
                resolve("");
                return;
            }
            self._pool.acquire().then(function (client) {
                client.get(key, (err, reply) => {
                    self._pool.release(client);
                    if (err) {
                        reject(err);
                        console.error('redis GetData Error: ' + err + key);
                        return;
                    }
                    //qq��û�з���undef
                    //if (reply == undefined) reply = null;
                    //unde ��null��������!reply�ж�
                    if (debug) {
                        console.log("redis get:" + key + " value:" + reply);
                    }
                    resolve(reply);
                });
            });
        });
    }
    ;
    del(key) {
        var self = this;
        key += self.local;
        return new Promise((resolve, reject) => {
            if (self._pool == null) {
                resolve("");
                return;
            }
            self._pool.acquire().then(function (client) {
                client.del(key, (err, reply) => {
                    self._pool.release(client);
                    if (err) {
                        reject(err);
                        console.error('redis GetData Error: ' + err + key);
                        return;
                    }
                    resolve(reply);
                });
            });
        });
    }
    /**
    * redis list
    * @param key
    * @param value
    */
    llen(key) {
        var self = this;
        key += self.local;
        return new Promise((resolve, reject) => {
            if (self._pool == null) {
                resolve("");
                return;
            }
            self._pool.acquire().then(function (client) {
                client.llen(key, (err, reply) => {
                    self._pool.release(client);
                    if (err) {
                        reject(err);
                        console.error('redis llen Error: ' + err + key);
                        return;
                    }
                    resolve(reply);
                });
            });
        });
    }
    ;
    /**
    * redis list
    * @param key
    * @param value
    */
    sadd(key, value) {
        var self = this;
        key += self.local;
        return new Promise((resolve, reject) => {
            if (self._pool == null) {
                resolve("");
                return;
            }
            self._pool.acquire().then(function (client) {
                client.sadd(key, value, (err, reply) => {
                    self._pool.release(client);
                    if (err) {
                        reject(err);
                        console.error('redis rpush Error: ' + err + key + value);
                        return;
                    }
                    resolve(reply);
                });
            });
        });
    }
    ;
    /**
     * redis list
     * @param key
     * @param value
     */
    rpush(key, value) {
        var self = this;
        key += self.local;
        return new Promise((resolve, reject) => {
            if (self._pool == null) {
                resolve("");
                return;
            }
            self._pool.acquire().then(function (client) {
                client.rpush(key, value, (err, reply) => {
                    self._pool.release(client);
                    if (err) {
                        reject(err);
                        console.error('redis rpush Error: ' + err + key + value);
                        return;
                    }
                    resolve(reply);
                });
            });
        });
    }
    ;
    /**
     * redis list
     * @param key
     * @param value
     */
    lpush(key, value) {
        var self = this;
        key += self.local;
        return new Promise((resolve, reject) => {
            if (self._pool == null) {
                resolve("");
                return;
            }
            self._pool.acquire().then(function (client) {
                client.lpush(key, value, (err, reply) => {
                    self._pool.release(client);
                    if (err) {
                        reject(err);
                        console.error('redis SetData Error: ' + err + key + value);
                        return;
                    }
                    resolve(reply);
                });
            });
        });
    }
    ;
    lrange(key, start, end) {
        var self = this;
        key += self.local;
        return new Promise((resolve, reject) => {
            if (self._pool == null) {
                resolve("");
                return;
            }
            self._pool.acquire().then(function (client) {
                client.lrange(key, start, end, (err, reply) => {
                    self._pool.release(client);
                    if (err) {
                        reject(err);
                        console.error('redis SetData Error: ' + err + key);
                        return;
                    }
                    resolve(reply);
                });
            });
        });
    }
    /**
    *
    * @param key  redis list key
    *
    */
    lpop(key) {
        var self = this;
        key += self.local;
        return new Promise((resolve, reject) => {
            if (self._pool == null) {
                resolve("");
                return;
            }
            self._pool.acquire().then(function (client) {
                client.lpop(key, (err, reply) => {
                    self._pool.release(client);
                    if (err) {
                        reject(err);
                        console.error('redis lpop Error: ' + err + key);
                        return;
                    }
                    resolve(reply);
                });
            });
        });
    }
    /**
    *
    * @param key  redis list key
    *
    */
    scard(key) {
        var self = this;
        key += self.local;
        return new Promise((resolve, reject) => {
            if (self._pool == null) {
                resolve("");
                return;
            }
            self._pool.acquire().then(function (client) {
                client.scard(key, (err, reply) => {
                    self._pool.release(client);
                    if (err) {
                        reject(err);
                        console.error('redis delrpop Error: ' + err + key);
                        return;
                    }
                    resolve(reply);
                });
            });
        });
    }
    /**
    *
    * @param key  redis list key
    *
    */
    spop(key) {
        var self = this;
        key += self.local;
        return new Promise((resolve, reject) => {
            if (self._pool == null) {
                resolve("");
                return;
            }
            self._pool.acquire().then(function (client) {
                client.spop(key, (err, reply) => {
                    self._pool.release(client);
                    if (err) {
                        reject(err);
                        console.error('redis delrpop Error: ' + err + key);
                        return;
                    }
                    resolve(reply);
                });
            });
        });
    }
    /**
     *
     * @param key  redis list key
     *
     */
    rpop(key) {
        var self = this;
        key += self.local;
        return new Promise((resolve, reject) => {
            if (self._pool == null) {
                resolve("");
                return;
            }
            self._pool.acquire().then(function (client) {
                client.rpop(key, (err, reply) => {
                    self._pool.release(client);
                    if (err) {
                        reject(err);
                        console.error('redis delrpop Error: ' + err + key);
                        return;
                    }
                    resolve(reply);
                });
            });
        });
    }
    /**
     *  �������򼯺�
     * @param name  ���򼯺ϵ�����
     * @param value ���򼯺ϵ�ֵ
     * @param key   ���򼯺ϵ�key
     */
    zadd(name, value, key) {
        var self = this;
        name += self.local;
        return new Promise((resolve, reject) => {
            if (self._pool == null) {
                resolve("");
                return;
            }
            self._pool.acquire().then(function (client) {
                client.zadd(name, value, key, (err, reply) => {
                    self._pool.release(client);
                    if (err) {
                        reject(err);
                        console.error('redis zadd Error: ' + err + name + key + value);
                        return;
                    }
                    resolve(reply);
                });
            });
        });
    }
    /**
     *  �����򼯺�ָ����Ա�ķ�����������
     * @param name  ���򼯺ϵ�����
     * @param value ���򼯺ϵ�ֵ
     * @param key   ���򼯺ϵ�key
     */
    zincrby(name, value, key) {
        var self = this;
        name += self.local;
        return new Promise((resolve, reject) => {
            if (self._pool == null) {
                resolve("");
                return;
            }
            self._pool.acquire().then(function (client) {
                client.zincrby(name, value, key, (err, reply) => {
                    self._pool.release(client);
                    if (err) {
                        reject(err);
                        console.error('redis SetData Error: ' + err + name + key + value);
                        return;
                    }
                    resolve(reply);
                });
            });
        });
    }
    /**
     *  ��ȡ���򼯺ϵ�key,value  value����
     * @param name  ���򼯺�����
     * @param start ���򼯺Ͽ�ʼ
     * @param end   ���򼯺Ͻ���
     */
    zrange(name, start, end) {
        var self = this;
        name += self.local;
        return new Promise((resolve, reject) => {
            if (self._pool == null) {
                resolve("");
                return;
            }
            self._pool.acquire().then(function (client) {
                client.zrange(name, start, end, 'withscores', (err, reply) => {
                    self._pool.release(client);
                    if (err) {
                        reject(err);
                        console.error('redis SetData Error: ' + err + name);
                        return;
                    }
                    resolve(reply);
                });
            });
        });
    }
    /**
     *  ��ȡ���򼯺ϵ�key,value    value�ݼ�
     * @param name  ���򼯺�����
     * @param start ���򼯺Ͽ�ʼ
     * @param end   ���򼯺Ͻ���
     */
    zrevrange(name, start, end) {
        var self = this;
        name += self.local;
        return new Promise((resolve, reject) => {
            if (self._pool == null) {
                resolve("");
                return;
            }
            self._pool.acquire().then(function (client) {
                client.zrevrange(name, start, end, 'withscores', (err, reply) => {
                    self._pool.release(client);
                    if (err) {
                        reject(err);
                        console.error('redis SetData Error: ' + err + name);
                        return;
                    }
                    resolve(reply);
                });
            });
        });
    }
    /**
     * ��name,key��ȡ���ϵ�ֵ
     * @param name ���ϵ�����
     * @param key  ���ϵ�key
     */
    zscore(name, key) {
        var self = this;
        name += self.local;
        return new Promise((resolve, reject) => {
            if (self._pool == null) {
                resolve("");
                return;
            }
            self._pool.acquire().then(function (client) {
                client.zscore(name, key, (err, reply) => {
                    self._pool.release(client);
                    if (err) {
                        reject(err);
                        console.error('redis SetData Error: ' + err + name + key);
                        return;
                    }
                    resolve(reply);
                });
            });
        });
    }
    /**
     *  ɾ�����򼯺�
     * @param name  ���򼯺�����
     * @param key   ���򼯺ϵ�key
     */
    zrem(name, key) {
        var self = this;
        name += self.local;
        return new Promise((resolve, reject) => {
            if (self._pool == null) {
                resolve("");
                return;
            }
            self._pool.acquire().then(function (client) {
                client.zrem(name, key, (err, reply) => {
                    self._pool.release(client);
                    if (err) {
                        reject(err);
                        console.error('redis SetData Error: ' + err + name + key);
                        return;
                    }
                    resolve(reply);
                });
            });
        });
    }
}
exports.default = Redis78;
//# sourceMappingURL=Redis78.js.map