import api from '../services/api';

const submissionRepository = {
  submit: async (formData) => {
    // formData should contain materialId, courseId, and pdf file
    const response = await api.post('/submissions', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  getMySubmissions: async (courseId) => {
    const response = await api.get(`/submissions/my-submissions/${courseId}`);
    return response.data;
  },

  getCourseSubmissions: async (courseId) => {
    const response = await api.get(`/submissions/course/${courseId}`);
    return response.data;
  },

  toggleGrading: async (id) => {
    const response = await api.patch(`/submissions/${id}/status`);
    return response.data;
  },

  assignGrade: async (id, gradeData) => {
    const response = await api.patch(`/submissions/${id}/grade`, gradeData);
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/submissions/${id}`);
    return response.data;
  },
  
  rejectSubmission: async (id) => {
    const response = await api.patch(`/submissions/${id}/reject`);
    return response.data;
  },
};

export default submissionRepository;
