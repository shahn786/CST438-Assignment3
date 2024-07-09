import React, {useState, useEffect} from 'react';
import { Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, CircularProgress, Typography } from '@mui/material';
import {SERVER_URL} from '../../Constants';


// students displays a list of open sections for a 
// use the URL /sections/open
// the REST api returns a list of SectionDTO objects

// the student can select a section and enroll
// issue a POST with the URL /enrollments/sections/{secNo}?studentId=3
// studentId=3 will be removed in assignment 7.

const CourseEnroll = () => {
    const [sections, setSections] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [enrolling, setEnrolling] = useState(false);

    useEffect(() => {
        const fetchSections = async () => {
            try {
                const response = await fetch(`${SERVER_URL}/sections/open`);
                if (!response.ok) {
                    throw new Error('Failed to fetch sections');
                }
                const data = await response.json();
                setSections(data);
                setTimeout(() => {
                    setLoading(false);
                }, 3000);
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        };

        fetchSections();
    }, []);

    const handleEnroll = async (secNo) => {
        setEnrolling(true);
        try {
            const response = await fetch(`${SERVER_URL}/enrollments/sections/${secNo}?studentId=3`, {
                method: 'POST',
            });
            if (!response.ok) {
                throw new Error('Failed to enroll');
            }
            alert('Enrolled successfully!');
        } catch (err) {
            alert(`Error enrolling: ${err.message}`);
        } finally {
            setEnrolling(false);
        }
    };

    if (loading) {
        return <CircularProgress />;
    }

    if (error) {
        return <Typography color="error">Error: {error}</Typography>;
    }
    return (
        <TableContainer component={Paper}>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Section Number</TableCell>
                        <TableCell>Course Id</TableCell>
                        <TableCell>Title</TableCell>
                        <TableCell>Instructor</TableCell>
                        <TableCell>Action</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {sections.map((section) => (
                        <TableRow key={section.secNo}>
                            <TableCell>{section.secNo}</TableCell>
                            <TableCell>{section.courseId}</TableCell>
                            <TableCell>{section.title}</TableCell>
                            <TableCell>{section.instructor}</TableCell>
                            <TableCell>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={() => handleEnroll(section.secNo)}
                                    disabled={enrolling}
                                >
                                    Enroll
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default CourseEnroll;

