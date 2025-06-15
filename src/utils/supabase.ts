
/**
 * Supabase client configuration for CanAI Platform
 * TODO: Replace with actual Supabase project credentials
 */

import { createClient } from '@supabase/supabase-js';

// TODO: Replace with actual Supabase URL and anon key
const SUPABASE_URL = process.env.VITE_SUPABASE_URL || 'https://your-project.supabase.co';
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Database schemas as defined in PRD
export interface SessionLog {
  id: string;
  user_id?: string;
  stripe_payment_id?: string;
  interaction_type: string;
  interaction_details: Record<string, any>;
  created_at: string;
}

export interface InitialPromptLog {
  id: string;
  user_id?: string;
  payload: Record<string, any>;
  trust_score?: number;
  other_type?: string;
  custom_tone?: string;
  created_at: string;
}

export interface ErrorLog {
  id: string;
  user_id?: string;
  error_message: string;
  action: string;
  support_request?: boolean;
  error_type: 'timeout' | 'invalid_input' | 'stripe_failure' | 'low_confidence' | 'contradiction' | 'nsfw' | 'token_limit';
  created_at: string;
}

// RLS Policies (to be applied in Supabase dashboard)
/*
-- Enable RLS on session_logs
ALTER TABLE session_logs ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only access their own session logs
CREATE POLICY "User access session_logs" ON session_logs
  USING (auth.uid() = user_id);

-- Policy: Anonymous users can insert session logs
CREATE POLICY "Anonymous insert session_logs" ON session_logs
  FOR INSERT WITH CHECK (true);

-- Enable RLS on initial_prompt_logs
ALTER TABLE initial_prompt_logs ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only access their own prompt logs
CREATE POLICY "User access initial_prompt_logs" ON initial_prompt_logs
  USING (auth.uid() = user_id);

-- Policy: Anonymous users can insert prompt logs
CREATE POLICY "Anonymous insert initial_prompt_logs" ON initial_prompt_logs
  FOR INSERT WITH CHECK (true);

-- Enable RLS on error_logs
ALTER TABLE error_logs ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only access their own error logs
CREATE POLICY "User access error_logs" ON error_logs
  USING (auth.uid() = user_id);

-- Policy: Anonymous users can insert error logs
CREATE POLICY "Anonymous insert error_logs" ON error_logs
  FOR INSERT WITH CHECK (true);

-- Initial prompt logs schema
CREATE TABLE initial_prompt_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  payload JSONB NOT NULL,
  trust_score NUMERIC CHECK (trust_score BETWEEN 0 AND 100),
  other_type TEXT,
  custom_tone TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);
*/

// Helper functions for database operations
export const insertSessionLog = async (log: Omit<SessionLog, 'id' | 'created_at'>) => {
  const { data, error } = await supabase
    .from('session_logs')
    .insert([log])
    .select();
  
  if (error) {
    console.error('[Supabase] Error inserting session log:', error);
    throw error;
  }
  
  return data;
};

export const insertInitialPromptLog = async (log: Omit<InitialPromptLog, 'id' | 'created_at'>) => {
  const { data, error } = await supabase
    .from('initial_prompt_logs')
    .insert([log])
    .select();
  
  if (error) {
    console.error('[Supabase] Error inserting initial prompt log:', error);
    throw error;
  }
  
  return data;
};

export const insertErrorLog = async (log: Omit<ErrorLog, 'id' | 'created_at'>) => {
  const { data, error } = await supabase
    .from('error_logs')
    .insert([log])
    .select();
  
  if (error) {
    console.error('[Supabase] Error inserting error log:', error);
    throw error;
  }
  
  return data;
};

// TODO: Add supabase/vault encryption setup
// https://supabase.com/docs/guides/database/vault
