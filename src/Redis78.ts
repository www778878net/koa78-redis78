import Redis, { Pipeline } from 'ioredis';
import { Pool, createPool } from 'generic-pool';

interface Redis78Config {
    port?: number;
    max?: number;
    host?: string;
    local?: string;
    pwd?: string;
}

export default class Redis78 {
    private _pool: Pool<Redis> | null = null;
    private local: string = "";
    private host: string = "";

    constructor(config: Redis78Config | null = {}) {
        if (config === null) {
            console.warn("Null config provided. Redis78 instance may not function correctly.");
            return;
        }

        const port = config.port ?? 6379;
        const max = config.max ?? 100;
        this.host = config.host ?? "127.0.0.1";
        this.local = config.local ?? "";
        const pwd = config.pwd ?? "";

        this._pool = createPool({
            create: async () => {
                let client: Redis;
                if (pwd) {
                    client = new Redis({
                        port,
                        host: this.host,
                        family: 4,
                        password: pwd,
                        db: 0
                    });
                } else {
                    client = new Redis(port, this.host);
                }
                return client;
            },
            destroy: async (client: Redis) => {
                try {
                    await client.quit();
                } catch (err) {
                    console.log('Failed to close redis connection: ' + err);
                }
            }
        }, {
            max,
            min: 10,
            idleTimeoutMillis: 3000
        });
    }

    async pipeGet(): Promise<any | null> {
        if (!this._pool) return null;
        const client = await this._pool.acquire();
        return client.pipeline();
    }

    async pipeRelase(pipe: any): Promise<string> {
        if (!this._pool) return "";
        if (pipe.redis instanceof Redis) {
            await this._pool.release(pipe.redis);
        } else {
            console.error('Unexpected redis instance type in pipeline');
        }
        return "OK";
    }

    async clientGet(): Promise<Redis | null> {
        if (!this._pool) return null;
        return await this._pool.acquire();
    }

    async clientRelase(client: Redis): Promise<string> {
        if (!this._pool) return "";
        await this._pool.release(client);
        return "OK";
    }

    async ltrim(key: string, start: number, end: number): Promise<string> {
        key += this.local;
        if (!this._pool) return "";

        const client = await this._pool.acquire();
        try {
            const reply = await client.ltrim(key, start, end);
            return reply;
        } catch (err) {
            console.error('redis ltrim Error:', err, key);
            throw err;
        } finally {
            await this._pool.release(client);
        }
    }

    async set(key: string, value: string | number, sec: number = 86400): Promise<string> {
        key += this.local;
        if (!this._pool) return "";

        const client = await this._pool.acquire();
        try {
            const reply = await client.set(key, value);
            if (sec !== -1) {
                await client.expire(key, sec);
            }
            return reply;
        } catch (err) {
            console.error('redis SetData Error:', err, key, value);
            throw err;
        } finally {
            await this._pool.release(client);
        }
    }

    async get(key: string, debug: boolean = false): Promise<string | null> {
        key += this.local;
        if (!this._pool) return null;

        const client = await this._pool.acquire();
        try {
            const reply = await client.get(key);
            if (debug) {
                console.log("redis get:", key, "value:", reply);
            }
            return reply;
        } catch (err) {
            console.error('redis GetData Error:', err, key);
            throw err;
        } finally {
            await this._pool.release(client);
        }
    }

    async del(key: string): Promise<number> {
        key += this.local;
        if (!this._pool) return 0;

        const client = await this._pool.acquire();
        try {
            const reply = await client.del(key);
            return reply;
        } catch (err) {
            console.error('redis DelData Error:', err, key);
            throw err;
        } finally {
            await this._pool.release(client);
        }
    }

    async llen(key: string): Promise<number> {
        key += this.local;
        if (!this._pool) return 0;

        const client = await this._pool.acquire();
        try {
            const reply = await client.llen(key);
            return reply;
        } catch (err) {
            console.error('redis llen Error:', err, key);
            throw err;
        } finally {
            await this._pool.release(client);
        }
    }

    async sadd(key: string, value: any): Promise<number> {
        key += this.local;
        if (!this._pool) return 0;

        const client = await this._pool.acquire();
        try {
            const reply = await client.sadd(key, value);
            return reply;
        } catch (err) {
            console.error('redis sadd Error:', err, key, value);
            throw err;
        } finally {
            await this._pool.release(client);
        }
    }

    async rpush(key: string, value: any): Promise<number> {
        key += this.local;
        if (!this._pool) return 0;

        const client = await this._pool.acquire();
        try {
            const reply = await client.rpush(key, value);
            return reply;
        } catch (err) {
            console.error('redis rpush Error:', err, key, value);
            throw err;
        } finally {
            await this._pool.release(client);
        }
    }

    async lpush(key: string, value: string | number): Promise<number> {
        key += this.local;
        if (!this._pool) return 0;

        const client = await this._pool.acquire();
        try {
            const reply = await client.lpush(key, value);
            return reply;
        } catch (err) {
            console.error('redis lpush Error:', err, key, value);
            throw err;
        } finally {
            await this._pool.release(client);
        }
    }

    async lrange(key: string, start: number, end: number): Promise<string[]> {
        key += this.local;
        if (!this._pool) return [];

        const client = await this._pool.acquire();
        try {
            const reply = await client.lrange(key, start, end);
            return reply;
        } catch (err) {
            console.error('redis lrange Error:', err, key);
            throw err;
        } finally {
            await this._pool.release(client);
        }
    }

    async lpop(key: string): Promise<string | null> {
        key += this.local;
        if (!this._pool) return null;

        const client = await this._pool.acquire();
        try {
            const reply = await client.lpop(key);
            return reply;
        } catch (err) {
            console.error('redis lpop Error:', err, key);
            throw err;
        } finally {
            await this._pool.release(client);
        }
    }

    async scard(key: string): Promise<number> {
        key += this.local;
        if (!this._pool) return 0;

        const client = await this._pool.acquire();
        try {
            const reply = await client.scard(key);
            return reply;
        } catch (err) {
            console.error('redis scard Error:', err, key);
            throw err;
        } finally {
            await this._pool.release(client);
        }
    }

    async spop(key: string): Promise<string | null> {
        key += this.local;
        if (!this._pool) return null;

        const client = await this._pool.acquire();
        try {
            const reply = await client.spop(key);
            return reply;
        } catch (err) {
            console.error('redis spop Error:', err, key);
            throw err;
        } finally {
            await this._pool.release(client);
        }
    }

    async rpop(key: string): Promise<string | null> {
        key += this.local;
        if (!this._pool) return null;

        const client = await this._pool.acquire();
        try {
            const reply = await client.rpop(key);
            return reply;
        } catch (err) {
            console.error('redis rpop Error:', err, key);
            throw err;
        } finally {
            await this._pool.release(client);
        }
    }

    async zadd(name: string, value: number, key: string): Promise<number> {
        name += this.local;
        if (!this._pool) return 0;

        const client = await this._pool.acquire();
        try {
            const reply = await client.zadd(name, value, key);
            return reply;
        } catch (err) {
            console.error('redis zadd Error:', err, name, key, value);
            throw err;
        } finally {
            await this._pool.release(client);
        }
    }

    async zincrby(name: string, value: number, key: string): Promise<number> {
        name += this.local;
        if (!this._pool) return 0;

        const client = await this._pool.acquire();
        try {
            const reply = await client.zincrby(name, value, key);
            return parseFloat(reply);
        } catch (err) {
            console.error('redis zincrby Error:', err, name, key, value);
            throw err;
        } finally {
            await this._pool.release(client);
        }
    }

    async zrange(name: string, start: number, end: number): Promise<Array<string | number>> {
        name += this.local;
        if (!this._pool) return [];

        const client = await this._pool.acquire();
        try {
            const reply = await client.zrange(name, start, end, 'WITHSCORES');
            return reply;
        } catch (err) {
            console.error('redis zrange Error:', err, name);
            throw err;
        } finally {
            await this._pool.release(client);
        }
    }

    async zrevrange(name: string, start: number, end: number): Promise<Array<string | number>> {
        name += this.local;
        if (!this._pool) return [];

        const client = await this._pool.acquire();
        try {
            const reply = await client.zrevrange(name, start, end, 'WITHSCORES');
            return reply;
        } catch (err) {
            console.error('redis zrevrange Error:', err, name);
            throw err;
        } finally {
            await this._pool.release(client);
        }
    }

    async zscore(name: string, key: string): Promise<string | null> {
        name += this.local;
        if (!this._pool) return null;

        const client = await this._pool.acquire();
        try {
            const reply = await client.zscore(name, key);
            return reply;
        } catch (err) {
            console.error('redis zscore Error:', err, name, key);
            throw err;
        } finally {
            await this._pool.release(client);
        }
    }

    async zrem(name: string, key: string): Promise<number> {
        name += this.local;
        if (!this._pool) return 0;

        const client = await this._pool.acquire();
        try {
            const reply = await client.zrem(name, key);
            return reply;
        } catch (err) {
            console.error('redis zrem Error:', err, name, key);
            throw err;
        } finally {
            await this._pool.release(client);
        }
    }
}