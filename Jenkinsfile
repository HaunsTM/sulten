pipeline {
    /* https://www.edureka.co/blog/jenkins-pipeline-tutorial-continuous-delivery */
    agent any
    stages {
        stage('Preparing workspace') {
            steps {
                echo 'Copying production data'
                sh '#cp "/home/pi/data-for-production/api.sulten.se/ormconfig.json" "$WORKSPACE/"'
                sh 'sudo pm2 stop all'
                sh 'sudo pm2 restart all'
            }
        }
	    stage('Build'){
		    
            steps {
                echo 'Copying production data'
                sh 'cd "$WORKSPACE"'
                sh 'yarn'
                sh 'yarn build'
            }
	    }
	    stage('Deploy'){
		    
            steps {
                echo 'Deploying artifact build'
                echo 'Stopping PM2'
                sh 'sudo pm2 stop all'
                sh 'sudo pm2 restart all'
            }
	    }
        
    }
}