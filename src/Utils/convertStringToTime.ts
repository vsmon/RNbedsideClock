export default function convertStringToTime(time: string) {
  const clearTime: string = time.replace(/(am|pm|a\.m\.|p\.m\.)/g, "").trim();
  const [hours, minutes, seconds] = clearTime.split(":").map(Number);
  const date = new Date();
  date.setHours(hours);
  date.setMinutes(minutes);
  date.setSeconds(seconds);
  return date;
}
