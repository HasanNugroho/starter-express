pipeline {
  agent any

  stages {
    stage('Checkout') {
      steps {
        checkout scm
      }
    }

    stage('Install Dependencies') {
      steps {
        sh 'npm install'
      }
    }

    stage('Test') {
      steps {
        sh 'npm run test' // pastikan ada di package.json
      }
    }

    stage('Build TypeScript') {
      steps {
        sh 'npm run build' // assuming "build": "tsc" ada di scripts
      }
    }

    stage('Build Docker Image') {
      steps {
        sh 'docker build -t starter-express:latest .'
      }
    }

    stage('Deploy') {
      steps {
        sh '''
          pm2 restart app || pm2 start dist/index.js --name app
        '''
      }
    }
  }
}
