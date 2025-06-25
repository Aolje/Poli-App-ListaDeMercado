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
            agent {
                docker { 
                    image 'node:18-alpine'
                    args '--network mercapp-net' 
                }
            }
            steps {
                script {
                    dir('frontend/mercappfrontend') {
                        echo '✅ Iniciando construcción del Frontend...'
                        sh 'npm install'
                        sh 'npm test -- --coverage --watchAll=false'
                        sh 'npm run build'
                        echo 'Frontend construido y probado exitosamente.'
                    }
                }
            }
        }


               // ===========================================
        // ETAPA 2.1: ANÁLISIS DE CALIDAD CON SONARQUBE
        // ===========================================-
        // Se añade una pausa para dar tiempo a que SonarQube inicie completamente
        stage('Wait for SonarQube') {
            steps {
                script {
                    echo '⏳ Esperando 30 segundos a que el servidor de SonarQube esté listo...'
                    sh 'sleep 30'
                }
            }
        }
        
        // ===========================================
        // ETAPA 3: ANÁLISIS DE CALIDAD CON SONARQUBE
        // ===========================================
        stage('SonarQube Analysis: Backend') {
            // Se añade un agente de Docker con Maven que se conecta a la red
            agent {
                docker {
                    image 'maven:3.8.5-openjdk-17'
                    // --- SOLUCIÓN AQUÍ ---
                    // Se asegura que este agente también se conecte a la red correcta
                    args '--network mercapp-net'
                }
            }
            steps {
                withCredentials([string(credentialsId: 'sonarqube-token', variable: 'SONAR_TOKEN')]) {
                    script {
                        echo '🔍 Ejecutando análisis de calidad del Backend...'
                        dir('backend/MercappBackend') {
                            sh 'chmod +x mvnw'
                            sh "./mvnw sonar:sonar -Dsonar.login=${SONAR_TOKEN}"
                        }
                    }
                }
            }
        }
        
        stage('SonarQube Analysis: Frontend') {
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
                            sh 'npm install'
                            sh 'apk add --no-cache openjdk17-jre'
                            sh 'chmod +x ./node_modules/.bin/sonar-scanner'
                            sh """
                                ./node_modules/.bin/sonar-scanner \
                                -Dsonar.host.url=http://sonarqube:9000 \
                                -Dsonar.login=${SONAR_TOKEN} \
                                -Dsonar.projectKey=mercapp-frontend \
                                -Dsonar.projectName="Mercapp Frontend" \
                                -Dsonar.sources=src \
                                -Dsonar.tests=src \
                                -Dsonar.test.inclusions="**/*.test.js,**/*.test.jsx" \
                                -Dsonar.javascript.lcov.reportPaths=coverage/lcov.info
                            """
                        }
                    }
                }
            }
        }
        
        // ===========================================
        // ETAPA 4: DESPLIEGUE DE LA APLICACIÓN
        // ===========================================
        stage('Deploy Application') {
            steps {
                script {
                    echo '🚀 Desplegando la aplicación con Docker Compose...'
                    sh 'docker-compose up -d --build'
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
