# agi-number-archer

AGI server for find concordance of number and region code of Russia


Install
=======

# Step 1. Load and install app

> git clone https://github.com/antirek/agi-number-archer.git

> cd agi-number-archer

> npm install


# Step 2. Load data to mongodb

use npm [numcap-regions](http://github.com/antirek/numcap-regions)


# Step 3. Configure app via *config.js*

set mongodb connectionString and collection


# Step 4. Configure asterisk

write dialplan for using AGI in */etc/asterisk/extensions.conf*

exec AGI right

$host - host with running agi-number-archer

$number - number of caller for check

**exten => extension,priority,AGI(agi://$host:port,$number)**

`````
[incoming]
exten => 88001234567,1,Set(caller_num=${CALLERID(num)})
exten => 88001234567,n,AGI(agi://localhost:3000,${caller_num})
exten => 88001234567,n,GotoIf($[${REGION_CODE}=24]?outbound,krasnoyarsk,1:)
exten => 88001234567,n,GotoIf($[${REGION_CODE}=50]?outbound,moscow,1:outbound,other,1)

`````

# Step 5. Run app

> node app.js


## More about config.js

`````
{
    port: 3000,   // port
    debug: true,  // show debug info
    mongo: {      // mongo settings
      connectionString: 'mongodb://localhost/regions',  
      collection: 'regions'
    },
    asterisk: {   // asterisk variables
      agiParamName: 'agi_arg_1',
      resultDialPlanVarName: 'REGION_CODE',  // returned dialplan variable (see installation step 4)
      beep: false  // enable if want listen when agi work : )
    }
};

`````


Errors?!
========

Bugs?! Oh, contact with me. I want to eat them.
