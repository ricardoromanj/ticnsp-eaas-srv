const settings = {};

/* ************************************************************************** */
/* Set up connection to the database, hostname is the only REQUIRED parameter */
/* ************************************************************************** */
var mongoUrl = '';
var mongoHost = process.env.MONGO_HOST;
if (mongoHost === '' || (typeof mongoHost === 'undefined')) {

  /* Error if no hostname for database provided
   * ************************************************************************ */
  console.log('ERROR: MONGO_HOST must be set');
  process.exit(1);
} else {

  /* Default to port 27017 if no port provided
   * ************************************************************************ */
  var mongoPort = process.env.MONGO_PORT;
  if (mongoPort === '' || (typeof mongoPort === 'undefined')) {
    mongoPort = 27017;
  }

  /* Prepare login portion of URL. If either param is missing, default to none
   * ************************************************************************ */
  var mongoUser = process.env.MONGO_USERNAME;
  var mongoPass = process.env.MONGO_PASSWORD;

  var mongoLogin = '';
  if (
    (mongoUser === '' || (typeof mongoUser === 'undefined')) ||
    (mongoPass === '' || (typeof mongoPass === 'undefined'))
  ) {
    mongoLogin = '';
  } else {
    mongoLogin = `${mongoUser}:${mongoPass}@`;
  }

  /* Build final mongo URL
   * ************************************************************************ */
  mongoUrl = `mongodb://${mongoLogin}${mongoHost}:${mongoPort}/ticnsp_eaas`; 
}

var env = process.env.APP_ENV;
if (env === '' || (typeof env === 'undefined')) {
  env = 'development';
}

var port = process.env.PORT;
if (port === '' || (typeof port === 'undefined')) {
  port = 5000;
}

var logLevel = process.env.LOG_LEVEL;
if (logLevel === '' || (typeof logLevel === 'undefined')) {
  logLevel = 'info';
}

var utcOffset = process.env.DEFAULT_UTC_OFFSET;
if (utcOffset === '' || (typeof utcOffset === 'undefined')) {
  utcOffset = -6;
} else {
  utcOffset = parseInt(utcOffset);
}

settings.env = env;
settings.port = port;
settings.mongoUrl = mongoUrl;
settings.logLevel = logLevel;
settings.utcOffset = utcOffset;

module.exports = settings;
