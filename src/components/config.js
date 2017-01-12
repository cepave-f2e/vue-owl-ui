const config = (cfgs = {}) => {
  Object.keys(cfgs).forEach((key) => {
    config[key] = cfgs[key]
  })
}

// config.colorPrimary = '#8962d9'

module.exports = config
