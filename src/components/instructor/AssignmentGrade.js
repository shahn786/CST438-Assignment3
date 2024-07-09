import React, { useState } from 'react';
import { Table, TableHead, TableBody, TableRow, TableCell, TextField, Button, CircularProgress, Paper } from '@mui/material';
import {SERVER_URL} from '../../Constants';

// instructor enters students' grades for an assignment
// fetch the grades using the URL /assignment/{id}/grades
// REST api returns a list of GradeDTO objects
// display the list as a table with columns 'gradeId', 'student name', 'student email', 'score' 
// score column is an input field 
//  <input type="text" name="score" value={g.score} onChange={onChange} />
 

const AssignmentGrade = (props) => {


    const [grades, setGrades] = useState([]);
    const [loading, setLoading] = useState(true);
    props = {assignmentId: 1};

    useEffect(() => {
        const fetchGrades = async () => {
            try {
                // Replace with actual assignment id
                const response = await fetch(`${SERVER_URL}/assignments/${props.assignmentId}/grades`);
                if (!response.ok) {
                    throw new Error('Failed to fetch grades');
                }
                const data = await response.json();
                setGrades(data);
                setTimeout(() => {
                    setLoading(false);
                }, 3000);
            } catch (error) {
                console.error('Error fetching grades:', error);
                setLoading(false);
            }
        };

        fetchGrades();
        return () => {
        };
    }, [props.assignmentId]);

    const handleScoreChange = (index, event) => {
        const updatedGrades = [...grades];
        updatedGrades[index].score = event.target.value;
        setGrades(updatedGrades);
    };

    const handleSaveGrades = async () => {
        try {
            const response = await fetch(`${SERVER_URL}/assignments/${props.assignmentId}/grades`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(grades),
            });
            if (!response.ok) {
                throw new Error('Failed to save grades');
            }
        } catch (error) {
            console.error('Error saving grades:', error);
        }
    };

    if (loading) {
        return <CircularProgress />;
    }

    return (
        <Paper elevation={3} style={{ margin: '20px', padding: '20px' }}>
            <h3>Assignment Grades</h3>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Grade ID</TableCell>
                        <TableCell>Student Name</TableCell>
                        <TableCell>Student Email</TableCell>
                        <TableCell>Score</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {grades.map((grade, index) => (
                        <TableRow key={grade.gradeId}>
                            <TableCell>{grade.gradeId}</TableCell>
                            <TableCell>{grade.studentName}</TableCell>
                            <TableCell>{grade.studentEmail}</TableCell>
                            <TableCell>
                                <TextField
                                    type="text"
                                    name="score"
                                    value={grade.score}
                                    onChange={(event) => handleScoreChange(index, event)}
                                />
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            <Button onClick={handleSaveGrades} variant="contained" color="primary" style={{ marginTop: '20px' }}>
                Save Grades
            </Button>
        </Paper>
    );
};

export default AssignmentGrade;