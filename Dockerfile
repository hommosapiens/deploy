# ===== Etapa 1: Build con Maven y JDK 21 =====
FROM maven:3.9.6-eclipse-temurin-21 AS build

# Nos ubicamos en /app dentro del contenedor
WORKDIR /app

# Copiamos solo la carpeta prolink-back (donde están pom.xml, mvnw, .mvn/ y src/)
COPY prolink-back/pom.xml prolink-back/mvnw prolink-back/.mvn /app/
COPY prolink-back/src /app/src

# (Opcional en Linux) Damos permiso de ejecución a mvnw:
RUN chmod +x /app/mvnw

# Ejecutamos Maven desde /app (allí está pom.xml), sin tests
RUN cd /app && ./mvnw clean package -DskipTests

# ===== Etapa 2: Generar imagen final con JDK 21 =====
FROM eclipse-temurin:21-jdk
WORKDIR /app

# Copiamos el JAR compilado en /app de la etapa anterior
COPY --from=build /app/target/prolink-back-0.0.1-SNAPSHOT.jar app.jar

# Exponemos el puerto 8080
EXPOSE 8080

# Arrancamos el JAR
ENTRYPOINT ["java", "-jar", "app.jar"]
