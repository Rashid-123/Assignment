const express = require("express");
const { RateLimiterRedis } = require("rate-limiter-flexible");
const Redis = require("ioredis");
const Queue = require("bull");
const cors = require("cors");

const winston = require("winston");

const redisClient = new Redis({
  host: "127.0.0.1",
  port: 6379,
});

/////////// ----------- Rate limiter ------------------

const rateLimiter = new RateLimiterRedis({
  storeClient: redisClient,
  points: 20,
  duration: 60,
  keyPrefix: "rateLimiter",
});

const app = express();
app.use(express.json());
app.use(cors());

const taskQueue = new Queue("user-task", {
  redis: { port: 6379, host: "127.0.0.1" },
});

//////------------------ TASK LOGGING  ----------------------------------
const logger = winston.createLogger({
  transports: [new winston.transports.File({ filename: "task.log" })],
});

async function task(user_id) {
  console.log(`${user_id} - task completed at - ${new Date().toISOString()}`);
  logger.info(`${user_id} - task completed at - ${new Date().toISOString()}`);
}

//------------- RATE LIMITING --------------------------------
app.post("/task", async (req, res) => {
  const userId = req.body.user_id;

  try {
    await rateLimiter.consume(userId, 1);

    taskQueue.add({ userId });
    res.status(200).send({ Message: "Task queued for processing" });
  } catch (rateLimitError) {
    const delay = rateLimitError.msBeforeNext || 1000;
    taskQueue.add({ userId }, { delay });

    res.status(200).send({
      Message: `Rate limit exceeded. Task queued with delay of ${delay}ms`,
    });
  }
});

taskQueue.process(async (job, done) => {
  const { userId } = job.data;
  await task(userId);
  done();
});

app.listen(3000, () => {
  console.log("Server started on port 3000");
});
