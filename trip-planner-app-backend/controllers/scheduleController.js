const Schedule = require('../models/schedule.js');
const ScheduleItem = require('../objects/ScheduleItem.js')

const addSchedule = async (req, res) => {
    const {tripId} = req.body;

    try{ 
        const scheduleExisted = await Schedule.findOne({tripId: tripId});

        if(scheduleExisted){
            return res.json({
                success: false,
                message: "Schedule existed already."
            });
        }

        const newSchedule = Schedule({
            tripId: tripId,
            scheduleItems: []
        });

        return res.json({
            success: true,
            message: "Schedule is added successfully."
        });

    } catch(error) {
        return res.json({
            success: false,
            message: "Error occurred. Please try again.",
            error: error
        });
    }

}

const deleteSchedule = async (req, res) => {
    const {tripId} = req.body;

    try {
        await Schedule.deleteOne({tripId: tripId});

        return res.json({
            success: true,
            message: "Schedule is deleted successfully."
        });

    } catch(error) {
        return res.json({
            success: false,
            message: "Error occurred. Please try again.",
            error: error
        });
    }
}

const updateSchedule = async (req, res) => {
    const {tripId, scheduleItems} = req.body;

    try {

        const schedule = await Schedule.findOne({tripId: tripId});

        schedule.scheduleItems = scheduleItems.map((scheduleItem) => {
            return new ScheduleItem(scheduleItem)
        });

        await schedule.save();

        return res.json({
            success: true,
            message: "Schedule items are added successfully."
        });

    } catch(error) {
        return res.json({
            success: false,
            message: "Error occurred. Please try again.",
            error: error
        });
    }
}

module.exports = {
    addSchedule,
    deleteSchedule,
    updateSchedule
}