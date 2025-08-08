import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Helper function to get user from Supabase auth
export async function getSupabaseUser() {
  const { data: { user }, error } = await supabase.auth.getUser()
  if (error) {
    console.error('Error getting user:', error)
    return null
  }
  return user
}

// Helper function to check if user is authenticated
export async function isAuthenticated() {
  const user = await getSupabaseUser()
  return !!user
}

// Helper function to get public URL for Supabase Storage files
export function getStorageUrl(path: string, isPreview: boolean = false): string {
  if (!path) return ''
  
  // If it's already a full URL, return as is
  if (path.startsWith('http')) {
    return path
  }
  
  // If the path already includes the bucket/folder structure, use it directly
  if (path.startsWith('tickets/')) {
    const cleanPath = path.replace(/^\/+/, '')
    // Remove duplicate supporting-files folder if it exists
    const fixedPath = cleanPath.replace(/supporting-files\/supporting-files\//, 'supporting-files/')
    const baseUrl = `${supabaseUrl}/storage/v1/object/public/${fixedPath}`
    
    // Add image optimization parameters for previews
    if (isPreview) {
      const fileExtension = path.split('.').pop()?.toLowerCase()
      const isImage = ['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(fileExtension || '')
      if (isImage) {
        return `${baseUrl}?width=200&height=200&quality=60&format=webp`
      }
    }
    
    return baseUrl
  }
  
  // If it's just a filename, add the folder structure
  const bucketName = 'tickets'
  const folderName = 'supporting-files'
  const cleanPath = path.replace(/^\/+/, '')
  
  const baseUrl = `${supabaseUrl}/storage/v1/object/public/${bucketName}/${folderName}/${cleanPath}`
  
  // Add image optimization parameters for previews
  if (isPreview) {
    const fileExtension = cleanPath.split('.').pop()?.toLowerCase()
    const isImage = ['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(fileExtension || '')
    if (isImage) {
      return `${baseUrl}?width=200&height=200&quality=60&format=webp`
    }
  }
  
  // Debug logging
  console.log('getStorageUrl input:', path)
  console.log('getStorageUrl constructed URL:', baseUrl)
  
  return baseUrl
} 