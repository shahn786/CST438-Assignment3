import React, {useState, useEffect} from 'react';
import {useLocation} from 'react-router-dom'
import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css
import Button from '@mui/material/Button';
import {SERVER_URL} from '../../Constants';
import AssignmentAdd from './AssignmentAdd';
import AssignmentUpdate from './AssignmentUpdate';
import AssignmentGrade from './AssignmentGrade';

const AssignmentsView = (props) => {

    const [assignments, setAssignments] = useState([]);
    const [message, setMessage] = useState('');

    const location = useLocation();
    const {secNo, courseId, secId} = location.state;


    const fetchAssignments = async () => {
       
        try {
            const jwt = sessionStorage.getItem('jwt');

            const response = await fetch(`${SERVER_URL}/sections/${secNo}/assignments`,
                {
                    headers: {
                        'Authorization': jwt,
                    },
                });
        if (response.ok) {
          const data = await response.json();
          setAssignments(data);
        } else {
          const rc = await response.json();
          setMessage("fetch error "+rc.message);
        }
      } catch (err) {
        setMessage("network error "+err);
      }
    }

    useEffect(() => {
      fetchAssignments()
    }, []);

    const add = async (assignment) => {
        try {
            const jwt = sessionStorage.getItem('jwt');

            assignment.courseId = courseId;
            assignment.secId = secId;
            assignment.secNo = secNo;

            const response = await fetch(`${SERVER_URL}/assignments`, {
                method: 'POST',
                headers: {
                    'Authorization': jwt,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(assignment),
            });

            if (response.ok) {
                const data = await response.json();
                setMessage("Assignment created id=" + data.id);
                fetchAssignments();
            } else {
                const json = await response.json();
                setMessage("response error: " + json.message);
            }
        } catch (err) {
            setMessage("network error: " + err.message);
        }
    }

    const save = async (assignment) => {
        try {
            const jwt = sessionStorage.getItem('jwt');

            const response = await fetch(`${SERVER_URL}/assignments`, {
                method: 'PUT',
                headers: {
                    'Authorization': jwt,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(assignment),
            });

            if (response.ok) {
                setMessage("Assignment saved");
                fetchAssignments();
            } else {
                const json = await response.json();
                setMessage("response error: " + json.message);
            }
        } catch (err) {
            setMessage("network error: " + err.message);
        }
    }


const doDelete = async (id) => {
    try {
        const jwt = sessionStorage.getItem('jwt');

        const response = await fetch(`${SERVER_URL}/assignments/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': jwt,
                'Content-Type': 'application/json',
            },
        });

        if (response.ok) {
            setMessage("Assignment deleted");
            fetchAssignments();
        } else {
            const json = await response.json();
            setMessage("Delete failed: " + json.message);
        }
    } catch (err) {
        setMessage("Network error: " + err.message);
    }
}

    const onDelete = (e) => {
        confirmAlert({
            title: 'Confirm to delete',
            message: 'Do you really want to delete?',
            buttons: [
              {
                label: 'Yes',
                onClick: () => doDelete(e)
              },
              {
                label: 'No',
              }
            ]
          });
    }

    const headers = ['id', 'Title', 'Due Date', '', '', ''];
     
    return(
        <div> 
            <h3>{message}</h3>   

            { assignments.length > 0 && 
                <> 
                    <h3>{courseId}-{secId} Assignments</h3>   
                    
                    <table className="Center" > 
                        <thead>
                        <tr>
                            {headers.map((s, idx) => (<th key={idx}>{s}</th>))}
                        </tr>
                        </thead>
                        <tbody>
                        {assignments.map((a) => (
                                <tr key={a.id}>
                                <td>{a.id}</td>
                                <td>{a.title}</td>
                                <td>{a.dueDate}</td>
                                <td><AssignmentGrade assignment={a} /></td>
                                <td><AssignmentUpdate assignment={a} save={save} /></td>
                                <td><Button onClick={onDelete}>Delete</Button></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </>
            }

            <AssignmentAdd save={add} />
        </div>
    );
}

export default AssignmentsView;
