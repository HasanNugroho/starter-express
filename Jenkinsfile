pipeline {
  agent any

  environment {
    IMAGE_NAME = "skyhas/starter-express"
    NEW_CONTAINER = "starter-express-new"
    OLD_CONTAINER = "starter-express"
    PORT = "5005"
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

    stage('Build Docker Image') {
      steps {
        script {
          dockerImage = docker.build("${IMAGE_NAME}:latest")
        }
      }
    }

    stage('Generate .env from Jenkins Credentials') {
      steps {
        withCredentials([file(credentialsId: 'starterenv', variable: 'ENV_FILE')]) {
          sh """
            docker stop ${OLD_CONTAINER} || true
            docker rm ${OLD_CONTAINER} || true
            docker run -d --name ${OLD_CONTAINER} \\
              -p ${PORT}:${PORT} \\
              --env-file \$ENV_FILE \\
              --network docker_default \\
              ${IMAGE_NAME}:latest
          """
        }
      }
    }

    stage('Docker Compose Up') {
      steps {
        sh 'docker-compose up -d --build'
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
        script {
          sh """
            docker stop ${OLD_CONTAINER} || true
            docker rm ${OLD_CONTAINER} || true
            source .env
            docker run -d --name ${OLD_CONTAINER} \\
              -p \$PORT:\$PORT \\
              --env-file .env \\
              --network docker_default \\
              ${IMAGE_NAME}:latest
          """
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
