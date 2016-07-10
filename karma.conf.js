const path = require('path');

module.exports = function Testy(config) {
    config.set({
        basePath: '',
        frameworks: ['jasmine-ajax', 'jasmine'],
        files: [{
                pattern: '*.html',
                watched: true,
                included: false,
                served: true
            },
            //'test/tests.webpack.js'
            'app/app.js',
            'test/**/*.spec.js'
        ],

        preprocessors: {
            // 'test/tests.webpack.js': ['webpack']
            '**/app/app.js': ['coverage']
        },
        webpackServer: {
            noInfo: true // please don't spam the console when running in karma!
        },

        plugins: [
            'karma-webpack',
            'karma-jasmine',
            'karma-phantomjs-launcher',
            'karma-chrome-launcher',
            'karma-coverage',
            'karma-jasmine-ajax'
        ],
        reporters: ['progress', 'coverage'],
        coverageReporter: {
            reporters: [{
                type: 'html',
                subdir: 'html'
            }, ],
        },
        customContextFile: 'test/context.html',
        port: 9876,
        colors: true,
        logLevel: config.LOG_INFO,
        autoWatch: true,
        browsers: ['PhantomJS', 'Chrome'], // 'Chrome', 'IE' 'PhantomJS'
        singleRun: false,
    });
};
