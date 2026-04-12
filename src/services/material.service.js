import api from './api';

const getMaterialsByCourse = async (courseId) => {
  const response = await api.get(`/materials/course/${courseId}`);
  return response.data;
};

const createMaterial = async (materialData) => {
  const formData = new FormData();
  formData.append('name', materialData.name);
  formData.append('courseId', materialData.courseId);
  if (materialData.description) formData.append('description', materialData.description);
  if (materialData.videoUrl) formData.append('videoUrl', materialData.videoUrl);
  if (materialData.deadline) formData.append('deadline', materialData.deadline);
  if (materialData.pdf) formData.append('pdf', materialData.pdf);

  const response = await api.post('/materials', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

const updateMaterial = async (id, materialData) => {
  const formData = new FormData();
  if (materialData.name) formData.append('name', materialData.name);
  if (materialData.description) formData.append('description', materialData.description);
  if (materialData.videoUrl) formData.append('videoUrl', materialData.videoUrl);
  if (materialData.deadline) formData.append('deadline', materialData.deadline);
  if (materialData.pdf) formData.append('pdf', materialData.pdf);

  const response = await api.put(`/materials/${id}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

const deleteMaterial = async (id) => {
  const response = await api.delete(`/materials/${id}`);
  return response.data;
};

const materialService = {
  getMaterialsByCourse,
  createMaterial,
  updateMaterial,
  deleteMaterial,
};

export default materialService;
