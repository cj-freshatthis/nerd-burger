const assert = require('assert'),
      dotenv = require('dotenv')

describe('Config', () => {
  before(() => {
    dotenv.load()
  })

  it('Should load all env variables.', () => {
    assert.equal(process.env.TEST_KEY, 'test_value')
  })
})