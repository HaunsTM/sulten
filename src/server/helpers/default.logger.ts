import { configure, getLogger } from "log4js";

// log location
const logDir = process.env.LOG_DIR || "logs";
const logFileName = process.env.LOG_FILE || "app.log";
const logFilePath = `${logDir}/${logFileName}`;

// set default log level
const logLevel = process.env.LOG_LEVEL || "debug";

// appenders
configure({
  appenders: {
    console: { type: "stdout", layout: { type: "colored" } },
    dateFile: {
      compress: true,
      daysToKeep: 14,
      filename: logFilePath,
      keepFileExt: true,
      layout: { type: "basic" },
      type: "dateFile",
    },
  },
  categories: {
    default: { appenders: ["console", "dateFile"], level: logLevel },
  },
});

// fetch logger
const logger = getLogger();

export { logger };
