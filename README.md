# agi-number-archer

NPM for creating AGI server which find concordance of Russian phone number and region code

## Install

> npm install agi-number-archer --save

## Use

Create app.js
`````
var config = require('./config');
var AgiNumberArcher = require('agi-number-archer');

var archer = new AgiNumberArcher(config);
archer.start();
`````
And run

> node app.js

## More fast?

Clone and use [agi-number-archer-app](http://github.com/antirek/agi-number-archer-app)



## Configure asterisk

write dialplan for using AGI in */etc/asterisk/extensions.conf*

exec AGI right

$host - host with running agi-number-archer

$number - number of caller for check

**exten => extension,priority,AGI(agi://$host:port,$number)**

Sample dialplan

`````
[incoming]
exten => 88001234567,n,AGI(agi://localhost:3000,${CALLERID(num)})
exten => 88001234567,n,GotoIf($[${REGION_CODE}=24]?outbound,krasnoyarsk,1:)
exten => 88001234567,n,GotoIf($[${REGION_CODE}=50]?outbound,moscow,1:outbound,other,1)
`````
or

`````
[incoming]
exten => 88001234567,n,AGI(agi://localhost:3000,${CALLERID(num))
exten => 88001234567,n,GotoIf($[${COUNTY_CODE}=5]?outbound,krasnoyarsk,1:)
exten => 88001234567,n,GotoIf($[${COUNTY_CODE}=1]?outbound,moscow,1:outbound,other,1)
`````



## Sample config.js

`````
{
    port: 3000,         // port
    debug: true,        // show debug info
    mongo: {            // mongo settings
      connectionString: 'mongodb://localhost/regions',  
      collection: 'regions'
    },
    asterisk: {         // asterisk variables
      agiParamName: 'agi_arg_1',
      resultDialPlanVarName1: 'REGION_CODE',    // returned dialplan variable REGION_CODE
      resultDialPlanVarName2: 'COUNTY_CODE',    // returned dialplan variable COUNTY_CODE
      beep: false       // enable if want listen when agi work : )
    },
    logger: {           //write log use npm winston
        console: {            //to console
            colorize: true            
        },
        syslog: {             //to syslog
            host: 'localhost'            
        },
        file: {               //to file
            filename: '/var/log/agi-number-archer.log',
            json: false
        }
    }
};

`````


Errors?!
========

Bugs?! Oh, contact with me. I want to eat them.
