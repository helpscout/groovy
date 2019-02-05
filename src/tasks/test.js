const Listr = require('listr')
const {exec} = require('../exec')

exports.test = () => {
  const tasks = [
    {
      title: 'Running Tests',
      task: () => exec('npm', ['test']),
    },
  ]

  const command = new Listr(tasks)

  command.run()
}
