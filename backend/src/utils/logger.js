import fs from "fs";
import path from "path";
import config from "../config/config.js";

// ✅ Absolute logs directory (safe for all environments)
const logsDir = path.join(process.cwd(), "logs");

// ✅ Ensure logs directory exists
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

// ✅ Prevent wrong config like "logs/app.log"
const logFileName = path.basename(config.logging.file || "app.log");
const logFilePath = path.join(logsDir, logFileName);

// ✅ Log levels
const levels = {
  error: 0,
  warn: 1,
  info: 2,
  debug: 3,
};

// ✅ Console colors
const colors = {
  error: "\x1b[31m",   // Red
  warn: "\x1b[33m",    // Yellow
  info: "\x1b[36m",    // Cyan
  debug: "\x1b[35m",   // Magenta
  reset: "\x1b[0m",
};

class Logger {
  constructor(moduleName = "APP") {
    this.moduleName = moduleName;
    this.currentLevel = levels[config.logging.level] ?? levels.info;
  }

  log(level, message, meta = {}) {
    if (levels[level] > this.currentLevel) return;

    const timestamp = new Date().toISOString();

    const logEntry = {
      timestamp,
      module: this.moduleName,
      level,
      message,
      ...meta,
    };

    const logMessage = `[${timestamp}] [${this.moduleName}] [${level.toUpperCase()}]: ${message}`;

    // ✅ Console output
    console.log(
      `${colors[level]}${logMessage}${colors.reset}`,
      Object.keys(meta).length ? meta : ""
    );

    // ✅ File output
    this.writeToFile(logEntry);
  }

  writeToFile(logEntry) {
    try {
      fs.appendFileSync(logFilePath, JSON.stringify(logEntry) + "\n");
    } catch (error) {
      console.error("❌ Failed to write log:", error);
    }
  }

  error(message, meta = {}) {
    this.log("error", message, meta);
  }

  warn(message, meta = {}) {
    this.log("warn", message, meta);
  }

  info(message, meta = {}) {
    this.log("info", message, meta);
  }

  debug(message, meta = {}) {
    this.log("debug", message, meta);
  }
}

export default Logger;