class ScheduleItem {
    #date;
    #startTime;
    #endTime;
    #name;

    constructor(scheduleItem) {
        this.#date = scheduleItem.date;
        this.#startTime = scheduleItem.startTime;
        this.#endTime = scheduleItem.endTime;
        this.#name = scheduleItem.name;
    }

    getDate() {
        return this.#date;
    }

    getStartTime() {
        return this.#startTime;
    }

    getEndTime() {
        return this.#endTime;
    }

    getName() {
        return this.#name;
    }

    setDate(date) {
        this.#date = date;
    }

    setStartTime(startTime) {
        this.#startTime = startTime;
    }

    setEndDate(endTime) {
        this.#endTime = endTime;
    }

    setName(name) {
        this.#name = name;
    }
}