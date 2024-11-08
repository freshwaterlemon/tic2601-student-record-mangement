import React, { useState } from 'react';
import './Academic.css';

const Academic = () => {
    const [studentNo, setStudentNo] = useState('');
    const [transcriptData, setTranscriptData] = useState(null); // Store the fetched transcript data
    const [error, setError] = useState(null); // State for error handling

    const handleFilter = async (e) => {
        e.preventDefault();
        setError(null); // Reset any previous error
        setTranscriptData(null); // Reset data when a new search is initiated

        try {
            const response = await fetch(`http://localhost:3000/academic?studentNo=${studentNo}`);
            if (!response.ok) {
                throw new Error("Failed to fetch data. Please ensure the student number is correct.");
            }
            const data = await response.json();	
            setTranscriptData(data); // Update state with fetched transcript data
        } catch (error) {
            console.error("Failed to fetch transcript data:", error);
            setError(error.message); // Display error message to the user
        }
    };

    return (
        <div className="academicContainer">
            <div className="filterStudentForm">
                <form onSubmit={handleFilter}>
                    <label className="filterStudentLabel">Student No: </label>
                    <input
                        className="filterStudentInput"
                        placeholder="Student No"
                        type="text"
                        value={studentNo}
                        onChange={(e) => setStudentNo(e.target.value)}
                    />
                    <button className="filterStudentBtn" type="submit">Filter</button>
                </form>
            </div>

            {error && <p className="error">{error}</p>}

            {transcriptData && (
                <table className="transcriptTable">
                    <thead>
                        <tr>
                            <th colSpan="9"><h2>Unofficial Transcript</h2></th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>NAME:</td>
                            <td colSpan="2">{transcriptData.name}</td>
                            <td>STUDENT NO:</td>
                            <td colSpan="2">{transcriptData.studentNo}</td>
                            <td>DATE OF BIRTH:</td>
                            <td>{transcriptData.dob}</td>
                        </tr>
                        <tr>
                            <td>DEGREE:</td>
                            <td colSpan="2">{transcriptData.degree}</td>
                            <td>STATUS:</td>
                            <td colSpan="2">{transcriptData.status}</td>
                            <td>GPA:</td>
                            <td>{transcriptData.gpa}</td>
                        </tr>
                        <tr>
                            <td colSpan="6">COURSE</td>
                            <td colSpan="1">GRADE</td>
                            <td colSpan="1">PASS/FAIL</td>
                        </tr>
                        {transcriptData.courses.map((course, index) => (
                            <React.Fragment key={index}>
                                <tr>
                                    <td colSpan="1">ACADEMIC YEAR</td>
                                    <td colSpan="2">{course.year}</td>
                                    <td colSpan="1">SEMESTER</td>
                                    <td colSpan="1">{course.semester}</td>
                                </tr>
                                <tr>
                                    <td>{course.courseCode}</td>
                                    <td colSpan="5">{course.moduleName}</td>
                                    <td colSpan="1">{course.grade}</td>
                                    <td colSpan="1">{course.passFail}</td>
                                </tr>
                            </React.Fragment>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default Academic;
