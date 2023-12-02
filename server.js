import express from 'express';
import axios from 'axios';
import cors from 'cors';
import dotenv from 'dotenv';
import process from 'process';
import { Buffer } from 'buffer';

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

const EMAIL = 'mackaman29@gmail.com'
const JIRA_API_URL = 'https://joshmackus.atlassian.net/rest/api/3';
const AUTH_TOKEN = 'ATATT3xFfGF0enRSZnwIYbr65uuN84WPzPhIuSLRwpd1qUIFhabEAspfzIh9HDbIxu2EG-Fs8yKgkjha8vlxVJL2fNMXGZRlrQoH5NkOD1sI071DXTN-PwcVeUOJkEcCGE4zPai9B6GxwbWrGM97A5qWxHruPv17fti2wbI-nLAbHi4jc0XpmBU=6F71711D'; // Replace with your token

const authHeader = `Basic ${Buffer.from(`${EMAIL}:${AUTH_TOKEN}`).toString('base64')}`;

app.get('/api/projects', async (req, res) => {
    try {
        const response = await axios.get(`${JIRA_API_URL}/project/search`, {
            headers: {
                'Authorization': authHeader,
                'Content-Type': 'application/json'
            }
        });

        const projects = response.data.values.map(project => ({
            value: project.id,
            name: project.name,
            key: project.key
        }));
        console.log("projects? ", projects)
        res.json(projects);
    } catch (error) {
        console.error("Error fetching projects:", error);
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/epics/:projectId', async (req, res) => {
    const { projectId } = req.params;
    console.log("projectId: ", projectId);
    try {
        const response = await axios.get(`${JIRA_API_URL}/search?jql=project=${projectId} AND issuetype=Epic`, {
            headers: {
                'Authorization': authHeader,
                'Content-Type': 'application/json'
            }
        });
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


app.post('/api/create-story', async (req, res) => {
    const { projectId, epicId, userStories } = req.body;
    try {
        // Loop over userStories and create each story in JIRA
        const results = await Promise.all(userStories.map(async (story) => {
            const issueData = {
                fields: {
                    project: { id: projectId },
                    summary: story.summary,
                    description: story.description,
                    issuetype: { id: "10004" }, // Story Issue Type ID
                    // Replace 'customfield_XXXXX' with your JIRA's Epic Link field name
                    "customfield_XXXXX": epicId
                }
            };

            return await axios.post(`${JIRA_API_URL}/issue`, issueData, {
                headers: {
                    'Authorization': `Basic ${AUTH_TOKEN}`,
                    'Content-Type': 'application/json'
                }
            });
        }));

        res.json({ success: true, data: results.map(r => r.data) });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

const PORT = process?.env?.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
