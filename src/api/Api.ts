import axios from 'axios';

const API_URL = 'https://6612ed0c53b0d5d80f66992e.mockapi.io/customers';

export const fetchClients = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    console.error('Error fetching clients', error);
    throw error;
  }
};

export const updateClient = async (id: string, data: { name: string; avatar: string }) => {
  try {
    const response = await axios.put(`${API_URL}/${id}`, data);
    return response.data;
  } catch (error) {
    console.error('Error updating client', error);
    throw error;
  }
};

export const uploadImage = async (file: File, uploadPreset: string, cloudName: string) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', uploadPreset);

  try {
    const response = await axios.post(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, formData);
    return response.data.secure_url;
  } catch (error) {
    console.error('Error uploading image', error);
    throw error;
  }
};