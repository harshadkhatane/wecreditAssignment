import FingerprintJS from '@fingerprintjs/fingerprintjs';

// Function to get the device fingerprint (device ID)
export const getDeviceId = async () => {
  const fp = await FingerprintJS.load();
  const result = await fp.get();
  return result.visitorId;  // This is the unique device ID
};
