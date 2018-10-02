'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  HPO_SOLR_ENDPOINT: '"/solr/hpo-pl/select"',
  GENOMICS_API_ENDPOINT: '"http://localhost:4000/bodyHPOSearch/saveSearchResults"'
})
