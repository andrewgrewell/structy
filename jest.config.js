module.exports = {
    transform: {
        '^.+\\.js$': '<rootDir>/node_modules/babel-jest'
    },
    collectCoverage: true,
    coveragePathIgnorePatterns: ['/node_modules/', '/<rootDir>/reports/'],
    coverageReporters: ['lcov'],
    coverageDirectory: './reports/coverage',
    collectCoverageFrom: [
        '**/src/**/*.js',
        '!**/node_modules/**'
    ],
    reporters: ['default', '<rootDir>/node_modules/jest-html-reporter']
};