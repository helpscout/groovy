require('any-observable/register/rxjs-all') // eslint-disable-line import/no-unassigned-import
const {merge} = require('rxjs')
const streamToObservable = require('@samverschueren/stream-to-observable')
const {filter} = require('rxjs/operators')
const split = require('split')
const execa = require('execa')

exports.exec = (cmd, args) => {
  // Use `Observable` support if merged https://github.com/sindresorhus/execa/pull/26
  const cp = execa(cmd, args)

  return merge(
    streamToObservable(cp.stdout.pipe(split())),
    streamToObservable(cp.stderr.pipe(split())),
    cp
  ).pipe(filter(Boolean))
}
