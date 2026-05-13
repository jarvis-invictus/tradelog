// Device fingerprinting for single-device session management
// Generates unique device identifiers using multiple browser characteristics

export interface DeviceInfo {
  fingerprint: string
  userAgent: string
  language: string
  timezone: string
  screenResolution: string
  platform: string
}

export function generateDeviceFingerprint(): string {
  // Collect various browser characteristics
  const characteristics = [
    navigator.userAgent,
    navigator.language,
    navigator.platform,
    new Date().getTimezoneOffset().toString(),
    `${screen.width}x${screen.height}`,
    `${screen.colorDepth}`,
    navigator.hardwareConcurrency || 'unknown',
    // @ts-ignore - deviceMemory is experimental and may not be available
    (navigator as any).deviceMemory || 'unknown',
  ]

  // Create a hash from the characteristics
  const fingerprint = characteristics.join('|')
  return btoa(fingerprint).replace(/[^a-zA-Z0-9]/g, '').substring(0, 32)
}

export function getDeviceInfo(): DeviceInfo {
  return {
    fingerprint: generateDeviceFingerprint(),
    userAgent: navigator.userAgent,
    language: navigator.language,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    screenResolution: `${screen.width}x${screen.height}`,
    platform: navigator.platform,
  }
}

export function isSameDevice(fingerprint1: string, fingerprint2: string): boolean {
  return fingerprint1 === fingerprint2
}

// Server-side device validation (for API routes)
export async function validateDeviceSession(
  supabase: any,
  userId: string,
  deviceFingerprint: string
): Promise<{ valid: boolean; needsReauth: boolean }> {
  try {
    const { data: user, error } = await supabase
      .from('users')
      .select('current_device_id, device_fingerprint')
      .eq('id', userId)
      .single()

    if (error || !user) {
      return { valid: false, needsReauth: true }
    }

    // If no device is set, this is a new session
    if (!user.current_device_id) {
      return { valid: true, needsReauth: false }
    }

    // Check if the current device matches the stored device
    const isCurrentDevice = isSameDevice(
      deviceFingerprint,
      user.device_fingerprint || ''
    )

    return {
      valid: isCurrentDevice,
      needsReauth: !isCurrentDevice,
    }
  } catch (error) {
    console.error('Device validation error:', error)
    return { valid: false, needsReauth: true }
  }
}

// Update device information on login
export async function updateDeviceInfo(
  supabase: any,
  userId: string,
  deviceInfo: DeviceInfo
): Promise<void> {
  try {
    await supabase
      .from('users')
      .update({
        current_device_id: deviceInfo.fingerprint,
        device_fingerprint: deviceInfo.fingerprint,
        last_active_at: new Date().toISOString(),
      })
      .eq('id', userId)
  } catch (error) {
    console.error('Failed to update device info:', error)
    throw error
  }
}
