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
