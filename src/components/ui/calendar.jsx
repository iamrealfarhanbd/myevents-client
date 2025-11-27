import * as React from "react";
import ReactCalendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "./calendar-custom.css";

function Calendar({ value, onChange, ...props }) {
  return (
    <ReactCalendar
      value={value}
      onChange={onChange}
      minDate={new Date()}
      {...props}
    />
  );
}

export { Calendar };
