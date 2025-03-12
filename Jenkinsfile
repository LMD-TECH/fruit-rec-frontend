pipeline {
    agent any  

    environment {
        // Définition des variables d'environnement
        REPO_URL = 'https://github.com/lumeida-tech/fruit-rec-frontend.git'
    }

    stages {
        stage('Cloner le code') {
            steps {
                git REPO_URL
            }
        }

        stage('Exécuter les tests') {
            steps {
                bat 'pytest tests/'  // Adapter selon ton framework de test
            }
        }
    }

    post {
        success {
            mail to: 'kfgomina@gmail.com',
                 subject: 'Pipeline réussi 🎉',
                 body: 'Les étapes du pipeline ont été exécutées avec succès !'
        }
        failure {
            mail to: 'kfgomina@gmail.com',
                 subject: 'Échec du pipeline ❌',
                 body: 'Le pipeline Jenkins a échoué. Vérifiez les logs.'
        }
    }
}