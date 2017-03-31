# agi-number-archer

NPM for creating AGI server which find concordance of Russian phone number and region code

## Install

> git clone agi-number-archer 

And run

> node app.js



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

see ./config


Errors?!
========

Bugs?! Oh, contact with me. I want to eat them.
