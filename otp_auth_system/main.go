package main

import (
	"otp_auth_system/models"
	"otp_auth_system/routes"
	"github.com/gin-gonic/gin"
	"github.com/gin-contrib/cors"
)

func main() {
	// Initialize the database
	models.ConnectDatabase()

	// Run migrations
	models.DB.AutoMigrate(&models.User{})

	// Initialize Gin router
	r := gin.Default()

	// Configure CORS
	r.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:3000"}, // Allow frontend origin
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Authorization"},
		AllowCredentials: true,
	}))

	// Set up routes
	routes.SetupRoutes(r)

	// Start the server
	r.Run(":8080") // Default port
}
