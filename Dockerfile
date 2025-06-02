# Etapa 1: compilar con Maven y JDK 21
FROM maven:3.9.6-eclipse-temurin-21 AS build
WORKDIR /app

# Copiamos únicamente la carpeta prolink-back dentro de /app para que Maven vea pom.xml
COPY prolink-back/pom.xml prolink-back/mvnw prolink-back/.mvn /app/
COPY prolink-back/src /app/src

# (Opcional) dar permiso de ejecución al wrapper mvnw
RUN chmod +x /app/mvnw || dir /app/mvnw

RUN cd /app && ./mvnw clean package -DskipTests

# Etapa 2: ejecutar el JAR con JDK 21
FROM eclipse-temurin:21-jdk
WORKDIR /app

COPY --from=build /app/target/prolink-back-0.0.1-SNAPSHOT.jar app.jar

EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]