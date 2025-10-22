const COLORS = {
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  gray: '\x1b[90m',
  reset: '\x1b[0m',
};

const ts = () => new Date().toISOString();

class Logger {
  /**
   * Success/info message
   * @param {string} message
   * @param  {...any} args
   */
  static info(message, ...args) {
    console.log(
      `${COLORS.green}[INFO]${COLORS.reset} ${COLORS.gray}${ts()}${COLORS.reset} - ${message}`,
      ...args
    );
  }

  /**
   * Warning message
   */
  static warn(message, ...args) {
    console.warn(
      `${COLORS.yellow}[WARN]${COLORS.reset} ${COLORS.gray}${ts()}${COLORS.reset} - ${message}`,
      ...args
    );
  }

  /**
   * Error message 
   */
  static err(errOrMsg, ...args) {
    if (errOrMsg instanceof Error) {
      console.error(
        `${COLORS.red}[ERROR]${COLORS.reset} ${COLORS.gray}${ts()}${COLORS.reset} - ${errOrMsg.message}`
      );
      console.error(errOrMsg.stack);
      if (args.length) console.error(...args);
    } else {
      console.error(
        `${COLORS.red}[ERROR]${COLORS.reset} ${COLORS.gray}${ts()}${COLORS.reset} - ${errOrMsg}`,
        ...args
      );
    }
  }
}

const log = Object.freeze({
  info: Logger.info,
  warn: Logger.warn,
  err:  Logger.err,
});

module.exports = log;