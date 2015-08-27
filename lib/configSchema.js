'use strict';

var Joi = require('joi');

var ConfigSchema = Joi.object().keys({    
    port: Joi.number().integer().min(1).max(65535).required(),
    asterisk: Joi.object().keys({                
        agiParamName: Joi.string().required(),
        resultDialPlanVarName1: Joi.string().required(),
        resultDialPlanVarName2: Joi.string().required(),
        beep: Joi.boolean().default(false)
    }).required(),
    mongo: Joi.object().keys({ 
        collection: Joi.string().required(),
        connectionString: Joi.string().required(),
    }).required(),
    logger: Joi.object().keys({
        console: Joi.object().keys({
            colorize: Joi.boolean().default(true)
        }),        
        file: Joi.object().keys({
            filename: Joi.string().required(),
            json: Joi.boolean().default(false)
        }),
    })
});

module.exports = ConfigSchema;