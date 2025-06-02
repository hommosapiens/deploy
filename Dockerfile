# ===== Etapa 1: Build con Maven y JDK 21 =====
FROM maven:3.9.6-eclipse-temurin-21 AS build
WORKDIR /app

# Copiamos toda la carpeta 'prolink-back' (con pom.xml, src/, etc.) al contenedor
COPY prolink-back /app

# Ahora usamos 'mvn' (que ya existe en la imagen base) para compilar
RUN mvn clean package -DskipTests

# ===== Etapa 2: Generar imagen final con JDK 21 =====
FROM eclipse-temurin:21-jdk
WORKDIR /app

# Copiamos el JAR compilado desde la etapa 'build'
COPY --from=build /app/target/prolink-back-0.0.1-SNAPSHOT.jar app.jar

EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
