import { useState } from 'react';
import ProjectEpicDropdown from './components/ProjectEpicDropdown';
import UserStoryForm from './components/UserStoryForm';
import { createStoryInJira } from './services/JiraService';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
    const [selectedProject, setSelectedProject] = useState(null);
    const [selectedEpic, setSelectedEpic] = useState(null);
    const [submissionStatus, setSubmissionStatus] = useState('');
    const [submissionError, setSubmissionError] = useState('');

    const handleProjectChange = (project) => {
        setSelectedProject(project);
        setSelectedEpic(null); // Reset epic selection when project changes
    };

    const handleEpicChange = (epic) => {
        setSelectedEpic(epic);
    };

    const handleStorySubmission = async (userStories) => {
        setSubmissionStatus('Submitting...');
        setSubmissionError('');

        const response = await createStoryInJira(selectedProject.value, selectedEpic.value, userStories);
        if (response.success) {
            setSubmissionStatus('Submission successful!');
            setSubmissionError('');
        } else {
            setSubmissionStatus('');
            setSubmissionError('Failed to submit stories. ' + response.error);
        }
    };

    return (
        <div>
            <h1>ComposerAI JIRA Integration</h1>
            <ProjectEpicDropdown 
                onProjectChange={handleProjectChange} 
                onEpicChange={handleEpicChange} 
            />
            {selectedProject && selectedEpic && 
                <UserStoryForm 
                    projectId={selectedProject.value} 
                    epicId={selectedEpic.value} 
                    onSubmissionComplete={handleStorySubmission} 
                />
            }
            {submissionStatus && <p>{submissionStatus}</p>}
            {submissionError && <p>Error: {submissionError}</p>}
        </div>
    );
}

export default App;
