import React from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import styled from "styled-components";

interface DateRangePickerProps {
  startDate: Date | undefined;
  endDate: Date | undefined;
  setStartDate: (date: Date | undefined) => void;
  setEndDate: (date: Date | undefined) => void;
}

const DateRangePicker: React.FC<DateRangePickerProps> = ({
  startDate,
  endDate,
  setStartDate,
  setEndDate,
}) => {
  return (
    <PickerWrapper>
      <PickerField>
        <Label htmlFor="start-date">תאריך התחלה</Label>
        <DatePicker
          id="start-date"
          selected={startDate}
          onChange={(date) => setStartDate(date || undefined)}
          selectsStart
          startDate={startDate}
          endDate={endDate}
          placeholderText="Select start date"
          dateFormat="dd/MM/yyyy"
          className="date-picker"
        />
      </PickerField>
      <PickerField>
        <Label htmlFor="end-date">תאריך סיום</Label>
        <DatePicker
          id="end-date"
          selected={endDate}
          onChange={(date) => setEndDate(date || undefined)}
          selectsEnd
          startDate={startDate}
          endDate={endDate}
          minDate={startDate}
          placeholderText="Select end date"
          dateFormat="dd/MM/yyyy"
          className="date-picker"
        />
      </PickerField>
    </PickerWrapper>
  );
};

const PickerWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: left;
  gap: 50px;
  padding: 10px;
  border-radius: 8px;
  .date-picker {
    padding: 8px 12px;
    font-size: 14px;
    border: 1px solid #ccc;
    border-radius: 4px;
    background: #f7f6f6;
    color: #333;
    &:focus {
      border-color: #505050;
      outline: none;
      box-shadow: 0 0 5px rgba(0, 123, 255, 0.5);
    }
  }
`;

const PickerField = styled.div`
  display: flex;
  flex-direction: column;
  width: 150px;
`;

const Label = styled.label`
  font-size: 14px;
  color: #333;
  margin-bottom: 8px;
  text-align: right;
`;

export default DateRangePicker;
