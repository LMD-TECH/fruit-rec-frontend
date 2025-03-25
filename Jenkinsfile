// Déclaration du pipeline Jenkins
pipeline {
    // Exécute le pipeline sur n'importe quel agent (local sur le VPS)
    agent any

    // Variables d'environnement globales
    environment {
        DOCKER_IMAGE = 'fruit-rec-frontend'  // Nom de l'image Docker à construire
        DOCKER_USERNAME = 'lumeidatech'  // Nom d'utilisateur Docker Hub
        DOCKER_CONTAINER = 'fruit-rec-frontend-container'  // Nom du conteneur déployé sur le VPS
        DOCKER_CREDENTIALS = credentials('docker-hub-credentials-id')  // Identifiants Docker Hub
        IMAGE_VERSION = "1.${BUILD_NUMBER}"  // Version dynamique basée sur le numéro de build Jenkins
    }

    // Étapes du pipeline
    stages {
        // Étape 1 : Récupération du code source depuis GitHub
        stage('Checkout') {
            steps {
                // Clone la branche 'main' du dépôt Git
                git branch: 'main', url: 'https://github.com/LMD-TECH/fruit-rec-frontend.git'
            }
        }

        // Étape 2 : Exécution des tests unitaires
        stage('Test') {
            steps {
                script {
                    // Configure un environnement virtuel Python et exécute les tests
                    
                    echo "test en cours" 
                    
                }
            }
        }

        // Étape 3 : Construction de l'image Docker
        stage('Build') {
            steps {
                script {
                    // Construit l'image Docker localement sur le VPS
                    sh 'docker build -t $DOCKER_IMAGE .'
                }
            }
        }

        // Étape 4 : Déploiement de l'image
        stage('Deploy') {
            steps {
                script {
                    // Connexion à Docker Hub
                    sh """
                        # Authentifie le Docker daemon local avec les identifiants Jenkins
                        docker login -u ${DOCKER_CREDENTIALS_USR} -p ${DOCKER_CREDENTIALS_PSW}
                        echo 'Docker login successful'
                    """

                    // Étiquetage de l'image avec la version dynamique
                    sh """
                        # Tag l'image construite pour Docker Hub
                        docker tag $DOCKER_IMAGE $DOCKER_USERNAME/fruit-rec-app:${IMAGE_VERSION}
                    """

                    // Publication sur Docker Hub
                    sh """
                        # Pousse l'image vers Docker Hub
                        docker push $DOCKER_USERNAME/fruit-rec-app:${IMAGE_VERSION}
                    """

                    // Déploiement local sur le VPS
                    sh """
                        # Arrête le conteneur existant s'il existe
                        docker stop $DOCKER_CONTAINER || true
                        # Supprime le conteneur existant
                        docker rm $DOCKER_CONTAINER || true
                        # Lance un nouveau conteneur en mode détaché
                        docker run -d --name $DOCKER_CONTAINER -p 3000:3000 $DOCKER_USERNAME/fruit-rec-api:${IMAGE_VERSION}
                    """
                }
            }
        }
    }
    post {
        success {
            emailext(
                subject: "SUCCESS: Job '${env.JOB_NAME} [${env.BUILD_NUMBER}]'",
                body: """<p>SUCCESS: Job '${env.JOB_NAME} [${env.BUILD_NUMBER}]':</p>
                            <p>Deployed image: $DOCKER_USERNAME/fruit-rec-api:${IMAGE_VERSION}</p>
                            <p>Check console output at <a href="${env.BUILD_URL}">${env.JOB_NAME} [${env.BUILD_NUMBER}]</a></p>""",
                to: 'lumeida.tech@gmail.com,kfgomina@gmail.com, alphaoumar.diallo5@unchk.edu.sn,codeangel223@gmail.com,mallemoussa091@gmail.com',
                mimeType: 'text/html'
            )
        }
        failure {
            emailext(
                subject: "FAILED: Job '${env.JOB_NAME} [${env.BUILD_NUMBER}]'",
                body: """<p>FAILED: Job '${env.JOB_NAME} [${env.BUILD_NUMBER}]':</p>
                            <p>Check console output at <a href="${env.BUILD_URL}">${env.JOB_NAME} [${env.BUILD_NUMBER}]</a></p>""",
                to: 'lumeida.tech@gmail.com,codeangel223@gmail.com,mallemoussa091@gmail.com',
                mimeType: 'text/html'
            )
        }
    }
}