const express = require('express');
const courseModel = require('../model/courseModel');
const auth = require('../middleware/auth');

const CourseRouter = express.Router();
// GET request to fetch courses with filtering, sorting, pagination
CourseRouter.get('/courses', async (req, res) => {
    try {
        const { page = 1, limit = 10, sortBy = 'courseName', sortOrder = 'asc', search = '', lectureName = '', filterType = 'all' } = req.query;

        // Filtering courses
        const courseFilter = {
            $or: [
                { courseName: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } }
            ]
        };

        // Filtering lectures
        const lectureFilter = { lecture_name: { $regex: lectureName, $options: 'i' } };

        // Sorting
        const sortOptions = {};
        sortOptions[sortBy] = sortOrder === 'asc' ? 1 : -1;

        // Pagination
        const startIndex = (parseInt(page) - 1) * parseInt(limit);
        const endIndex = parseInt(page) * parseInt(limit);

        const results = {};

        let courses;

        if (filterType === 'course') {
            courses = await courseModel.find(courseFilter)
                .sort(sortOptions)
                .limit(parseInt(limit))
                .skip(startIndex);
        } else if (filterType === 'lecture') {
            courses = await courseModel.find()
                .populate({
                    path: 'lecture',
                    match: lectureFilter
                })
                .sort(sortOptions)
                .limit(parseInt(limit))
                .skip(startIndex);
        } else {
            courses = await courseModel.find(courseFilter)
                .populate({
                    path: 'lecture',
                    match: lectureFilter
                })
                .sort(sortOptions)
                .limit(parseInt(limit))
                .skip(startIndex);
        }

        res.status(200).json(courses);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});


// POST request to create a new course
CourseRouter.post('/courses',auth, async (req, res) => {
    try {
        const newCourse = new courseModel(req.body);
        await newCourse.save();
        res.status(201).send(newCourse);
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: 'Server Error' });
    }
});

// PATCH request to update a course
CourseRouter.patch('/courses/:id',auth, async (req, res) => {
    try {
        const courseId = req.params.id;
        const updates = req.body;
        const options = { new: true };
        const updatedCourse = await Course.findByIdAndUpdate(courseId, updates, options);
        if (!updatedCourse) {
            return res.status(404).send({ message: 'Course not found' });
        }
        res.status(200).send(updatedCourse);
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: 'Server Error' });
    }
});

// PATCH request to add a new lecture to a course
CourseRouter.patch('/courses/:courseId',auth, async (req, res) => {
    try {
        const courseId = req.params.courseId;
        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).send({ message: 'Course not found' });
        }

        const newLecture = req.body;
        course.lecture.push(newLecture);
        await course.save();

        res.status(200).send(course);
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: 'Server Error' });
    }
});

// PATCH request to add a new notification to a course
CourseRouter.patch('/courses/:courseId',auth, async (req, res) => {
    try {
        const courseId = req.params.courseId;
        const course = await courseModel.findById(courseId);
        if (!course) {
            return res.status(404).send({ message: 'Course not found' });
        }

        const newLecture = req.body;
        course.lecture.push(newLecture);
        await course.save();

        res.status(200).send(course);
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: 'Server Error' });
    }
});

// POST request to add a new notification to a course
CourseRouter.post('/courses/:courseId/notifications',auth, async (req, res) => {
    try {
        const courseId = req.params.courseId;
        const course = await courseModel.findById(courseId);
        if (!course) {
            return res.status(404).send({ message: 'Course not found' });
        }

        const newNotification = req.body;
        course.notification.push(newNotification);
        await course.save();

        res.status(201).send(course);
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: 'Server Error' });
    }
});

// DELETE request to delete a course
CourseRouter.delete('/courses/:id',auth, async (req, res) => {
    try {
        const courseId = req.params.id;
        const deletedCourse = await Course.findByIdAndDelete(courseId);
        if (!deletedCourse) {
            return res.status(404).send({ message: 'Course not found' });
        }
        res.status(200).send({ message: 'Course deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: 'Server Error' });
    }
});






module.exports = CourseRouter;
