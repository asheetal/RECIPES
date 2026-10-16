const { createEndpointsConfigService } = require('@librechat/api');
const loadDefaultEndpointsConfig = require('./loadDefaultEConfig');
const { getAppConfig } = require('./app');

const { getEndpointsConfig, checkCapability } = createEndpointsConfigService({
  getAppConfig: async (...args) => require('/app/admin-tools/model-access.cjs').overlay(await getAppConfig(...args)),
  loadDefaultEndpointsConfig,
});

module.exports = { getEndpointsConfig, checkCapability };
