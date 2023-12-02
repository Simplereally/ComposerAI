import { useState } from 'react';
import { createStoryInJira } from '../services/JiraService';
import PropTypes from 'prop-types';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

const UserStoryForm = ({ projectId, epicId, onSubmissionComplete }) => {
    const [userStories, setUserStories] = useState([{ story: '', criteria: '' }]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');


    const handleStoryChange = (index, event) => {
        const newStories = [...userStories];
        newStories[index][event.target.name] = event.target.value;
        setUserStories(newStories);
    };

    const handleAddStory = () => {
        setUserStories([...userStories, { story: '', criteria: '' }]);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setIsSubmitting(true);
        setError('');

        const response = await createStoryInJira(projectId, epicId, userStories);
        if (response.success) {
            onSubmissionComplete(response.data); // Callback for submission completion
            setUserStories([{ story: '', criteria: '' }]); // Reset form
        } else {
            setError(response.error);
        }

        setIsSubmitting(false);
    };

    return (
        <Form onSubmit={handleSubmit}>
            {userStories.map((story, index) => (
                <Form.Group key={index}>
                    <Form.Control 
                        type="text" 
                        name="story" 
                        value={story.story} 
                        onChange={(e) => handleStoryChange(index, e)} 
                        placeholder="User Story"
                    />
                    <Form.Control 
                        as="textarea" 
                        name="criteria" 
                        value={story.criteria} 
                        onChange={(e) => handleStoryChange(index, e)} 
                        placeholder="Acceptance Criteria"
                    />
                </Form.Group>
            ))}
            <Button variant="primary" onClick={handleAddStory}>Add Story</Button>
            <Button variant="primary" type="submit" disabled={isSubmitting}>Submit</Button>
            {isSubmitting && <p>Submitting...</p>}
            {error && <p>Error: {error}</p>}
        </Form>
    );
};

UserStoryForm.propTypes = {
    projectId: PropTypes.string.isRequired,
    epicId: PropTypes.string.isRequired,
    onSubmissionComplete: PropTypes.func.isRequired,
  };

export default UserStoryForm;