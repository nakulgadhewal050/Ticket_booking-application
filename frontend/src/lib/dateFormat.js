export const dateFormat = (date) => {
    return new Date(date).toLocaleDateString("en-US",{
        weekday: "short",
        month: "short",
        day: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true
        
    });
}

export default dateFormat;