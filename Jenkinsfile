pipeline {
    /* https://www.edureka.co/blog/jenkins-pipeline-tutorial-continuous-delivery */
    agent any
    stages {
        stage('Build') {
            steps {
                echo 'Copying production data'
                sh '#cp "/home/pi/data-for-production/api.sulten.se/ormconfig.json" "$WORKSPACE/"'
                sh 'cd "$WORKSPACE"'
                sh 'ls'
                sh 'yarn'
                sh 'yarn build'
            }
        }
	    stage('Deploy'){
		    
            steps {
                input('Do you want to proceed?')
            }
	    }
        
    }
}