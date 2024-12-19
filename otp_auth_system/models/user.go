package models

import (
	"database/sql/driver" // For the custom type to work with database/sql
	"encoding/json"       // For JSON marshalling and unmarshalling
	"time"
)

// User model definition
type User struct {
	ID           uint        `gorm:"primaryKey"`
	Mobile       string      `gorm:"unique;not null"`
	OTP          string      `gorm:"size:6"`
	OTPExpiresAt time.Time
	Devices      DeviceList  `gorm:"type:jsonb"` // Custom type for jsonb
	CreatedAt    time.Time
	UpdatedAt    time.Time
}

// Device represents a single device record
type Device struct {
	DeviceID     string    `json:"device_id"` // This will be the fingerprint
	LastLoggedIn time.Time `json:"last_logged_in"`
}

// DeviceList is a custom type for storing an array of devices as JSONB in PostgreSQL
type DeviceList []Device

// Value converts the DeviceList to JSON for storing in the database
func (d DeviceList) Value() (driver.Value, error) {
	return json.Marshal(d)
}

// Scan reads JSON data from the database into the DeviceList
func (d *DeviceList) Scan(value interface{}) error {
	bytes, ok := value.([]byte)
	if !ok {
		return nil
	}
	return json.Unmarshal(bytes, d)
}
