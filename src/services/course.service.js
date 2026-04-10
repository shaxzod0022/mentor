import api from './api';

const getAllCourses = async () => {
  const response = await api.get('/courses');
  return response.data;
};

const getCourseById = async (id) => {
  const response = await api.get(`/courses/${id}`);
  return response.data;
};

const createCourse = async (courseData) => {
  const formData = new FormData();
  formData.append('name', courseData.name);
  if (courseData.description) {
    formData.append('description', courseData.description);
  }
  if (courseData.image) {
    formData.append('image', courseData.image);
  }

  const response = await api.post('/courses', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

const updateCourse = async (id, courseData) => {
  const formData = new FormData();
  if (courseData.name) formData.append('name', courseData.name);
  if (courseData.description) formData.append('description', courseData.description);
  if (courseData.image) formData.append('image', courseData.image);

  const response = await api.put(`/courses/${id}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

const deleteCourse = async (id) => {
  const response = await api.delete(`/courses/${id}`);
  return response.data;
};

const assignUsersToCourse = async (id, assignments) => {
  const response = await api.post(`/courses/${id}/assign`, assignments);
  return response.data;
};

const courseService = {
  getAllCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse,
  assignUsersToCourse,
};

export default courseService;
