const cosmiconfig = require('cosmiconfig')
const {constants} = require('./constants')

exports.getGlobalConfig = () => cosmiconfig(constants.GLOBAL_CONFIG_NAME)
exports.getConfig = () => cosmiconfig(constants.CONFIG_NAME)
