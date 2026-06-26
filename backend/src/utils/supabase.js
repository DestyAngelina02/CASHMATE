import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

// Initialize Supabase client (dummy if not set, to prevent crash on boot)
export const supabase = createClient(
  supabaseUrl || 'https://dummy.supabase.co',
  supabaseKey || 'dummy'
);

export const uploadToSupabase = async (fileBuffer, originalName, mimeType, bucketName = 'uploads') => {
  if (!supabaseUrl || !supabaseKey) {
     throw new Error('Supabase URL & Key are not configured');
  }

  // Generate unique filename
  const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
  const ext = originalName.split('.').pop();
  const fileName = `${uniqueSuffix}.${ext}`;

  const { data, error } = await supabase.storage
    .from(bucketName)
    .upload(fileName, fileBuffer, {
      contentType: mimeType,
      upsert: false
    });

  if (error) {
    throw new Error(`Failed to upload to Supabase: ${error.message}`);
  }

  const { data: publicUrlData } = supabase.storage
    .from(bucketName)
    .getPublicUrl(fileName);

  return publicUrlData.publicUrl;
};

export const deleteFromSupabase = async (fileUrl, bucketName = 'uploads') => {
  if (!fileUrl || !supabaseUrl || !supabaseKey) return;
  
  try {
    // Extract filename from URL
    const urlParts = fileUrl.split('/');
    const fileName = urlParts[urlParts.length - 1];
    
    await supabase.storage.from(bucketName).remove([fileName]);
  } catch (error) {
    console.error('Failed to delete file from Supabase:', error);
  }
};
