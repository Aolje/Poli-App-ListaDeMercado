const sonarqubeScanner = require('sonar-scanner');

sonarqubeScanner(
  {
    serverUrl: 'http://sonarqube:9000',
    token: process.env.SONAR_TOKEN,
    options: {
      'sonar.projectKey': 'mercapp-frontend',
      'sonar.projectName': 'Mercapp Frontend',
      'sonar.sources': 'src',
      'sonar.tests': 'src',
      'sonar.test.inclusions': '**/*.test.js,**/*.test.jsx',
      'sonar.javascript.lcov.reportPaths': 'coverage/lcov.info',

    },
  },
  () => process.exit()
);
