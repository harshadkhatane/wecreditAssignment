package main

import (
	"otp_auth_system/models"
	"fmt"
)

func Migrate() {
	err := models.DB.AutoMigrate(&models.User{})
	if err != nil {
		panic("Failed to migrate database schema")
	}
	fmt.Println("Database migrated successfully")
}
