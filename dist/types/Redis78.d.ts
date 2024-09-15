import Redis from 'ioredis';
interface Redis78Config {
    port?: number;
    max?: number;
    host?: string;
    local?: string;
    pwd?: string;
}
export default class Redis78 {
    private _pool;
    private local;
    private host;
    constructor(config?: Redis78Config | null);
    pipeGet(): Promise<any | null>;
    pipeRelase(pipe: any): Promise<string>;
    clientGet(): Promise<Redis | null>;
    clientRelase(client: Redis): Promise<string>;
    ltrim(key: string, start: number, end: number): Promise<string>;
    set(key: string, value: string | number, sec?: number): Promise<string>;
    get(key: string, debug?: boolean): Promise<string | null>;
    del(key: string): Promise<number>;
    llen(key: string): Promise<number>;
    sadd(key: string, value: any): Promise<number>;
    rpush(key: string, value: any): Promise<number>;
    lpush(key: string, value: string | number): Promise<number>;
    lrange(key: string, start: number, end: number): Promise<string[]>;
    lpop(key: string): Promise<string | null>;
    scard(key: string): Promise<number>;
    spop(key: string): Promise<string | null>;
    rpop(key: string): Promise<string | null>;
    zadd(name: string, value: number, key: string): Promise<number>;
    zincrby(name: string, value: number, key: string): Promise<number>;
    zrange(name: string, start: number, end: number): Promise<Array<string | number>>;
    zrevrange(name: string, start: number, end: number): Promise<Array<string | number>>;
    zscore(name: string, key: string): Promise<string | null>;
    zrem(name: string, key: string): Promise<number>;
}
export {};
