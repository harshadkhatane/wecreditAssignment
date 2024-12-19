package utils

import (
	"fmt"
	"math/rand"
	"time"
)

// GenerateOTP creates a 6-digit random OTP.
func GenerateOTP() string {
	rand.Seed(time.Now().UnixNano()) // Seed the random number generator
	return fmt.Sprintf("%06d", rand.Intn(1000000)) // Generate a 6-digit OTP
}

// IsOTPExpired checks if the OTP has expired.
func IsOTPExpired(expiry time.Time) bool {
	return time.Now().After(expiry)
}
