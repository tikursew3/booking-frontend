#!/bin/bash

echo "📦 Building Spring Boot JAR..."
./mvnw clean package -DskipTests

echo "📁 Copying JAR to project root..."
cp target/booking-0.0.1-SNAPSHOT.jar .

echo "🐳 Building Docker image..."
docker build -t booking-backend .

echo "✅ Done!"
