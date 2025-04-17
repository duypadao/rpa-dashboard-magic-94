import dayjs from "dayjs";

export const formatDateStr = (dateString: string) => {
    try {
        return dayjs(dateString).format("YYYY-MM-DD");
    } catch (error) {
        return dateString;
    }
};

export const formatDate = (date : Date) => {
    try {
        return dayjs(date).format("YYYY-MM-DD");
    } catch (error) {
        return date.toString();
    }
}

export const formatDateV2 = (date : Date) => {
    try {
        return dayjs(date).format("YY-MM-DD");
    } catch (error) {
        return date.toString();
    }
}

export const formatDateTime = (dateString: string | Date) => {
    try {
        return dayjs(dateString).format("YYYY-MM-DD HH:mm:ss");
    } catch (error) {
        return "Invalid date";
    }
}

export const formatTime = (dateString: string | Date) => {
    try {
        return dayjs(dateString).format("HH:mm:ss");
    } catch (error) {
        return "Invalid date";
    }
}



export const formatDuration = (duration: string) => {
    try {
        const [hours, minutes, rest] = duration.split(":");
        const [seconds, fraction = ""] = rest.split(".");
        const milliseconds = fraction.substring(0, 2); // lấy 2 chữ số đầu tiên sau dấu chấm

        return `${hours.padStart(2, '0')}:${minutes.padStart(2, '0')}:${seconds.padStart(2, '0')}.${milliseconds.padEnd(2, '0')}`;
    } catch (error) {
        return duration;
    }
}

export const formatDurationBySecond = (seconds: number) => {
    const hours = Math.floor(seconds / 3600).toString().padStart(2, '0');
    const minutes = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
    const secs = (seconds % 60).toString().padStart(2, '0');
    return `${hours}:${minutes}:${secs}s`
}

export const formatDurationBySecondToFixed = (seconds: number) => {
    const hours = Math.floor(seconds / 3600).toString().padStart(1, '0');
    return `${hours}h`
}

export const formatMonthYear = (date: Date) => {
    try {
        return dayjs(date).format("MMMM. YYYY");
    } catch (error) {
        return date.toString();
    }
}

export const formatSuccessRate = (failRate) => {
    return ((1 - failRate) * 100).toFixed(1) + '%';
  };