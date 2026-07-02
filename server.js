import app from './backend/app.js';
import cluster from 'cluster';
import debugLib from 'debug';
import http from 'http';
import os from 'os';

const debug = debugLib('server');

process.on('uncaughtException', (err) => {
    console.log(`Uncaught Exception: ${err.message}`);
    process.exit(1);
  });
  
  process.on('unhandledRejection', (err) => {
  
  });

  const normalizePort = val => {
    var port = parseInt(val, 10);
  
    if (isNaN(port)) {
      return val;
    }
  
    if (port >= 0) {
      return port;
    }
  
    return false;
  };

  if(cluster.isPrimary)
    {
        let numCpu = os.cpus().length;

        for(var i=0; i < numCpu; i++)
            {
                cluster.fork();
            }
            cluster.on('online', function (worker) {
                console.log('Worker ' + worker.process.pid + ' is listening');
              });
            
              cluster.on('exit', function (worker, code, signal) {
                console.log('Worker ' + worker.process.pid + ' died with code: ' + code + ', and signal: ' + signal);
                console.log('Starting a new worker');
                cluster.fork();
              });
    }
    else
    {
        const onListening = () => {
            const addr = server.address();
            const bind = typeof port === "string" ? "pipe " + port : "port " + port;
            debug("Listening on " + bind);
          };
        
          const onError = error => {
            if (error.syscall !== "listen") {
              throw error;
            }
            const bind = typeof port === "string" ? "pipe " + port : "port " + port;
            switch (error.code) {
              case "EACCES":
                console.error(bind + " requires elevated privileges");
                process.exit(1);
                break;
              case "EADDRINUSE":
                console.error(bind + " is already in use");
                process.exit(1);
                break;
              default:
                throw error;
            }
          };
        
          const port = normalizePort(process.env.PORT || "3000");
          app.set("port", port);
          const server = http.createServer(app);
          server.on("error", onError);
          server.on("listening", onListening);
          server.listen(port);
    }