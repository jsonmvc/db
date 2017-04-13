'use strict'

jest.useFakeTimers()

const root = process.cwd()
const dbFn = require(`${root}/src/index`)

it('Should trigger listeners even with falsy values', () => {
  let doc = {}

  let db = dbFn(doc)
  let fn = jest.fn()

  db.on('/bim/baz', fn)
  db.node('/bim', ['/bla'], x => x)
  db.node('/bla', ['/boo'], x => ({ foo: x, baz: x }))

  setTimeout(() => {
    db.patch([{ op: 'add', path: '/boo', value: true }])
  })

  return new Promise((resolve) => {


    jest.runAllTimers()

    expect(fn.mock.calls.length).toBe(1)

    resolve()
  })

})
