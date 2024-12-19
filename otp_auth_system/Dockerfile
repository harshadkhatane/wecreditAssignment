# Step 1: Use an official Golang image as the base image
FROM golang:1.23-alpine

# Step 2: Set the working directory inside the container
WORKDIR /app

# Step 3: Copy go.mod and go.sum files for dependency installation
COPY go.mod go.sum ./

# Step 4: Download dependencies
RUN go mod download

# Step 5: Copy the rest of the application code
COPY . .

# Step 6: Build the application
RUN go build -o otp_auth_system main.go

# Step 7: Expose the port the backend listens on
EXPOSE 8080

# Step 8: Define the command to run the application
CMD ["./otp_auth_system"]
