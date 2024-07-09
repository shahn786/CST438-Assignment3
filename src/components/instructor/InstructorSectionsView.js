import React, {useState, useEffect} from 'react';
import { Link } from 'react-router-dom';
import { Table, TableHead, TableBody, TableRow, TableCell, CircularProgress, Paper } from '@mui/material';
import {SERVER_URL} from '../../Constants';


// instructor views a list of sections they are teaching 
// use the URL /sections?email=dwisneski@csumb.edu&year= &semester=
// the email= will be removed in assignment 7 login security
// The REST api returns a list of SectionDTO objects
// The table of sections contains columns
//   section no, course id, section id, building, room, times and links to assignments and enrollments
// hint:  
// <Link to="/enrollments" state={section}>View Enrollments</Link>
// <Link to="/assignments" state={section}>View Assignments</Link>

const InstructorSectionsView = (props) => {


    const [sections, setSections] = useState([]);
    const [loading, setLoading] = useState(true);
    props = {state: {year: '2024', semester: 'Spring'}};

    useEffect(() => {
        const fetchSections = async () => {
            try {
                const response = await fetch(`${SERVER_URL}/sections?email=dwisneski@csumb.edu&year=${props.state.year}&semester=${props.state.semester}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch sections');
                }
                const data = await response.json();
                setSections(data);
                setTimeout(() => {
                    setLoading(false);
                }, 3000);
            } catch (error) {
                console.error('Error fetching sections:', error);
                setLoading(false);
            }
        };

        fetchSections();
        return () => {
        };
    }, [props.state.year, props.state.semester]);

    if (loading) {
        return <CircularProgress />;
    }

    return (
        <Paper elevation={3} style={{ margin: '20px', padding: '20px' }}>
            <h3>Instructor Sections</h3>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Section No</TableCell>
                        <TableCell>Course ID</TableCell>
                        <TableCell>Section ID</TableCell>
                        <TableCell>Building</TableCell>
                        <TableCell>Room</TableCell>
                        <TableCell>Times</TableCell>
                        <TableCell>Actions</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {sections.map(section => (
                        <TableRow key={section.sectionNo}>
                            <TableCell>{section.sectionNo}</TableCell>
                            <TableCell>{section.courseId}</TableCell>
                            <TableCell>{section.secId}</TableCell>
                            <TableCell>{section.building}</TableCell>
                            <TableCell>{section.room}</TableCell>
                            <TableCell>{section.times}</TableCell>
                            <TableCell>
                                <Link to="/enrollments" state={section}>View Enrollments</Link>
                                <br />
                                <Link to="/assignments" state={section}>View Assignments</Link>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </Paper>
    );
};

export default InstructorSectionsView;

