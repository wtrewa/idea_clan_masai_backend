const { default: mongoose } = require("mongoose");



const lectureSchema = new mongoose.Schema({
    lecture_name: { type: String, required: true },
    lecture_teacher: { type: String, required: true },
    lecture_start: { type: Date, required: true },
    lecture_end: { type: Date, required: true },
    lecture_link: { type: String, required: true },
    description: { type: String },
    record_lecture: { type: String }
});

const notificationSchema = new mongoose.Schema({
    notificationName: { type: String, required: true },
    notificationDate: { type: Date, default: Date.now },
    notificationDescription: { type: String, required: true }
});

const courseSchema = new mongoose.Schema({
    courseName: { type: String, required: true },
    description: { type: String, required: true },
    lecture: [lectureSchema],
    notification: [notificationSchema]
});

const courseModel = mongoose.model('course', courseSchema);

module.exports = courseModel;
