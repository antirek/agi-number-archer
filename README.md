# agi-number-archer

AGI server for find concordance of number and region code


Install
=======

# Step 1. Load and install app

> git clone http://github.com/antirek/agi-number-archer

> cd agi-number-archer

> npm install


# Step 2. Load data to mongodb

use npm [numcap-regions](http://github.com/antirek/numcap-regions)


# Step 3. Configure app via *config.js*

set mongodb connectionString and collection


# Step 4. Configure asterisk

write dialplan for using AGI in */etc/asterisk/extensions.conf*

`````
[incoming]
exten => 88001234567,1,Set(incoming_number,${CALLERID(num)})
exten => 88001234567,n,AGI(agi://localhost:3000,${incoming_number})
exten => 88001234567,n,GotoIf($[${REGION_CODE}=24]?Local/krasnoyarsk@queue:)
exten => 88001234567,n,GotoIf($[${REGION_CODE}=50]?Local/moscow@queue:Local/another@queue)

`````

# Step 5. Run app

> node app.js


## More about config.js

`````
{
    port: 3000,   // port
    debug: true,  // show debug info
    mongo: {      // mongo settings
      connectionString: 'mongodb://localhost/test',  
      collection: 'test_insert'
    },
    asterisk: {   // asterisk variables
      agi_param_name: 'agi_arg_1',
      dialplan_var: 'REGION_CODE'  // returned dialplan variable (see installation step 4) 
    }
};


`````


Errors?!
========

Bugs?! Oh, contact with me. I want to eat them.