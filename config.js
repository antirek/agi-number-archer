module.exports = {
    port: 3000,
    debug: true,
    mongo: {
    	connectionString: 'mongodb://localhost/test',
    	collection: 'test_insert'
    },
    asterisk: {
    	agi_param_name: 'agi_arg_1',
    	dialplan_var: 'REGION_CODE',
        beep: true
    }
};