const API_URL = 'https://farmer2home-2.onrender.com/api';

const getHeaders = () => {
    const headers = {
        'Content-Type': 'application/json',
    };
    const token = localStorage.getItem('token');
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }
    return headers;
};

const api = {
    get: async (endpoint) => {
        try {
            const response = await fetch(`${API_URL}${endpoint}`, {
                method: 'GET',
                headers: getHeaders(),
            });
            return await handleResponse(response);
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    },
    post: async (endpoint, data) => {
        try {
            const response = await fetch(`${API_URL}${endpoint}`, {
                method: 'POST',
                headers: getHeaders(),
                body: JSON.stringify(data),
            });
            return await handleResponse(response);
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    },
    put: async (endpoint, data) => {
        try {
            const response = await fetch(`${API_URL}${endpoint}`, {
                method: 'PUT',
                headers: getHeaders(),
                body: JSON.stringify(data),
            });
            return await handleResponse(response);
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    },
    delete: async (endpoint) => {
        try {
            const response = await fetch(`${API_URL}${endpoint}`, {
                method: 'DELETE',
                headers: getHeaders(),
            });
            return await handleResponse(response);
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    }
};

const handleResponse = async (response) => {
    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.message || 'Something went wrong');
    }
    return data;
};

// Expose API globally or module
window.api = api;
