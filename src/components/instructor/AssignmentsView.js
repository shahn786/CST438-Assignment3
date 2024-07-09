import React, {useState, useEffect} from 'react';
import {useLocation} from 'react-router-dom';
import { Table, TableHead, TableBody, TableRow, TableCell, Button, CircularProgress, Paper, Dialog, DialogTitle, DialogContent, DialogActions, TextField } from '@mui/material';
import {SERVER_URL} from '../../Constants';

// instructor views assignments for their section
// use location to get the section value 
// 
// GET assignments using the URL /sections/{secNo}/assignments
// returns a list of AssignmentDTOs
// display a table with columns 
// assignment id, title, dueDate and buttons to grade, edit, delete each assignment

const AssignmentsView = (props) => {

    const location = useLocation();
    // const {secNo, courseId, secId} = location.state;

    const [assignments, setAssignments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [openEditDialog, setOpenEditDialog] = useState(false);
    const [editAssignment, setEditAssignment] = useState(null);
    const [editTitle, setEditTitle] = useState('');
    const [editDueDate, setEditDueDate] = useState('');

    props = {secNo: 1};

    useEffect(() => {
        const fetchAssignments = async () => {
            try {
                const response = await fetch(`${SERVER_URL}/sections/${props.secNo}/assignments`);
                if (!response.ok) {
                    throw new Error('Failed to fetch assignments');
                }
                const data = await response.json();
                console.log(data);
                setAssignments(data);
                setTimeout(() => {
                    setLoading(false);
                }, 3000);
            } catch (error) {
                console.error('Error fetching assignments:', error);
                setLoading(false);
            }
        };

        fetchAssignments();
        return () => {
        };
    }, [props.secNo]);

    const handleGrade = async (assignment) => {
        try {
            const response = await fetch(`${SERVER_URL}/grades`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify([{ gradeId: assignment.gradeId, score: assignment.score }]),
            });
            if (!response.ok) {
                throw new Error('Failed to update grades');
            }
            console.log('Grades updated successfully');
        } catch (error) {
            console.error('Error updating grades:', error);
        }
    };

    const handleEdit = (assignment) => {
        setEditAssignment(assignment);
        setEditTitle(assignment.title);
        setEditDueDate(assignment.dueDate);
        setOpenEditDialog(true);
    };

    const handleSaveEdit = async () => {
        try {
            const response = await fetch(`${SERVER_URL}/assignments/edit`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    id: editAssignment.assignmentId,
                    title: editTitle,
                    dueDate: editDueDate,
                }),
            });
            if (!response.ok) {
                throw new Error('Failed to update assignment');
            }
            console.log('Assignment updated successfully');
            setOpenEditDialog(false);
        } catch (error) {
            console.error('Error updating assignment:', error);
        }
    };

    const handleDelete = async (assignment) => {
        try {
            const response = await fetch(`${SERVER_URL}/assignments/${assignment.assignmentId}`, {
                method: 'DELETE',
            });
            if (!response.ok) {
                throw new Error('Failed to delete assignment');
            }
            console.log('Assignment deleted successfully');
        } catch (error) {
            console.error('Error deleting assignment:', error);
        }
    };

    const handleCloseEditDialog = () => {
        setOpenEditDialog(false);
    };

    if (loading) {
        return <CircularProgress />;
    }

    return (
        <Paper elevation={3} style={{ margin: '20px', padding: '20px' }}>
            <h3>Assignments for Section {props.secNo}</h3>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Assignment ID</TableCell>
                        <TableCell>Title</TableCell>
                        <TableCell>Due Date</TableCell>
                        <TableCell>Actions</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {assignments.map((assignment) => (
                        <TableRow key={assignment.assignmentId}>
                            <TableCell>{assignment.assignmentId}</TableCell>
                            <TableCell>{assignment.title}</TableCell>
                            <TableCell>{assignment.dueDate}</TableCell>
                            <TableCell>
                                <Button variant="contained" color="primary" onClick={() => handleGrade(assignment)}>Grade</Button>
                                <Button variant="contained" color="secondary" onClick={() => handleEdit(assignment)}>Edit</Button>
                                <Button variant="contained" color="error" onClick={() => handleDelete(assignment)}>Delete</Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            {/* Edit Assignment Dialog */}
            <Dialog open={openEditDialog} onClose={handleCloseEditDialog}>
                <DialogTitle>Edit Assignment</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="editTitle"
                        label="Title"
                        fullWidth
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                    />
                    <TextField
                        margin="dense"
                        id="editDueDate"
                        label="Due Date"
                        type="date"
                        fullWidth
                        value={editDueDate}
                        onChange={(e) => setEditDueDate(e.target.value)}
                        InputLabelProps={{
                            shrink: true,
                        }}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseEditDialog}>Cancel</Button>
                    <Button onClick={handleSaveEdit} variant="contained" color="primary">Save</Button>
                </DialogActions>
            </Dialog>
        </Paper>
    );
};

export default AssignmentsView;
