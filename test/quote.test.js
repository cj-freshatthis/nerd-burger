const assert = require('assert'),
  Quote = require('../models/quote')

describe('Quote', function() {
  describe('Creation', function() {
    it('Should successfully create a new Quote object.', function() {
      let q = new Quote()
      q.text = "This is the quote."
      q.author = "Bob Smith"
      assert.equal(q.text, "This is the quote.")
      assert.equal(q.author, "Bob Smith")
    })
  })
})