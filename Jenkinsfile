pipeline {
    agent any

    stages {
        // --- NUEVA ETAPA INICIAL ---
        // Se asegura de que los servicios de soporte (SonarQube) estén corriendo
        stage('Setup Environment') {
            steps {
                script {
                    echo '🔧 Iniciando servicios de soporte (SonarQube)...'
                    // Levanta solo el servicio de sonarqube para que esté disponible
                    sh 'docker-compose up -d sonarqube'
                }
            }
        }

        // ===========================================
        // ETAPA 2: CONSTRUCCIÓN Y PRUEBA DEL BACKEND
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
        // ETAPA 3: CONSTRUCCIÓN Y PRUEBA DEL FRONTEND
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
        // ETAPA 4: ESPERAR A QUE SONARQUBE ESTÉ LISTO
        // ===========================================
        stage('Wait for SonarQube') {
            agent {
                docker {
                    image 'alpine/curl:latest'
                    args '--network mercapp-net'
                }
            }
            steps {
                // --- SOLUCIÓN AQUÍ ---
                // Se cargan las credenciales para que el script de espera también se autentique
                withCredentials([string(credentialsId: 'sonarqube-token', variable: 'SONAR_TOKEN')]) {
                    script {
                        echo '⏳ Esperando a que el servidor de SonarQube esté listo...'
                        // Se modifica el curl para que use el token de autenticación
                        sh '''
                            echo "Intentando contactar a SonarQube en http://sonarqube:9000/api/system/health"
                            timeout=300 # Límite de 5 minutos
                            elapsed=0
                            while true; do
                                response=$(curl -s -w "HTTP_CODE:%{http_code}" -u "${SONAR_TOKEN}:" http://sonarqube:9000/api/system/health)
                                http_code=$(echo "$response" | sed -e 's/.*HTTP_CODE://')
                                body=$(echo "$response" | sed -e 's/HTTP_CODE:.*//')

                                echo "Respuesta de SonarQube - Código HTTP: ${http_code}. Cuerpo: ${body}"
                                
                                if echo "${body}" | grep -q '"status":"UP"'; then
                                    echo "✅ SonarQube está listo!"
                                    break
                                fi

                                elapsed=$((elapsed + 10))
                                if [ ${elapsed} -gt ${timeout} ]; then
                                    echo "❌ Se agotó el tiempo de espera para SonarQube."
                                    exit 1
                                fi

                                echo "Esperando 10 segundos más..."
                                sleep 10
                            done
                        '''
                    }
                }
            }
        }

        // ===========================================
        // ETAPA 5: ANÁLISIS DE CALIDAD
        // ===========================================
        stage('SonarQube Analysis: Backend') {
            agent {
                docker {
                    image 'maven:3.8.5-openjdk-17'
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
        // ETAPA 6: DESPLIEGUE DE LA APLICACIÓN
        // ===========================================
        stage('Deploy Application') {
            steps {
                script {
                    echo '🚀 Desplegando la aplicación con las nuevas imágenes...'
                    // Actualiza solo los servicios de la aplicación, sin tocar SonarQube
                    sh 'docker-compose up -d --build --no-deps backend frontend'
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
