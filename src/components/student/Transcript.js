import React, {useState, useEffect} from 'react';
import { Table, TableHead, TableBody, TableRow, TableCell, CircularProgress, Paper } from '@mui/material';
import {SERVER_URL} from '../../Constants';

// students gets a list of all courses taken and grades
// use the URL /transcript?studentId=
// the REST api returns a list of EnrollmentDTO objects 
// the table should have columns for 
//  Year, Semester, CourseId, SectionId, Title, Credits, Grade

const Transcript = () => {
    const [transcriptData, setTranscriptData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTranscript = async () => {
            try {
                // Replace with actual API endpoint and studentId
                const response = await fetch(`${SERVER_URL}/transcripts?studentId=3`);
                if (!response.ok) {
                    throw new Error('Failed to fetch transcript data');
                }
                const data = await response.json();
                setTranscriptData(data);
                setTimeout(() => {
                    setLoading(false);
                }, 3000);
            } catch (error) {
                console.error('Error fetching transcript data:', error);
                setLoading(false);
            }
        };

        fetchTranscript();

        // Cleanup function for unmounting or dependencies change
        return () => {
        };
    }, []);

    if (loading) {
        return <CircularProgress />;
    }

    return (
        <Paper elevation={3} style={{ margin: '20px', padding: '20px' }}>
            <h3>Transcript</h3>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Year</TableCell>
                        <TableCell>Semester</TableCell>
                        <TableCell>Course ID</TableCell>
                        <TableCell>Section ID</TableCell>
                        <TableCell>Title</TableCell>
                        <TableCell>Credits</TableCell>
                        <TableCell>Grade</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {transcriptData.map((enrollment) => (
                        <TableRow key={enrollment.id}>
                            <TableCell>{enrollment.year}</TableCell>
                            <TableCell>{enrollment.semester}</TableCell>
                            <TableCell>{enrollment.courseId}</TableCell>
                            <TableCell>{enrollment.sectionId}</TableCell>
                            <TableCell>{enrollment.title}</TableCell>
                            <TableCell>{enrollment.credits}</TableCell>
                            <TableCell>{enrollment.grade}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </Paper>
    );
};
export default Transcript;