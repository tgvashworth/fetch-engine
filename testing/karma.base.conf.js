var path = require('path')

module.exports = {

  basePath: '../',

  browsers: ['Electron'],

  coverageReporter: {

    dir: 'coverage',

    reporters: [
      { type: 'text' },
      { type: 'lcov', subdir: 'report-lcov' }
    ],

    check: {
      global: {
        statements: 10,
        branches: 10,
        functions: 10,
        lines: 10
      }
    }

  },

  frameworks: ['tap'],

  files: ['dist/*.test.js'],

  preprocessors: {
    'dist/*.test.js': ['webpack']
  },

  reporters: ['progress', 'coverage'],

  singleRun: true,

  webpack: {
    module: {
      preLoaders: [
        // instrument only testing sources with Istanbul
        {
          test: /\.js$/,
          include: path.resolve('dist/*.js'),
          exclude: path.resolve('dist/*.test.js'),
          loader: 'istanbul-instrumenter'
        }
      ]
    },
    node: {
      'fs': 'empty'
    }
  },

  webpackMiddleware: {
    noInfo: true
  }

}
