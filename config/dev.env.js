'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  HPO_SOLR_ENDPOINT: '"/solr/hpo-pl/select"'
})
