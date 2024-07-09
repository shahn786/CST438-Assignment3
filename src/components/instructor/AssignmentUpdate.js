import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField } from '@mui/material';
import {SERVER_URL} from '../../Constants';

//  instructor updates assignment title, dueDate 
//  use an mui Dialog
//  issue PUT to URL  /assignments with updated assignment

const AssignmentUpdate = (props)  => {


    const [open, setOpen] = useState(false);
    const [title, setTitle] = useState(props.assignment.title);
    const [dueDate, setDueDate] = useState(props.assignment.dueDate);
    props = {assignment: {id: 1, title: 'Assignment 1', dueDate: '2024-12-31'}};

    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleUpdateAssignment = async () => {
        try {
            const response = await fetch(`${SERVER_URL}/assignments`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ id: props.assignment.id, title, dueDate }),
            });
            if (!response.ok) {
                throw new Error('Failed to update assignment');
            }
            handleClose();
        } catch (error) {
            console.error('Error updating assignment:', error);
        }
    };

    return (
        <>
            <Button variant="outlined" onClick={handleOpen}>Update Assignment</Button>
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Update Assignment</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="title"
                        label="Title"
                        fullWidth
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                    <TextField
                        margin="dense"
                        id="dueDate"
                        label="Due Date"
                        type="date"
                        fullWidth
                        value={dueDate}
                        onChange={(e) => setDueDate(e.target.value)}
                        InputLabelProps={{
                            shrink: true,
                        }}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button onClick={handleUpdateAssignment} variant="contained" color="primary">Update</Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default AssignmentUpdate;