export default class Redis78 {
    _pool: any;
    local: string;
    host: string;
    constructor(config: {});
    pipeGet(): any;
    pipeRelase(pipe: any): Promise<string>;
    clientGet(): any;
    clientRelase(client: any): Promise<string>;
    /**
     * �����������п�
     *
    */
    ltrim(key: string, start: number, end: number): any;
    /**
     *
     * @param key
     * @param value
     * @param sec -1Ϊ����(������Ҫ������)
     */
    set(key: string, value: string | number, sec?: number): any;
    get(key: string, debug?: boolean): any;
    del(key: string): any;
    /**
    * redis list
    * @param key
    * @param value
    */
    llen(key: string): any;
    /**
    * redis list
    * @param key
    * @param value
    */
    sadd(key: string, value: any): any;
    /**
     * redis list
     * @param key
     * @param value
     */
    rpush(key: string, value: any): any;
    /**
     * redis list
     * @param key
     * @param value
     */
    lpush(key: string, value: string | number): any;
    lrange(key: string, start: number, end: number): any;
    /**
    *
    * @param key  redis list key
    *
    */
    lpop(key: string): any;
    /**
    *
    * @param key  redis list key
    *
    */
    scard(key: string): any;
    /**
    *
    * @param key  redis list key
    *
    */
    spop(key: string): any;
    /**
     *
     * @param key  redis list key
     *
     */
    rpop(key: string): any;
    /**
     *  �������򼯺�
     * @param name  ���򼯺ϵ�����
     * @param value ���򼯺ϵ�ֵ
     * @param key   ���򼯺ϵ�key
     */
    zadd(name: string, value: number, key: string): any;
    /**
     *  �����򼯺�ָ����Ա�ķ�����������
     * @param name  ���򼯺ϵ�����
     * @param value ���򼯺ϵ�ֵ
     * @param key   ���򼯺ϵ�key
     */
    zincrby(name: string, value: number, key: string): any;
    /**
     *  ��ȡ���򼯺ϵ�key,value  value����
     * @param name  ���򼯺�����
     * @param start ���򼯺Ͽ�ʼ
     * @param end   ���򼯺Ͻ���
     */
    zrange(name: string, start: number, end: number): any;
    /**
     *  ��ȡ���򼯺ϵ�key,value    value�ݼ�
     * @param name  ���򼯺�����
     * @param start ���򼯺Ͽ�ʼ
     * @param end   ���򼯺Ͻ���
     */
    zrevrange(name: string, start: number, end: number): any;
    /**
     * ��name,key��ȡ���ϵ�ֵ
     * @param name ���ϵ�����
     * @param key  ���ϵ�key
     */
    zscore(name: string, key: string): any;
    /**
     *  ɾ�����򼯺�
     * @param name  ���򼯺�����
     * @param key   ���򼯺ϵ�key
     */
    zrem(name: string, key: string): any;
}
