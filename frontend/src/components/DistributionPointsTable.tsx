import React, { useEffect, useState } from "react";
import {
  Button,
  TextField,
  Checkbox,
  Select,
  MenuItem,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Table,
  Paper,
  SelectChangeEvent,
} from "@mui/material";
import IPageWrapper from "./IPageWrapper";
import { DropDownSelectOption } from "../types/Catalog";
import styled from "styled-components";
import { BackOfficeApiService } from "../services/back-office-api.service";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Store type definition
export type Store = {
  id: number;
  status: boolean;
  name: string;
  manager: string;
  managerEmail: string;
  address: string;
  day: string;
  closingDay: string;
  hour: string;
  description: string;
};

// Predefined hours and days for dropdown options
const hours: DropDownSelectOption[] = Array.from({ length: 24 }, (_, hour) => {
  const hourString = hour.toString().padStart(2, "0");
  return { value: hour.toString(), name: `${hourString}:00` };
});

const daysOfWeek: DropDownSelectOption[] = [
  { value: "Sunday", name: "ראשון" },
  { value: "Monday", name: "שני" },
  { value: "Tuesday", name: "שלישי" },
  { value: "Wednesday", name: "רביעי" },
  { value: "Thursday", name: "חמישי" },
  { value: "Friday", name: "שישי" },
  { value: "Saturday", name: "שבת" },
];

const getDaysMap = {
  Sunday: "ראשון",
  Monday: "שני",
  Tuesday: "שלישי",
  Wednesday: "רביעי",
  Thursday: "חמישי",
  Friday: "שישי",
  Saturday: "שבת",
} as Record<string, string>;

// Main component for distribution points management
const DistributionPointsTable = () => {
  const [rows, setRows] = useState<Store[]>([]);
  const [newRow, setNewRow] = useState<Store>(initialStore());
  const [editingRowIndex, setEditingRowIndex] = useState<number | null>(null);
  const apiService = new BackOfficeApiService();

  // Initial store state
  function initialStore(): Store {
    return {
      id: -1,
      status: false,
      name: "",
      manager: "",
      managerEmail: "",
      address: "",
      day: "",
      closingDay: "",
      hour: "",
      description: "",
    };
  }

  const handleAddRow = async () => {
    if (isAllFieldsFulfilled(newRow)) {
      await apiService.stores.createStore(newRow);
      setRows([...rows, newRow]);
      setNewRow(initialStore());
    }
  };

  const handleInputChange = (
    index: number,
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { value, name, type, checked } = event.target;
    const updatedRows = [...rows];
    updatedRows[index] = {
      ...updatedRows[index],
      [name]: type === "checkbox" ? checked : value,
    };
    setRows(updatedRows);
  };

  const handleNewRowChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event || !event.target) return;
    try {
      const { name, value, type, checked } = event.target;
      setNewRow({
        ...newRow,
        [name]: type === "checkbox" ? checked : value,
      });
    } catch (e) {
      console.error("Error creating product:", e);
    }
  };

  // Save changes for an edited row
  const handleSaveRow = async () => {
    try {
      if (editingRowIndex !== null) {
        const rowToUpdate = rows[editingRowIndex];
        if (rowToUpdate?.id)
          await apiService.stores.updateStore(rowToUpdate.id, rowToUpdate);
        setEditingRowIndex(null);
        toast.success("נקודת מכירה עודכנה בהצלחה");
      }
    } catch (e) {
      toast.error("עדכון נקודת מכירה נכשל, אנא נסה נסית במועד מאוחר יותר");
      console.error("Error creating product:", e);
    }
  };

  useEffect(() => {
    apiService.stores.getStores().then(setRows);
  }, []);

  return (
    <PageWrapper>
      <ToastContainer position="top-center" />
      <Table component={Paper}>
        <TableHead>
          <TableRow>
            <TableCell>סטטוס</TableCell>
            <TableCell>שם</TableCell>
            <TableCell>כתובת</TableCell>
            <TableCell>מנהל</TableCell>
            <TableCell>אימייל</TableCell>
            <TableCell>שעת התחלה</TableCell>
            <TableCell>יום חלוקה</TableCell>
            <TableCell>יום סגירת ההזמנות</TableCell>
            <TableCell>תיאור</TableCell>
            <TableCell>עדכן</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row, index) => (
            <Row
              hover
              key={index}
              row={row}
              index={index}
              isEditing={editingRowIndex === index}
              onEdit={handleInputChange}
              onSave={handleSaveRow}
              onClick={() => setEditingRowIndex(index)}
            />
          ))}
          <NewRow
            newRow={newRow}
            onAdd={handleAddRow}
            onChange={handleNewRowChange}
            isValid={isAllFieldsFulfilled(newRow)}
          />
        </TableBody>
      </Table>
    </PageWrapper>
  );
};

const Row = ({ row, index, isEditing, onEdit, onSave, onClick }: any) => (
  <TableRow hover onClick={onClick}>
    {isEditing ? (
      <>
        <EditableRow row={row} onChange={onEdit} index={index} />
        <TableCell>
          <Button variant="contained" onClick={onSave}>
            Save
          </Button>
        </TableCell>
      </>
    ) : (
      <>
        <StaticRow row={row} />
        <TableCell>
          <Button variant="contained">Edit</Button>
        </TableCell>
      </>
    )}
  </TableRow>
);

// Render static row
const StaticRow = ({ row }: any) => (
  <>
    <TableCell>{row.status ? "פעיל" : "לא פעיל"}</TableCell>
    <TableCell>{row.name}</TableCell>
    <TableCell>{row.address}</TableCell>
    <TableCell>{row.manager}</TableCell>
    <TableCell>{row.managerEmail}</TableCell>
    <TableCell>{row.hour}</TableCell>
    <TableCell>{getDaysMap[row.day]}</TableCell>
    <TableCell>{getDaysMap[row.closingDay]}</TableCell>
    <TableCell>{row.description}</TableCell>
  </>
);

// Render editable row with inputs
const EditableRow = ({ index, row, onChange }: any) => (
  <>
    <TableCell>
      <Checkbox
        name="status"
        size="small"
        checked={row.status}
        onChange={(e) => (index === -1 ? onChange(e) : onChange(index, e))}
      />
    </TableCell>
    <TableCell>
      <TextField
        name="name"
        size="small"
        value={row.name}
        onChange={(e) => (index === -1 ? onChange(e) : onChange(index, e))}
      />
    </TableCell>
    <TableCell>
      <TextField
        name="address"
        size="small"
        value={row.address}
        onChange={(e) => (index === -1 ? onChange(e) : onChange(index, e))}
      />
    </TableCell>
    <TableCell>
      <TextField
        name="manager"
        size="small"
        value={row.manager}
        onChange={(e) => (index === -1 ? onChange(e) : onChange(index, e))}
      />
    </TableCell>
    <TableCell>
      <TextField
        name="managerEmail"
        size="small"
        value={row.managerEmail}
        onChange={(e) => (index === -1 ? onChange(e) : onChange(index, e))}
      />
    </TableCell>
    <TableCell>
      <SelectDropdown
        name="hour"
        value={row.hour}
        options={hours}
        onChange={(e) => (index === -1 ? onChange(e) : onChange(index, e))}
      />
    </TableCell>
    <TableCell>
      <SelectDropdown
        name="day"
        value={row.day}
        options={daysOfWeek}
        onChange={(e) => (index === -1 ? onChange(e) : onChange(index, e))}
      />
    </TableCell>
    <TableCell>
      <SelectDropdown
        name="closingDay"
        value={row.closingDay}
        options={daysOfWeek}
        onChange={(e) => (index === -1 ? onChange(e) : onChange(index, e))}
      />
    </TableCell>
    <TableCell>
      <TextField
        name="description"
        size="small"
        value={row.description}
        onChange={(e) => (index === -1 ? onChange(e) : onChange(index, e))}
      />
    </TableCell>
  </>
);

const SelectDropdown = ({
  name,
  value,
  options,
  onChange,
}: {
  name: string;
  value: string;
  options: DropDownSelectOption[];
  onChange: (event: SelectChangeEvent) => void;
}) => (
  <Select
    size="small"
    name={name}
    value={value}
    onChange={(event) => onChange(event)}
  >
    {options.map((option: DropDownSelectOption) => (
      <MenuItem key={option.value} value={option.value}>
        {option.name}
      </MenuItem>
    ))}
  </Select>
);

const NewRow = ({ newRow, onAdd, onChange, isValid }: any) => (
  <TableRow>
    <EditableRow row={newRow} onChange={(e: any) => onChange(e)} index={-1} />
    <TableCell>
      <Button variant="contained" disabled={!isValid} onClick={onAdd}>
        Add
      </Button>
    </TableCell>
  </TableRow>
);

// Check if all fields in a row are filled
const isAllFieldsFulfilled = (row: Store) => {
  return (
    row.name &&
    row.address &&
    row.day &&
    row.hour &&
    row.manager &&
    row.managerEmail
  );
};

const PageWrapper = styled(IPageWrapper)`
  height: calc(100% - 24px);
  overflow: auto;
  th,
  td {
    text-align: right;
  }
`;

export default DistributionPointsTable;
