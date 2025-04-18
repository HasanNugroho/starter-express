pipeline {
  agent any

  environment {
    APP_NAME = "starter-express"
    IMAGE_NAME = "skyhas/starter-express:latest"
    NEW_CONTAINER = "starter-express-new"
    OLD_CONTAINER = "starter-express"
    APP_PORT = "5000"
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
        sh "docker build -t $IMAGE_NAME ."
      }
    }
  
    stage('Push Docker Image') {
      steps {
        sh "docker push $IMAGE_NAME ."
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
