import axios from 'axios';

export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Token-based authentication interceptor (runs only in browser)
if (typeof window !== 'undefined') {
  apiClient.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem('authToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );
}

export const GET = async (url, config = {}) => {
  try {
    const cleanedUrl = url.split('?')[0]; // ✅ Strip _rsc or any accidental query
    const response = await apiClient.get(cleanedUrl, config);
    return response.data;
  } catch (error) {
    if (axios.isCancel(error)) {
      console.debug('Request canceled:', error.message);
      throw new Error('Request canceled');
    }
    const errorDetails = {
      message: error.message || 'Unknown error',
      status: error.response?.status || 'No response',
      data: error.response?.data || null,
      url,
      config,
      stack: error.stack,
    };
    console.error('GET request failed:', errorDetails);
    throw new Error(JSON.stringify(errorDetails));
  }
};


export const POST = async (url, data = {}, config = {}) => {
  try {
    const response = await apiClient.post(url, data, config);
    return response.data;
  } catch (error) {
    if (axios.isCancel(error)) {
      console.debug('Request canceled:', error.message);
      throw new Error('Request canceled');
    }
    const errorDetails = {
      message: error.message || 'Unknown error',
      status: error.response?.status || 'No response',
      data: error.response?.data || null,
      url,
      config,
      stack: error.stack,
    };
    console.error('POST request failed:', errorDetails);
    throw new Error(JSON.stringify(errorDetails));
  }
};

export const PUT = async (url, data = {}, config = {}) => {
  try {
    const response = await apiClient.put(url, data, config);
    return response.data;
  } catch (error) {
    if (axios.isCancel(error)) {
      console.debug('Request canceled:', error.message);
      throw new Error('Request canceled');
    }
    const errorDetails = {
      message: error.message || 'Unknown error',
      status: error.response?.status || 'No response',
      data: error.response?.data || null,
      url,
      config,
      stack: error.stack,
    };
    console.error('PUT request failed:', errorDetails);
    throw new Error(JSON.stringify(errorDetails));
  }
};

export const DELETE = async (url, config = {}) => {
  try {
    const response = await apiClient.delete(url, config);
    return response.data;
  } catch (error) {
    if (axios.isCancel(error)) {
      console.debug('Request canceled:', error.message);
      throw new Error('Request canceled');
    }
    const errorDetails = {
      message: error.message || 'Unknown error',
      status: error.response?.status || 'No response',
      data: error.response?.data || null,
      url,
      config,
      stack: error.stack,
    };
    console.error('DELETE request failed:', errorDetails);
    throw new Error(JSON.stringify(errorDetails));
  }
};

// API helper functions for product filters
export const fetchProductsByTag = async (tag, signal) => {
  const url = `/api/v1/customerproducts/filter?tags=${encodeURIComponent(tag)}`;
  return await GET(url, { signal });
};

export const fetchAllTags = async (signal) => {
  const url = `/api/v1/customerproducts/tags`;
  return await GET(url, { signal });
};

// export const fetchFilterOptions = async (signal) => {
//   const url = `/api/v1/customerproducts/filter-options`;
//   return await GET(url, { signal });
// };