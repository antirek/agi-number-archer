module.exports = {
    port: 3000,
    debug: true,
    mongo: {
    	connectionString: 'mongodb://localhost/regions',
    	collection: 'regions'
    },
    asterisk: {
    	agiParamName: 'agi_arg_1',
    	resultDialPlanVarName: 'REGION_CODE',
        beep: true
    }
};