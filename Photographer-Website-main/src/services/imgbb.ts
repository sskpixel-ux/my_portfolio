export const IMGBB_API_KEY = '1c0fd2ec247dd5a22c16a8cbc2cc6773';

export interface ImgBBUploadResponse {
  success: boolean;
  url: string;
  displayUrl: string;
  thumbUrl: string;
  deleteUrl?: string;
  error?: string;
}

/**
 * Uploads an image file or blob directly to ImgBB CDN
 * Returns permanent high-resolution CDN URLs
 */
export async function uploadToImgBB(file: File | Blob, name?: string): Promise<ImgBBUploadResponse> {
  const formData = new FormData();
  formData.append('image', file);
  if (name) {
    formData.append('name', name);
  }

  try {
    const response = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, {
      method: 'POST',
      body: formData,
    });

    const data = await response.json();

    if (data.success && data.data) {
      return {
        success: true,
        url: data.data.url,
        displayUrl: data.data.display_url || data.data.url,
        thumbUrl: data.data.thumb?.url || data.data.display_url || data.data.url,
        deleteUrl: data.data.delete_url,
      };
    } else {
      const errorMsg = data.error?.message || 'Failed to upload image to ImgBB';
      console.error('ImgBB error:', data);
      return {
        success: false,
        url: '',
        displayUrl: '',
        thumbUrl: '',
        error: errorMsg,
      };
    }
  } catch (err: any) {
    console.error('ImgBB network error:', err);
    return {
      success: false,
      url: '',
      displayUrl: '',
      thumbUrl: '',
      error: err.message || 'Network error while contacting ImgBB API',
    };
  }
}
