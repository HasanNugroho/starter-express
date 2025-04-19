pipeline {
  agent any

  environment {
    IMAGE_NAME = "skyhas/starter-express"
    NEW_CONTAINER = "starter-express-new"
    OLD_CONTAINER = "starter-express"
    registryCredential = 'dockerhub_id'
    dockerImage = ''
  }

  stages {

    stage('Checkout') {
      steps {
        git 'https://github.com/HasanNugroho/starter-express.git'
      }
    }

    stage('Install Dependencies') {
      steps {
        sh 'npm install'
      }
    }

    stage('Run Tests') {
      steps {
        sh 'npm run test -- --passWithNoTests'
      }
    }
    
    stage('Run Build') {
      steps {
        sh 'npm run build'
      }
    }

    stage('Build Docker Image') {
      steps {
        script {
          dockerImage = docker.build("${IMAGE_NAME}:latest")
        }
      }
    }

    // Optional: Uncomment to push image
    /*
    stage('Push Docker Image') {
      steps {
        script {
          docker.withRegistry('', registryCredential) {
            dockerImage.push()
          }
        }
      }
    }
    */

    stage('Run Container') {
      steps {
         withCredentials([file(credentialsId: 'starterenv', variable: 'ENV_FILE')]) {
          script {
            // // Copy .env file to workspace
          // sh 'cp $ENV_FILE .env'

            // Run docker-compose up
            sh 'docker-compose down || true'
            sh 'docker-compose --env-file=$ENV_FILE up -d --build'
          }
        }
      }
    }

    stage('Clean Up Docker') {
      steps {
        script {
          sh "docker rmi ${IMAGE_NAME}:latest || true"
        }
      }
    }
  }
}
