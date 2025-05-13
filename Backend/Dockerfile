FROM openjdk:21-jdk-slim

LABEL authors="yusufokr0"

EXPOSE 8090

WORKDIR /app

# BU RAPOR HATASINI JAR'DA GIDERMEK ICIN. COK DA ÖNEMLI BI SEY DEGIL
ENV JAVA_TOOL_OPTIONS="-Djava.awt.headless=true"

#BU DA FONT HATALARINI GIDERMEK ICIN. YINE COK ÖNEMLI BIR SEY DEGIL
RUN apt-get update && apt-get install -y libfreetype6 fontconfig

COPY target/onlineshop-0.0.1-SNAPSHOT.jar app.jar

ENTRYPOINT ["java", "-jar","app.jar"]