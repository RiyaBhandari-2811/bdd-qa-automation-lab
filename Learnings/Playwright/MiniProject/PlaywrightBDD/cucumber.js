module.exports = {
  default: {
    require: ['features/step_definitions/**/*.js', 'features/support/**/*.js'],
    format: ['progress-bar', 'html:reports/report.html', 'json:reports/report.json'],
    formatOptions: { snippetInterface: 'async-await' }
  },
  smoke: {
    require: ['features/step_definitions/**/*.js', 'features/support/**/*.js'],
    tags: '@smoke',
    format: ['progress-bar']
  }
};
