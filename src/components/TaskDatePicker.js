// src/components/TaskDatePicker.js
import React, { useState } from 'react';
import { DatePicker } from '@mui/x-date-pickers/DatePicker'; 
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'; 
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'; 
import TextField from '@mui/material/TextField';

const TaskDatePicker = () => {
  // State to hold the selected date
  const [selectedDate, setSelectedDate] = useState(null);

  // Get today's date (used to restrict past date selection)
  const today = new Date(); 

  // Handle the change of the date
  const handleDateChange = (newDate) => {
    setSelectedDate(newDate);
  };

  return (
    <div>
      <h3>Select Task Due Date</h3>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <DatePicker
          label="Select Due Date"
          value={selectedDate}
          onChange={handleDateChange} // Update the state when the date changes
          minDate={today}  // Prevent selecting past dates
          renderInput={(params) => <TextField {...params} />}
        />
      </LocalizationProvider>
    </div>
  );
};

export default TaskDatePicker;
