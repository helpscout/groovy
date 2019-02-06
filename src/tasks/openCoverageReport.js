const path = require('path')
const open = require('opn')
const pkgUp = require('pkg-up')
const fs = require('fs')

exports.openCoverageReport = async () => {
  console.log('Opening Coverage Report...')

  const pkg = await pkgUp()
  const projectPath = path.dirname(pkg)
  const coveragePath = path.resolve(
    projectPath,
    'coverage',
    'lcov-report',
    'index.html'
  )

  const fileExists = fs.existsSync(coveragePath)

  if (!fileExists) {
    throw new Error(
      'No coverage report found. Ensure your tests can generate one.'
    )
  }

  return open(coveragePath)
}
