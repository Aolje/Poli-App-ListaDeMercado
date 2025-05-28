# Etapa 1: Construcción con Maven
FROM maven:3.9.6-eclipse-temurin-17 AS build
WORKDIR /app

# Copia todos los archivos necesarios para compilar
COPY . .

# Compila el proyecto y genera el .jar
RUN mvn clean package -DskipTests

# Etapa 2: Imagen ligera con Java
FROM eclipse-temurin:17-jdk
WORKDIR /app

# Copia el .jar generado desde el build
COPY --from=build /app/target/*.jar app.jar

# Expone el puerto en el que corre Spring Boot
EXPOSE 8080

# Comando para ejecutar la app
ENTRYPOINT ["java", "-jar", "app.jar"]