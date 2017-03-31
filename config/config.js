module.exports = {
    port: 3000,
    mongo: {
        connectionString: 'mongodb://localhost/regions',
        collection: 'regions'
    },
    asterisk: {
        agiParamName: 'agi_arg_1',
        resultDialPlanVarName1: 'REGION_CODE',
        resultDialPlanVarName2: 'COUNTY_CODE',
        beep: true
    }
};