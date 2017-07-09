const settings = {}

var env = process.env.APP_ENV;
if (env === '' || (typeof env === 'undefined')) {
  env = 'development';
}

var port = process.env.PORT;
if (port === '' || (typeof port === 'undefined')) {
  port = 5000;
}

var mongoUrl = process.env.MONGO_URL;
if (mongoUrl === '' || (typeof mongoUrl === 'undefined')) {
  mongoUrl = 'mongodb://localhost:4000/ticnsp_eaas';
}

var logLevel = process.env.LOG_LEVEL;
if (logLevel === '' || (typeof logLevel === 'undefined')) {
  logLevel = 'info';
}

var utcOffset = process.env.UTC_OFFSET;
if (utcOffset === '' || (typeof utcOffset === 'undefined')) {
  utcOffset = -6;
}

settings.env = env;
settings.port = port;
settings.mongoUrl = mongoUrl;
settings.logLevel = logLevel;
settings.utcOffset = utcOffset;

module.exports = settings;
