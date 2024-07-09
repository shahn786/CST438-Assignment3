import React, {useState, useEffect} from 'react';
import {useLocation} from 'react-router-dom';
import {SERVER_URL} from '../../Constants';
import { Table, TableHead, TableBody, TableRow, TableCell, Button, CircularProgress, Paper, TextField } from '@mui/material';


// instructor view list of students enrolled in a section 
// use location to get section no passed from InstructorSectionsView
// fetch the enrollments using URL /sections/{secNo}/enrollments
// display table with columns
//   'enrollment id', 'student id', 'name', 'email', 'grade'
//  grade column is an input field
//  hint:  <input type="text" name="grade" value={e.grade} onChange={onGradeChange} />

const EnrollmentsView = (props) => {

    const location = useLocation();
   //  const {secNo, courseId, secId} = location.state;

    const [enrollments, setEnrollments] = useState([]);
    const [loading, setLoading] = useState(true);
    props = {secNo: 1};

    useEffect(() => {
        const fetchEnrollments = async () => {
            try {
                const response = await fetch(`${SERVER_URL}/sections/${props.secNo}/enrollments`);
                if (!response.ok) {
                    throw new Error('Failed to fetch enrollments');
                }
                const data = await response.json();
                setEnrollments(data);
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
        };
    }, [props.secNo]);

    const handleGradeChange = (e, enrollment) => {
        const { value } = e.target;
        setEnrollments(prevEnrollments => prevEnrollments.map(en => {
            if (en.enrollmentId === enrollment.enrollmentId) {
                return { ...en, grade: value };
            }
            return en;
        }));
    };

    const saveGrades = async () => {
        try {
            const response = await fetch(`${SERVER_URL}/grades`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(enrollments.map(en => ({ gradeId: en.gradeId, score: en.grade }))),
            });
            if (!response.ok) {
                throw new Error('Failed to update grades');
            }
            console.log('Grades updated successfully');
        } catch (error) {
            console.error('Error updating grades:', error);
        }
    };

    if (loading) {
        return <CircularProgress />;
    }

    return (
        <Paper elevation={3} style={{ margin: '20px', padding: '20px' }}>
            <h3>Enrollments for Section {props.secNo}</h3>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Enrollment ID</TableCell>
                        <TableCell>Student ID</TableCell>
                        <TableCell>Name</TableCell>
                        <TableCell>Email</TableCell>
                        <TableCell>Grade</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {enrollments.map((enrollment) => (
                        <TableRow key={enrollment.enrollmentId}>
                            <TableCell>{enrollment.enrollmentId}</TableCell>
                            <TableCell>{enrollment.studentId}</TableCell>
                            <TableCell>{enrollment.name}</TableCell>
                            <TableCell>{enrollment.email}</TableCell>
                            <TableCell>
                                <TextField
                                    type="text"
                                    name="grade"
                                    value={enrollment.grade}
                                    onChange={(e) => handleGradeChange(e, enrollment)}
                                />
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            <Button variant="contained" color="primary" onClick={saveGrades}>Save Grades</Button>
        </Paper>
    );
};

export default EnrollmentsView;
