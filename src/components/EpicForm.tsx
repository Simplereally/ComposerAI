import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

const EpicForm = ({ onSave }) => {
    const [summary, setSummary] = useState('');
    const [description, setDescription] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave({ summary, description });
    };

    return (
        <Form onSubmit={handleSubmit}>
            <Form.Group>
                <Form.Label htmlFor="summary">Epic Summary</Form.Label>
                <Form.Control
                    id="summary"
                    type="text"
                    value={summary}
                    onChange={(e) => setSummary(e.target.value)}
                    required
                />
            </Form.Group>
            <Form.Group>
                <Form.Label htmlFor="description">Epic Description</Form.Label>
                <Form.Control
                    id="description"
                    as="textarea"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />
            </Form.Group>
            <Button variant="primary" type="submit">Save Epic</Button>
        </Form>
    );
};

EpicForm.propTypes = {
    onSave: PropTypes.func.isRequired
};

export default EpicForm;
