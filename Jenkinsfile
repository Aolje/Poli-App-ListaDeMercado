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
          // Se separó en dos etapas para usar el entorno correcto para cada una

        stage('SonarQube Analysis: Backend') {
            steps {
                withCredentials([string(credentialsId: 'sonarqube-token', variable: 'SONAR_TOKEN')]) {
                    script {
                        echo '🔍 Ejecutando análisis de calidad del Backend...'
                        dir('backend/MercappBackend') {
                            sh "./mvnw sonar:sonar -Dsonar.login=${SONAR_TOKEN}"
                        }
                    }
                }
            }
        }
        
        stage('SonarQube Analysis: Frontend') {
            // Se usa el agente de Docker con Node.js
            agent {
                docker { 
                    image 'node:18-alpine'
                    args '--network mercapp-net'
                }
            }
            steps {
                withCredentials([string(credentialsId: 'sonarqube-token', variable: 'SONAR_TOKEN')]) {
                    script {
                        echo '🔍 Ejecutando análisis de calidad del Frontend...'
                        dir('frontend/mercappfrontend') {
                            // Se ejecuta npm install para tener sonar-scanner disponible
                            sh 'npm install'
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