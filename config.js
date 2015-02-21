module.exports = {
    port: 3007,
    mongo: {
        connectionString: 'mongodb://localhost/regions',
        collection: 'regions'
    },
    asterisk: {
        agiParamName: 'agi_arg_1',
        resultDialPlanVarName: 'REGION_CODE',
        beep: true
    },
    logger: {
        console: true,
        syslog: {
            host: 'localhost'            
        },
        file: {
            filename: '/var/log/agi-number-archer.log',
            json: false
        }
    }
};