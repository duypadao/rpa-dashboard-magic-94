import dayjs from "dayjs";

export const formatDate = (dateString: string) => {
    try {
        return dayjs(dateString).format("YYYY-MM-DD");
    } catch (error) {
        return dateString;
    }
};

export const formatDateTime = (dateString: string) => {
    try {
        return dayjs(dateString).format("YYYY-MM-DD HH:mm:ss");
    } catch (error) {
        return dateString;
    }
}

export const formatDateTimeWithTimezone = (dateString: string) => {
    try {
        return dayjs(dateString).format("YYYY-MM-DD HH:mm:ss Z");
    } catch (error) {
        return dateString;
    }
}

export const formatDuration = (duration: string) => {
    //input: "00:11:31.9333579"
    //output: "HH:mm:ss.ss"
    try {
        const [hours, minutes, rest] = duration.split(":");
        const [seconds, fraction = ""] = rest.split(".");
        const milliseconds = fraction.substring(0, 2); // lấy 2 chữ số đầu tiên sau dấu chấm

        return `${hours.padStart(2, '0')}:${minutes.padStart(2, '0')}:${seconds.padStart(2, '0')}.${milliseconds.padEnd(2, '0')}`;
    } catch (error) {
        return duration;
    }
}
