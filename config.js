module.exports = {
    port: 3000,
    debug: true,
    mongo: {
    	connectionString: 'mongodb://localhost/regions',
    	collection: 'regions'
    },
    asterisk: {
    	agi_param_name: 'agi_arg_1',
    	dialplan_var: 'REGION_CODE',
        beep: true
    }
};