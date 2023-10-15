export const parseMillisecondsIntoReadableTime = (milliseconds) => {
    //Get days from milliseconds
    let days = milliseconds / (1000*60*60*24);
    let absoluteDays = Math.floor(days);
    let d = absoluteDays > 0 ? absoluteDays : '0' + absoluteDays;

    //Get hours from milliseconds
    let hours = (days - absoluteDays) * 24;
    let absoluteHours = Math.floor(hours);
    let h = absoluteHours > 0 ? absoluteHours : '0' + absoluteHours;

    //Get remainder from hours and convert to minutes
    let minutes = (hours - absoluteHours) * 60;
    let absoluteMinutes = Math.floor(minutes);
    let m = absoluteMinutes > 0 ? absoluteMinutes : '0' +  absoluteMinutes;

    return `${d}d ${h}h ${m}m`
}