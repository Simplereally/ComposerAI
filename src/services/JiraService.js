import axios from 'axios';

const EXPRESS_API_URL = 'http://localhost:3001/api';

const axiosInstance = axios.create({
    baseURL: EXPRESS_API_URL
});

export const fetchProjects = async () => {
    try {
        const response = await axiosInstance.get('/projects'); // This hits the Express backend
        return response.data.map(project => ({
            value: project.value, // Use 'value' instead of 'id'
            label: project.name   // Use 'name' directly
        }));
    } catch (error) {
        console.error('Error fetching projects:', error);
        return { error: error.message || 'Failed to fetch projects' };
    }
};


export const fetchEpics = async (projectId) => {
    try {
        const response = await axiosInstance.get(`/epics/${projectId}`); // Updated endpoint
        return response.data.issues.map(epic => ({
            value: epic.id,
            label: epic.fields.summary
        }));
    } catch (error) {
        console.error('Error fetching epics:', error);
        return { error: error.message || 'Failed to fetch epics' };
    }
};

export const createStoryInJira = async (projectId, epicId, userStories) => {
    try {
        const response = await axiosInstance.post('/create-story', {
            projectId,
            epicId,
            userStories
        });
        return { success: true, data: response.data };
    } catch (error) {
        console.error('Error creating story in JIRA:', error);
        return { success: false, error: error.response?.data || error.message };
    }
};
