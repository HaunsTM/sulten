pipeline {
    /* https://www.edureka.co/blog/jenkins-pipeline-tutorial-continuous-delivery */
    agent any

    stages {

        stage('Preparing workspace') {
            steps {
                echo 'Copying production data'
                sh 'cp "/srv/jenkins-data-for-production/api.sulten.se/ormconfig.json" "$WORKSPACE/"'
                sh 'cp "/srv/jenkins-data-for-production/api.sulten.se/secretData.json" "$WORKSPACE/"'
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
                sh 'pm2 delete api.sulten.se 2> /dev/null || true && pm2 start /var/www/api.sulten.se/dist/src/server/server.js --name api.sulten.se'
                echo 'Restarted'
            }
	    }
    }
    post {
        cleanup {
            cleanWs()
        }
    }
}