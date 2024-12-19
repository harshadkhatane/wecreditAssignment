package controllers

import (
	"net/http"
	"otp_auth_system/models"
	"otp_auth_system/utils"
	"time"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func TestDBAccess(c *gin.Context) {
	if models.DB == nil {
		c.JSON(500, gin.H{"error": "Database connection is nil"})
	} else {
		c.JSON(200, gin.H{"message": "Database connection is working"})
	}
}

// RegisterUser registers a new user with a mobile number and device ID
func RegisterUser(c *gin.Context) {
	var input struct {
		Mobile   string `json:"mobile"`
		DeviceID string `json:"device_id"`
	}

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Generate OTP and set expiry time
	otp := utils.GenerateOTP()
	expiry := time.Now().Add(5 * time.Minute)

	var user models.User
	err := models.DB.Where("mobile = ?", input.Mobile).First(&user).Error
	if err == gorm.ErrRecordNotFound {
		// Create new user with fingerprinted device
		user = models.User{
			Mobile:       input.Mobile,
			OTP:          otp,
			OTPExpiresAt: expiry,
			Devices:      []models.Device{{DeviceID: input.DeviceID, LastLoggedIn: time.Now()}}, // Store DeviceID
		}
		models.DB.Create(&user)
	} else if err == nil {
		// Update existing user's OTP and add device if new
		user.OTP = otp
		user.OTPExpiresAt = expiry
		deviceExists := false
		for _, device := range user.Devices {
			if device.DeviceID == input.DeviceID {
				deviceExists = true
				break
			}
		}
		if !deviceExists {
			user.Devices = append(user.Devices, models.Device{DeviceID: input.DeviceID, LastLoggedIn: time.Now()})
		}
		models.DB.Save(&user)
	} else {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Database error"})
		return
	}

	// Simulate sending OTP
	go func() {
		// Add logic to integrate with an SMS gateway
		println("OTP sent:", otp)
	}()

	c.JSON(http.StatusOK, gin.H{"message": "User registered successfully"})
}

// LoginUser authenticates a user using OTP and DeviceID
func LoginUser(c *gin.Context) {
	var input struct {
		Mobile   string `json:"mobile"`
		OTP      string `json:"otp"`
		DeviceID string `json:"device_id"`
	}

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var user models.User
	if err := models.DB.Where("mobile = ?", input.Mobile).First(&user).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
		return
	}

	// If OTP is expired or empty, regenerate a new OTP and send it to the user
	if user.OTP == "" || utils.IsOTPExpired(user.OTPExpiresAt) {
		otp := utils.GenerateOTP()
		user.OTP = otp
		user.OTPExpiresAt = time.Now().Add(5 * time.Minute)
		models.DB.Save(&user)

		// Simulate sending OTP via SMS gateway
		go func() {
			// Logic for sending OTP (SMS gateway)
			println("OTP sent:", otp)
		}()

		c.JSON(http.StatusOK, gin.H{"message": "OTP sent successfully. Please check your mobile."})
		return
	}

	// If OTP is valid but the user hasn't entered it yet, allow them to log in
	// Validate the entered OTP
	if user.OTP != input.OTP {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid OTP"})
		return
	}

	// Check if the device is authorized
	deviceExists := false
	for _, device := range user.Devices {
		if device.DeviceID == input.DeviceID {
			deviceExists = true
			break
		}
	}
	if !deviceExists {
		c.JSON(http.StatusForbidden, gin.H{"error": "Unauthorized device"})
		return
	}

	// Clear OTP after successful login
	user.OTP = ""
	models.DB.Save(&user)

	// Send user details after successful login
	c.JSON(http.StatusOK, gin.H{"message": "Login successful", "user": user})
}

// Resend OTP
func ResendOTP(c *gin.Context) {
	var input struct {
		Mobile string `json:"mobile"`
	}

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var user models.User
	if err := models.DB.Where("mobile = ?", input.Mobile).First(&user).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
		return
	}

	otp := utils.GenerateOTP()
	user.OTP = otp
	user.OTPExpiresAt = time.Now().Add(5 * time.Minute)
	models.DB.Save(&user)

	// Simulate sending OTP
	go func() {
		// Add logic to integrate with an SMS gateway
		println("OTP resent:", otp)
	}()

	c.JSON(http.StatusOK, gin.H{"message": "OTP resent successfully"})
}

// Get current user details after successful login
func GetUserDetails(c *gin.Context) {
    // Extract mobile number from query parameters
    mobile := c.Query("mobile")
    if mobile == "" {
        c.JSON(http.StatusBadRequest, gin.H{"error": "Mobile number is required"})
        return
    }

    // Fetch user from the database
    var user models.User
    if err := models.DB.Where("mobile = ?", mobile).First(&user).Error; err != nil {
        if err == gorm.ErrRecordNotFound {
            c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
        } else {
            c.JSON(http.StatusInternalServerError, gin.H{"error": "Database error"})
        }
        return
    }

    // Hide sensitive data (like OTP)
    user.OTP = ""

    // Respond with the user details
    c.JSON(http.StatusOK, gin.H{
        "user": gin.H{
            "mobile":  user.Mobile,
            "devices": user.Devices, // Ensure devices are serialized correctly
        },
    })
}
