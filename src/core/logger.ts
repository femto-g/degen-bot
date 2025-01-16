import { pino } from "pino";

export const logger = pino({
  formatters: {
    level: (label) => {
      return { level: label.toUpperCase() };
    },
  },
  timestamp: pino.stdTimeFunctions.isoTime,
});
// logger.info("hello world");

// const child = logger.child({ a: "property" });
// child.info("hello child!");
