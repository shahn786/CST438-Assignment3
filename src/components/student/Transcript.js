import React, { useState, useEffect } from 'react';
import { SERVER_URL } from '../../Constants';

const Transcript = () => {
    const [enrollments, setEnrollments] = useState([]);
    const [message, setMessage] = useState('');
    const studentId = 3;

    useEffect(() => {
        fetchTranscript();
    }, []);

    const fetchTranscript = async () => {
        try {
            const response = await fetch(`${SERVER_URL}/transcript?studentId=${studentId}`);
            if (response.ok) {
                const data = await response.json();
                setEnrollments(data);
            } else {
                const errorData = await response.json();
                setMessage(`Error: ${errorData.message}`);
            }
        } catch (error) {
            setMessage(`Network error: ${error.message}`);
        }
    };

    const styles = {
        container: {
            fontFamily: 'Arial, sans-serif',
            maxWidth: '800px',
            margin: '0 auto',
            padding: '20px',
        },
        header: {
            textAlign: 'center',
            color: '#333',
        },
        message: {
            backgroundColor: '#f8d7da',
            color: '#721c24',
            padding: '10px',
            borderRadius: '5px',
            marginBottom: '20px',
        },
        table: {
            width: '100%',
            borderCollapse: 'collapse',
            marginTop: '20px',
        },
        th: {
            backgroundColor: '#f2f2f2',
            border: '1px solid #ddd',
            padding: '12px',
            textAlign: 'left',
        },
        td: {
            border: '1px solid #ddd',
            padding: '12px',
        },
        tr: {
            ':nth-child(even)': {
                backgroundColor: '#f9f9f9',
            },
        },
    };

    return (
        <div style={styles.container}>
            <h3 style={styles.header}>My Transcript</h3>
            {message && <p style={styles.message}>{message}</p>}
            <table style={styles.table}>
                <thead>
                <tr>
                    <th style={styles.th}>Year</th>
                    <th style={styles.th}>Semester</th>
                    <th style={styles.th}>Course ID</th>
                    <th style={styles.th}>Section ID</th>
                    <th style={styles.th}>Title</th>
                    <th style={styles.th}>Credits</th>
                    <th style={styles.th}>Grade</th>
                </tr>
                </thead>
                <tbody>
                {enrollments.map((enrollment, index) => (
                    <tr key={index} style={styles.tr}>
                        <td style={styles.td}>{enrollment.year}</td>
                        <td style={styles.td}>{enrollment.semester}</td>
                        <td style={styles.td}>{enrollment.courseId}</td>
                        <td style={styles.td}>{enrollment.sectionId}</td>
                        <td style={styles.td}>{enrollment.title}</td>
                        <td style={styles.td}>{enrollment.credits}</td>
                        <td style={styles.td}>{enrollment.grade || 'N/A'}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};

export default Transcript;