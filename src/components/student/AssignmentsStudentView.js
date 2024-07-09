import React, {useEffect, useState} from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, CircularProgress, Typography } from '@mui/material';
import {SERVER_URL} from '../../Constants';


// student views a list of assignments and assignment grades 
// use the URL  /assignments?studentId= &year= &semester=
// The REST api returns a list of SectionDTO objects
// Use a value of studentId=3 for now. Until login is implemented in assignment 7.

// display a table with columns  Course Id, Assignment Title, Assignment DueDate, Score

const AssignmentsStudentView = () => {
    const [assignments, setAssignments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchAssignments = async () => {
            try {
                const response = await fetch(`${SERVER_URL}/assignments?studentId=3&year=2024&semester=Spring`);
                if (!response.ok) {
                    throw new Error('Failed to fetch assignments');
                }
                const data = await response.json();
                setAssignments(data);
                setTimeout(() => {
                    setLoading(false);
                }, 3000);
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        };

        fetchAssignments();
    }, []);

    if (loading) {
        return <CircularProgress />;
    }

    if (error) {
        return <Typography color="error">Error: {error}</Typography>;
    }

    return (
        <div>
            <Typography variant="h5" gutterBottom>
                Assignments
            </Typography>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Course Id</TableCell>
                            <TableCell>Assignment Title</TableCell>
                            <TableCell>Assignment DueDate</TableCell>
                            <TableCell>Score</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {assignments.map((assignment, index) => (
                            <TableRow key={index}>
                                <TableCell>{assignment.courseId}</TableCell>
                                <TableCell>{assignment.title}</TableCell>
                                <TableCell>{assignment.dueDate}</TableCell>
                                <TableCell>{assignment.score}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    );
};
export default AssignmentsStudentView;