var winston = require('winston');
require('winston-syslog').Syslog;

function Logger (config) {
    if(!config) config = {};

    var logger = new winston.Logger();

    var timeformat = function () {
        return (new Date()).toLocaleString();
    };

    if (config.console){
      logger.add(winston.transports.Console, {
          timestamp: timeformat, 
          colorize: true
      });
    };

    if (config.syslog) {
        config.syslog['timestamp'] = timeformat;        
        logger.add(winston.transports.Syslog, config.syslog.options);
    };

    if (config.file) {
        config.file['timestamp'] = timeformat;        
        logger.add(winston.transports.File, config.file);
    };

    return logger;
};

module.exports = Logger;