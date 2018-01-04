const assert = require('assert'),
      mongoose = require('mongoose'),
      Quote = require('../models/quote')

const initDatabase = (done) => {
  mongoose.connect('mongodb://127.0.0.1/test')
  let db = mongoose.connection
  db.on('error', console.error.bind(console, 'connection error:'))
  db.once('open', () => {
    // Connection established
    // Clear contents first
    db.db.dropDatabase()
    done()
  })
}

const closeDatabase = (done) => {
  mongoose.connection.close()
  done()
}

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
    initDatabase(done)
  })

  describe('Creation', () => {
    it('Should create a new Quote object.', () => {
      let q = getQuote()
      assert.equal(q.text, 'This is the quote.')
      assert.equal(q.author, 'Bob Smith')
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
          assert.equal(docs[0].author, 'Bob Smith')
          done()
        }
      })
    })
  })

  after((done) => {
    closeDatabase(done)
  })
})