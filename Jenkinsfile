pipeline {
    agent any

    stages {
        // ===========================================
        // ETAPA 1: CONSTRUCCIÓN Y PRUEBA DEL BACKEND
        // ===========================================
        stage('Build & Test Backend') {
            steps {
                script {
                    dir('backend/MercappBackend') {
                        echo '✅ Iniciando construcción del Backend...'
                        sh 'chmod +x mvnw'
                        sh './mvnw clean package'
                        echo 'Backend construido y probado exitosamente.'
                    }
                }
            }
        }

        // ===========================================
        // ETAPA 2: CONSTRUCCIÓN Y PRUEBA DEL FRONTEND
        // ===========================================
        stage('Build & Test Frontend') {
            // ===== AÑADIR ESTE BLOQUE 'AGENT' =====
            // Le dice a Jenkins que ejecute esta etapa en un contenedor con Node.js
            agent {
                docker { image 'node:18-alpine' }
            }
            steps {
                script {
                    dir('frontend/mercappfrontend') {
                        echo '✅ Iniciando construcción del Frontend dentro de un contenedor Node.js...'
                        sh 'npm install'
                        sh 'npm test'
                        sh 'npm run build'
                        echo 'Frontend construido y probado exitosamente.'
                    }
                }
            }
        }

                // ===========================================
        // ETAPA 3: ANÁLISIS DE CALIDAD CON SONARQUBE
        // ===========================================
        stage('SonarQube Analysis') {
            steps {
                // 1. Cargar la credencial de forma segura
                // Busca la credencial con ID 'sonarqube-token' que guardaste en Jenkins.
                // Su valor se carga en una variable de entorno temporal llamada SONAR_TOKEN.
                withCredentials([string(credentialsId: 'sonarqube-token', variable: 'SONAR_TOKEN')]) {
                    script {
                        echo '🔍 Ejecutando análisis de calidad con SonarQube...'

                        // 2. Analizar el Backend
                        // Se ejecuta el comando de Maven y se le pasa el token como 
                        // un parámetro (-Dsonar.login=...).
                        dir('backend/MercappBackend') {
                            sh "./mvnw sonar:sonar -Dsonar.login=${SONAR_TOKEN}"
                        }

                        // 3. Analizar el Frontend
                        // El script 'sonar-project.js' ya sabe que debe buscar la variable
                        // de entorno SONAR_TOKEN que creamos arriba.
                        dir('frontend/mercappfrontend') {
                            sh 'npm install sonar-scanner --save-dev'
                            sh 'node sonar-project.js'
                        }
                    }
                }
            }
        }

        // ===========================================
        // ETAPA 4: CONSTRUCCIÓN DE IMÁGENES DOCKER
        // ===========================================
        stage('Build Docker Images') {
            steps {
                script {
                    echo '🐳 Construyendo imágenes de Docker...'
                    sh 'docker-compose build'
                    echo 'Imágenes de Docker construidas exitosamente.'
                }
            }
        }
             // ===========================================
        // ETAPA 5: DESPLIEGUE DE LA APLICACIÓN
        // ===========================================
        stage('Deploy Application') {
            steps {
                script {
                    echo '🚀 Desplegando la aplicación con Docker Compose...'
                    // ===== Y CAMBIOS AQUÍ =====
                    sh 'docker-compose down'
                    sh 'docker-compose up -d'
                    echo '🎉 Aplicación desplegada exitosamente.'
                }
            }
        }
    }

    post {
        always {
            echo '🧹 Limpiando...'
        }
    }
}