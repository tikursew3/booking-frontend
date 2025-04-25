# Start from OpenJDK base image
# Use an official OpenJDK 17 image as the base image
FROM eclipse-temurin:17-jdk-alpine

# Set environment variables (optional, can be overridden)
#ENV SPRING_PROFILES_ACTIVE=prod

# Create a non-root user to run the app
RUN addgroup -S spring && adduser -S spring -G spring

# Set work directory
# Set the working directory inside the container
WORKDIR /app

# UPDATED Copy from project root (not target/)
# Copy the Spring Boot JAR file from target to the container
COPY booking-0.0.1-SNAPSHOT.jar app.jar

# Change ownership
# Change file ownership to the non-root user
RUN chown -R spring:spring /app

# Switch to non-root user
USER spring

# Expose the port your Spring Boot app runs on (default is 8080)
EXPOSE 8080

# Run the Spring Boot app
ENTRYPOINT ["java", "-jar", "app.jar"]
