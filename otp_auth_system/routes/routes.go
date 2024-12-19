package routes

import (
	"otp_auth_system/controllers"
	"github.com/gin-gonic/gin"
)

func SetupRoutes(r *gin.Engine) {
	// Group all API routes under /api
	api := r.Group("/api")
	{
		api.POST("/register", controllers.RegisterUser)
		api.POST("/login", controllers.LoginUser)
		api.POST("/resend-otp", controllers.ResendOTP)
		api.GET("/test-db", controllers.TestDBAccess)
		api.GET("/user-details", controllers.GetUserDetails) // New endpoint for user details
	}
}
