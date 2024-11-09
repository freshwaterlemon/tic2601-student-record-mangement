const express = require('express');
const router = express.Router();
const { Student, CourseRecord, Course, Module } = require('../../src/models'); // Adjust path if necessary

// Route to fetch transcript data by student number
router.get('/', async (req, res) => {
    const { studentNo } = req.query;

    if (!studentNo) {
        return res.status(400).json({ error: 'Student number is required' });
    }

    try {
        // Fetch the student and basic course records without Module
        const student = await Student.findOne({
            where: { studentID: studentNo },
            attributes: ['studentName', 'studentID', 'studentDOB', 'degree', 'status'],
            include: [
                {
                    model: CourseRecord,
                    attributes: ['courseCode', 'grade', 'passfail'],
                    include: [
                        {
                            model: Course,
                            attributes: ['courseName']
                        },
                    ],
                },
            ],
        });

        if (!student) {
            return res.status(404).json({ error: 'Student not found' });
        }

        // Calculate the cumulative GPA with a max cap of 5
        const grades = student.CourseRecords.map(record => record.grade);
        const totalGrade = grades.reduce((sum, grade) => sum + grade, 0);
        const averageGPA = grades.length ? (totalGrade / grades.length) : 0;
        const gpa = Math.min(averageGPA, 5).toFixed(2); // Cap the GPA at 5

        // Fetch related Modules separately and match by courseCode
        const courseCodes = student.CourseRecords.map(record => record.courseCode);
        const modules = await Module.findAll({
            where: { courseCode: courseCodes },
            attributes: ['courseCode', 'year', 'semester']
        });

        // Map each CourseRecord to its corresponding Module data, and sort by year and semester
        const courses = student.CourseRecords.map(record => {
            const module = modules.find(m => m.courseCode === record.courseCode);
            return {
                courseCode: record.courseCode,
                moduleName: record.Course.courseName,
                year: module ? module.year : 'N/A',
                semester: module ? module.semester : 'N/A',
                grade: record.grade,
                passFail: record.passfail,
            };
        });

        // Sort the courses by year and semester
        courses.sort((a, b) => {
            if (a.year === b.year) {
                return a.semester.localeCompare(b.semester); // Sort by semester if the year is the same
            }
            return a.year - b.year; // Sort by year
        });

        // Format the data for the front end
        const transcriptData = {
            name: student.studentName,
            studentNo: student.studentID,
            dob: student.studentDOB ? new Date(student.studentDOB).toLocaleDateString() : 'N/A',
            degree: student.degree,
            status: student.status,
            gpa: gpa, // Dynamically calculated and capped GPA
            courses: courses
        };

        res.json(transcriptData);
    } catch (error) {
        console.error("Error fetching transcript data:", error);
        res.status(500).json({ error: 'Failed to fetch transcript data' });
    }
});

module.exports = router;
