const assert = require('assert'),
      utils = require('../utils')

describe('Config', () => {
  before(() => {
    utils.loadEnv()
  })

  it('Should load all env variables.', () => {
    assert.equal(process.env.TEST_KEY, 'test_value')
  })
})