const path = require('path')
const open = require('opn')
const fs = require('fs')
const {getProjectPath} = require('../utils')

exports.openCoverageReport = async () => {
  console.log('Opening Coverage Report...')

  const projectPath = await getProjectPath()
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
