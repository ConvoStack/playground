import Redis from 'ioredis';

export const createRedisInstance = (url: string) => {
    // Create a new Redis instance
    const redis = new Redis(url);

    // Related to Upstash issue https://community.fly.io/t/upstash-redis-not-reachable-sometimes/9993
    // and https://community.fly.io/t/upstash-redis-and-could-not-send-http-request-to-instance-connection-error-timed-out-logs/10104
    // Send a PING command every minute
    setInterval(() => {
        redis.ping((error, result) => {
            if (error) {
                console.error('Error sending Redis PING command:', error);
            } else {
                console.log('Received Redis PONG:', result);
            }
        });
    }, 60 * 1000);

    return redis;
}