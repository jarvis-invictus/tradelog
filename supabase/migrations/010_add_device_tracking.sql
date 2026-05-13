-- Add device tracking for single-device session management
-- M1.2 - Device tracking implementation

ALTER TABLE users 
ADD COLUMN current_device_id text,
ADD COLUMN last_active_at timestamptz default now(),
ADD COLUMN device_fingerprint text;

-- Create index for device tracking queries
CREATE INDEX idx_users_current_device_id ON users(current_device_id);
CREATE INDEX idx_users_last_active_at ON users(last_active_at);

-- Add RLS policy for device tracking updates
CREATE POLICY "users can update own device info"
  ON users FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Function to invalidate other device sessions
CREATE OR REPLACE FUNCTION invalidate_other_device_sessions()
RETURNS TRIGGER AS $$
BEGIN
  -- Sign out all other sessions for this user except current device
  IF NEW.current_device_id IS NOT NULL AND OLD.current_device_id IS NOT NULL AND NEW.current_device_id != OLD.current_device_id THEN
    -- This will be handled by the application layer using Supabase admin functions
    -- The trigger ensures we track device changes
    NEW.last_active_at = now();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for device management
CREATE TRIGGER device_management_trigger
  BEFORE UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION invalidate_other_device_sessions();

-- Add comment for documentation
COMMENT ON COLUMN users.current_device_id IS 'Tracks the currently active device for single-device enforcement';
COMMENT ON COLUMN users.last_active_at IS 'Timestamp of last user activity for session management';
COMMENT ON COLUMN users.device_fingerprint IS 'Unique device fingerprint for device identification';
