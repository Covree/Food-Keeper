# ---------- Build ----------
FROM maven:3.9-eclipse-temurin-21 AS build
WORKDIR /build

# Baixa as dependências primeiro para aproveitar o cache de camadas
COPY pom.xml .
RUN mvn -B dependency:go-offline

COPY src ./src
RUN mvn -B clean package -DskipTests

# ---------- Runtime ----------
FROM eclipse-temurin:21-jre
WORKDIR /app

RUN useradd --system --no-create-home foodkeeper
COPY --from=build /build/target/*.jar app.jar
USER foodkeeper

EXPOSE 8080
ENTRYPOINT ["sh", "-c", "exec java $JAVA_OPTS -jar /app/app.jar"]
