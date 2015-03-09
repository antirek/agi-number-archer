module.exports = {
    port: 3007,
    mongo: {
        connectionString: 'mongodb://localhost/regions',
        collection: 'regions'
    },
    asterisk: {
        agiParamName: 'agi_arg_1',
        resultDialPlanVarName1: 'REGION_CODE',
        resultDialPlanVarName2: 'COUNTY_CODE',
        beep: true
    },
    logger: {
        console: {
            colorize: true            
        },
        syslog: {
            host: 'localhost'            
        },
        file: {
            filename: '/var/log/agi-number-archer.log',
            json: false
        }
    }
};