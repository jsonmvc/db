'use strict'

let db

beforeEach(() => {
  db = require('./../../src/index')()
})

it('simple get', () => {

  db.patch({
    op: 'add',
    path: '/a/b',
    value: '123'
  })

  expect(db.get('/a/b')).toBe('123')
})
