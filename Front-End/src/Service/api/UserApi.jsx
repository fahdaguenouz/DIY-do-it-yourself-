
import { axiosClient } from './../../api/axios';


const UserApi = {
  login: async (email, password) => {
    return axiosClient.post('/login', { email, password });
  },

  logout: async () => {
    return await axiosClient.post('/logout')
  },

  register: async (Data) => {
    return await axiosClient.post('/register', Data)
  },

  getUsers: async () => {
    return await axiosClient.get('/get-users')
  },
  getLevels: async () => {
    return await axiosClient.get('/get-levels')
  },
  getRoles: async () => {
    return await axiosClient.get('/get-roles')
  },
  getCategory: async () => {
    return await axiosClient.get('/get-categories')
  },
  getTutorials: async () => {
    return await axiosClient.get('/get-tutorials')
  },
  

  Add_User: async (UserData) => {
    // Create FormData instance
    

    return axiosClient.post('/add-user', UserData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  addTutorial : async (formData) => {
  
        return  await axiosClient.post(`/add-tutorial`, formData, {
            headers: {
                
                'Content-Type': 'multipart/form-data',
            },
        });
},


addCategory : async (formData) => {
  
  return  await axiosClient.post(`/add-category`, formData, {
      headers: {
          
          'Content-Type': 'multipart/form-data',
      },
  });
},

updateTutorial: async (tutorialId, formData) => {
  try {
    const response = await axiosClient.put(
      `/tutorials/update-tutorial/${tutorialId}`,
      formData
    );
    return response.data;
  } catch (error) {
    console.error('Error updating tutorial:', error);
    throw error; // Re-throw the error to be handled by the caller
  }
},

update_Category: async (CategoId, formData) => {
    return  await axiosClient.put(`/category/update-category/${CategoId}`,formData
  

    );
 
},
 update_CategoryPicture : async (CategId, formData) => {
  console.log('Sending FormData:', formData);
  for (let [key, value] of formData.entries()) {
    console.log(`${key}: ${value}`);
  }

  return await axiosClient.put(`/category/update-picture/${CategId}`, formData);
},

update_SubCategory: async (subCategoryId, formData) => {
  return await axiosClient.put(`/subcategory/update-subcategory/${subCategoryId}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
},


addSubCategory : async (formData) => {
  
  return  await axiosClient.post(`/add-subcategory`, formData, {
      headers: {
          
          'Content-Type': 'multipart/form-data',
      },
  });
},

addSignals: async (tuto) => {
  // Create FormData instance
  

  return axiosClient.post('/add-signals', tuto);
},

getSignals: async (tuto) => {
  // Create FormData instance
  

  return axiosClient.get('/get-signals', tuto);
},
confirmSignal: async (signalId) => {
  return axiosClient.post(`/confirm-signal/${signalId}`);
},
likeTutorials: async (tutorialId,userID) => {
  // Create FormData instance
  

  return axiosClient.post(`/tutorials/${tutorialId}/like`,userID);
},

getLikes: async () => {
  // Create FormData instance
  return axiosClient.get(`/tutorials/likes`);
},

commenter: async (tutorialId,data) => {
  // Create FormData instance
  return axiosClient.post(`/tutorials/${tutorialId}/comments`,data);
},

getComments: async () => {
  // Create FormData instance
  return axiosClient.get(`/tutorials/comments`);
},


  updateUser: async (userId, userData) => {
    return axiosClient.put(`/users/update-user/${userId}`, userData,)
  },
}
export default UserApi;