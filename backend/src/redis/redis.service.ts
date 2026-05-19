import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { createClient, RedisClientType } from 'redis';

@Injectable()
export class RedisService implements OnModuleDestroy {
    private client: RedisClientType;

    constructor() {
        this.client = createClient({
            url: `redis://${process.env.REDIS_HOST || 'localhost'}:${process.env.REDIS_PORT || 6379}`,
            password: process.env.REDIS_PASSWORD,
        });

        this.client.connect().catch(console.error);
    }

    async get(key: string): Promise<string | null> {
        return this.client.get(key);
    }

    async set(key: string, value: string, ttl?: number): Promise<void> {
        if (ttl) {
            await this.client.setEx(key, ttl, value);
        } else {
            await this.client.set(key, value);
        }
    }

    async del(key: string): Promise<void> {
        await this.client.del(key);
    }

    async onModuleDestroy() {
        await this.client.quit();
    }
}
