pipeline {
    /* https://www.edureka.co/blog/jenkins-pipeline-tutorial-continuous-delivery */
    agent any
    stages {
        stage('Build') {
                steps {
                        echo 'Hi, this is Zulaikha from edureka'			
                }
            steps {
                echo 'Hi, this is Zulaikha from edureka'
                sh 'cp /home/pi/data-for-production/api.sulten.se/ormconfig.json $WORKSPACE/ormconfig.json'
                sh 'cd $WORKSPACE/ormconfig.json'
                sh 'ls'
            }
        }
	    stage('Deploy'){
		    
            steps {
                input('Do you want to proceed?')
            }
	    }
        
    }
}