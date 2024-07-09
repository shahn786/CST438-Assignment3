import React, {useEffect, useState} from 'react';
import { CircularProgress, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button } from '@mui/material';
import {SERVER_URL} from '../../Constants';

// student can view schedule of sections 
// use the URL /enrollment?studentId=3&year= &semester=
// The REST api returns a list of EnrollmentDTO objects
// studentId=3 will be removed in assignment 7

// to drop a course 
// issue a DELETE with URL /enrollment/{enrollmentId}

const ScheduleView = () => {
    const [enrollments, setEnrollments] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchEnrollments = async () => {
            try {
                const response = await fetch(`${SERVER_URL}/enrollments?studentId=3&year=2024&semester=Spring`);
                if (!response.ok) {
                    throw new Error('Failed to fetch enrollments');
                }
                const enrollmentsData = await response.json();
                setEnrollments(enrollmentsData);
                setTimeout(() => {
                    setLoading(false);
                }, 3000);
            } catch (error) {
                console.error('Error fetching enrollments:', error);
                setLoading(false);
            }
        };

        fetchEnrollments();

        return () => {
            // Cleanup function if needed
        };
    }, []);

    const handleDropCourse = async (enrollmentId) => {
        try {
            const response = await fetch(`${SERVER_URL}/enrollments/${enrollmentId}`, {
                method: 'DELETE',
            });
            if (!response.ok) {
                throw new Error('Failed to drop course');
            }
            setEnrollments(enrollments.filter(enrollment => enrollment.id !== enrollmentId));
        } catch (error) {
            console.error('Error dropping course:', error);
        }
    };

    if (loading) {
        return <CircularProgress />;
    }

    return (
        <TableContainer component={Paper}>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Course Name</TableCell>
                        <TableCell>Instructor</TableCell>
                        <TableCell>Action</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {enrollments.map((enrollment) => (
                        <TableRow key={enrollment.id}>
                            <TableCell>{enrollment.title}</TableCell>
                            <TableCell>{enrollment.name}</TableCell>
                            <TableCell>
                                <Button onClick={() => handleDropCourse(enrollment.id)} variant="outlined" color="secondary">
                                    Drop Course
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default ScheduleView;