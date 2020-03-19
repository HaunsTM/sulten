pipeline {
    /* https://www.edureka.co/blog/jenkins-pipeline-tutorial-continuous-delivery */
    agent any
    stages {
        stage('Preparing workspace') {
            steps {
                echo 'Copying production data'
                sh 'cp "/home/pi/data-for-production/api.sulten.se/ormconfig.json" "$WORKSPACE/"'
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
                sh 'cp -r "$WORKSPACE/dist/server/." "/var/www/api.sulten.se"'
            }
	    }        
    }
}