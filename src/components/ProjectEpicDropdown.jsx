import { useState, useEffect } from 'react';
import Select from 'react-select';
import { fetchProjects, fetchEpics } from '../services/JiraService';
import PropTypes from 'prop-types';
import EpicForm from './EpicForm';

const ProjectEpicDropdown = ({ onProjectChange, onEpicChange }) => {
    const [projects, setProjects] = useState([]);
    const [epics, setEpics] = useState([]);
    const [selectedProject, setSelectedProject] = useState(null); // New state for selected project
    const [error, setError] = useState('');
    const [isCreatingEpic, setIsCreatingEpic] = useState(false);

    useEffect(() => {
        const loadProjects = async () => {
            const projectsData = await fetchProjects();
            if (projectsData.error) {
                setError(projectsData.error);
            } else {
                setProjects(projectsData);
            }
        };
    
        loadProjects();
    }, []);    

    const handleProjectSelect = async (selectedOption) => {
        setSelectedProject(selectedOption); // Update selected project
        onProjectChange(selectedOption);
        if (selectedOption) {
            const epicsData = await fetchEpics(selectedOption.value);
            if (epicsData.error) {
                setError(epicsData.error);
            } else {
                setEpics(epicsData);
            }
        } else {
            setEpics([]); // Reset epics if no project is selected
        }
    };

    const handleEpicSelect = selectedOption => {
        setIsCreatingEpic(selectedOption?.value === 'new');
        if (selectedOption?.value !== 'new') {
            onEpicChange(selectedOption);
        }
    };

    return (
        <div>
            {error && <p>Error: {error}</p>}
            <Select 
                options={projects} 
                onChange={handleProjectSelect} 
                placeholder="Select Project"
                isClearable
            />
            <Select 
                options={[...epics, { value: 'new', label: 'Create New Epic...' }]} 
                onChange={handleEpicSelect}
                placeholder="Select or Create Epic"
                isDisabled={!selectedProject} // Disable if no project is selected
                isClearable
            />
            {isCreatingEpic && (
                <EpicForm
                    onSave={(epicData) => {
                        console.log('Epic Data:', epicData);
                        // TODO: handle epic creation logic here
                        setIsCreatingEpic(false);
                    }}
                    onCancel={() => setIsCreatingEpic(false)}
                />
            )}
        </div>
    );
};

ProjectEpicDropdown.propTypes = {
    onProjectChange: PropTypes.func.isRequired,
    onEpicChange: PropTypes.func.isRequired,
};

export default ProjectEpicDropdown;
