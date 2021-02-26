const winston = require("winston");
const { Loggly } = require("winston-loggly-bulk");
const colors = require("colors");

const { config } = require("../config");

const token = config.logglyFetchToken;
const subdomain = config.logglySubDoming;
const env = config.environment;

if (!token || !subdomain) {
  console.log(
    `Loggly env variables are missing! LOGGLY_SUBDOMAIN is ${subdomain} and LOGGLY_TOKEN is ${token}`
      .underline.red
  );
  return;
}

if (!/development|production|test/.test(env)) {
  console.log(
    `Loggly requires NODE_ENV env variable. Each package utilizes logger must pass NODE_ENV variable. Current NODE_ENV is ${env}`
      .underline.red
  );
  return;
}

const logglyConfig = {
  token,
  subdomain,
  tags: ["Winston-NodeJS"],
  json: true,
};

const withLoggly = new Loggly(logglyConfig);

winston.add(withLoggly);

module.exports = env === "development" ? console.log : winston.log;

/*
    Implementation for Winston file system logger


const winston = require('winston');
const colors = require('colors/safe');

const prodLogger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  defaultMeta: { service: 'user-service' },
  transports: [
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' }),
  ],
});

const devLogger = {
  info: (msg, err = '') => console.log(colors.cyan(msg, err)),
  error: (msg, err = '') => console.log(colors.red(msg, err)),
};

module.exports =
  process.env.NODE_ENV === 'development'
    ? { logger: devLogger }
    : { logger: prodLogger };

    
*/
