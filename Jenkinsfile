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

    stage('Build Docker Image') {
      steps {
        dockerImage = docker.build("${IMAGE_NAME}:${BUILD_NUMBER}")
      }
    }
  
    stage('Push Docker Image') {
      steps {
        script{
          docker.withRegistry('', registryCredential) {
              dockerImage.push()  
          }
        }
      }
    }

    // stage('Run New Container') {
    //   steps {
    //     script {
    //       sh """
    //         docker run -d --name $NEW_CONTAINER -p 5001:$APP_PORT --env-file .env $IMAGE_NAME

    //         echo "Waiting for the new container to be ready..."
    //         sleep 5

    //         NEW_CONTAINER_HEALTH=\$(docker inspect --format='{{.State.Running}}' $NEW_CONTAINER || echo 'false')

    //         if [ "\$NEW_CONTAINER_HEALTH" = "true" ]; then
    //           echo "New container is running. Switching..."
    //           docker stop $OLD_CONTAINER || true
    //           docker rm $OLD_CONTAINER || true
    //           docker rename $NEW_CONTAINER $OLD_CONTAINER
    //         else
    //           echo "❌ New container failed to start. Aborting..."
    //           docker rm -f $NEW_CONTAINER
    //           exit 1
    //         fi
    //       """
    //     }
    //   }
    // }
  }
}

