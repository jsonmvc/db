'use strict'

const root = process.cwd()
const dbFn = require(`${root}/src/index`)

it('Should test complex node scenarios', () => {
  let doc = {
    foo: {
      bar: {
        baz: 123
      }
    }
  }

  let db = dbFn(doc)

  db.node('/bar', ['/foo/bar'], x => {
    return x
  })

  db.node('/baz', ['/bar'], x => x)


  db.node('/foo/bam', ['/baz'], x => x)

  // console.log(db.db.dynamic.reverseDeps)

  db.on('/bar', x => {
    console.log(x)
  })

  db.patch([{
    op: 'add',
    path: '/foo/bar/baz',
    value: 125
  }])

})
