const assert = require('assert'),
      utils = require('../utils'),
      Quote = require('../models/quote')

const getQuote = () => {
  // Get a default simple quote
  var q = new Quote()
  q.text = "This is the quote."
  q.author = "Bob Smith"
  return q
}

const isEmpty = (obj) => {
  return Object.keys(obj).length === 0
}

describe('Quote', () => {
  before((done) => {
    utils.openDatabase().then(res => {
      done()
    })
  })

  describe('Creation', () => {
    it('Should create a new Quote object.', () => {
      let q = getQuote()
      assert.equal(q.text, 'This is the quote.')
      assert.equal(q.author, 'Bob Smith')
    })

    it('Should convert to a quote string correctly.', () => {
      let q = getQuote()
      assert.equal(q.toQuoteString(), '"This is the quote." - Bob Smith')
    })

    it('Should convert an anonymous quote correctly.', () => {
      let q = new Quote()
      q.text = "This is the quote."
      assert.equal(q.toQuoteString(), '"This is the quote." - Anonymous')
    })
  })

  describe('Saving', () => {
    it('Should save a new Quote object.', (done) => {
      let q = getQuote()
      q.save((err, doc) => {
        if (err) done(err)
        else done()
      })
    })

    it('Should not save an object with missing text.', () => {
      let q = new Quote()
      q.author = 'Bob Smith'
      let error = q.validateSync()
      assert.equal(error.errors['text'].message, 'You must have quote text!')
    })

    it('Should still save an object with missing author.', () => {
      let q = new Quote()
      q.text = "This is the quote."
      assert(! q.validateSync())
    })
  })

  describe('Querying', () => {
    it('Should query recent quotes from the db.', (done) => {
      Quote.find({}, (err, docs) => {
        if (err) done(err)
        else {
          assert(docs.length > 0)
          done()
        }
      })
    })

    it('Should be able to retrieve a random quote from the db.', (done) => {
      utils.getQuote().then(res => {
        assert(res.success)
        done()
      })
    })
  })

  describe('Deletion', () => {
    it('Should be able to delete desired quotes from the db.', (done) => {
      Quote.find().remove({author: 'Bob Smith'}, (err, res) => {
        if (err) done(err)
        else {
          assert.equal(res.ok, 1)
          done()
        }
      })
    })

    it('Should now have an empty database.', (done) => {
      Quote.find({}, (err, docs) => {
        if (err) done(err)
        else {
          assert.equal(docs.length, 0)
          done()
        }
      })
    })
  })

  after((done) => {
    utils.dropDatabase()
    setTimeout(utils.closeDatabase, 3000)
    done()
  })
})