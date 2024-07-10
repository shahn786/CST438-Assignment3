import React, { useState, useEffect } from 'react';
import { SERVER_URL } from '../../Constants';

const AssignmentGrade = ({ assignmentId }) => {
    const [grades, setGrades] = useState([]);
    const [message, setMessage] = useState('');
    const instructorEmail = 'dwisneski@csumb.edu'; // This can be replaced with the logged-in user's email

    useEffect(() => {
        fetchGrades();
    }, [assignmentId]);

    const fetchGrades = async () => {
        try {
            const response = await fetch(`${SERVER_URL}/assignment/${assignmentId}/grades?email=${instructorEmail}`);
            if (response.ok) {
                const data = await response.json();
                setGrades(data);
            } else {
                const errorData = await response.json();
                setMessage(`Error: ${errorData.message}`);
            }
        } catch (error) {
            setMessage(`Network error: ${error.message}`);
        }
    };

    const handleGradeChange = (e, gradeId) => {
        const updatedGrades = grades.map(grade =>
            grade.id === gradeId ? { ...grade, score: e.target.value } : grade
        );
        setGrades(updatedGrades);
    };

    const saveGrades = async () => {
        try {
            const response = await fetch(`${SERVER_URL}/assignment/${assignmentId}/grades`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ grades, email: instructorEmail }),
            });

            if (response.ok) {
                setMessage('Grades saved successfully');
            } else {
                const errorData = await response.json();
                setMessage(`Error saving grades: ${errorData.message}`);
            }
        } catch (error) {
            setMessage(`Network error: ${error.message}`);
        }
    };

    return (
        <div>
            <h3>Assignment Grades</h3>
            {message && <p className="message">{message}</p>}
            <table className="grades-table">
                <thead>
                <tr>
                    <th>Student Name</th>
                    <th>Email</th>
                    <th>Score</th>
                </tr>
                </thead>
                <tbody>
                {grades.map((grade) => (
                    <tr key={grade.id}>
                        <td>{grade.enrollment.student.name}</td>
                        <td>{grade.enrollment.student.email}</td>
                        <td>
                            <input
                                type="number"
                                value={grade.score || ''}
                                onChange={(e) => handleGradeChange(e, grade.id)}
                            />
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
            <button onClick={saveGrades}>Save Grades</button>
        </div>
    );
};

export default AssignmentGrade;