const cluster = require("cluster");
const os = require("os");

if (cluster.isMaster) {
  const count = os.cpus().length;

  console.log(`master ${process.pid} is running `);

  for (let i = 0; i < Math.min(count, 2); i++) {
    cluster.fork();
  }

  cluster.on("exit", (worker, code, signal) => {
    console.log(`Worker ${worker.process.pid} died`);

    cluster.fork();
  });
} else {
  require("./server");
  console.log(`worker ${process.pid} started`);
}
