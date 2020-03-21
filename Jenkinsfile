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

	    stage('Build') {		    
            steps {
                echo 'Copying production data to build step'
                sh 'cd "$WORKSPACE"'
                sh 'yarn'
                sh 'yarn build'
            }
	    }

	    stage('PM2 -stop') {
            steps {
                echo 'Stopping...'
                sh 'pm2 stop "api.sulten.se"'
                echo 'Stopped'
            }
	    }

	    stage('Deploy') {
            steps {
                echo 'Clearing possible earlier deployeds artifacts'
                sh 'rm -rf "/var/www/api.sulten.se/"*'

                echo 'Deploying artifact build'
                sh 'cp -r "$WORKSPACE/"* "/var/www/api.sulten.se/"'
            }
	    }

	    stage('PM2 -restart') {		    
            steps {
                echo 'Restarting'
                sh 'pm2 restart "api.sulten.se"'
                echo 'Restarted'
            }
	    }
    }
}