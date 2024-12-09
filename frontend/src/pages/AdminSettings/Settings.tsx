import {
  Button,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  TextField,
} from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { BackOfficeApiService } from "../../services/back-office-api.service";
import { toast, ToastContainer } from "react-toastify";
import Icon from "../../components/Icon";
import "react-toastify/dist/ReactToastify.css";

const Settings: React.FC = () => {
  const [closingHour, setClosingHour] = useState<string>("");
  const [closingDate, setClosingDate] = useState<string>("");
  const [freeText, setFreeText] = useState<string>("");
  const [headImg, setHeadImg] = useState<{
    headImg: File | null;
    imagePreviewUrl: string;
  } | null>(null);
  const [name, setName] = useState<string>("");
  const [accountNumber, setAccountNumber] = useState<string>();
  const [idNumber, setIdNUmber] = useState<string>();
  const apiService = new BackOfficeApiService();

  const hours = [];
  for (let hour = 0; hour < 24; hour++) {
    const hourString = hour?.toString().padStart(2, "0");
    hours.push({ value: hour?.toString(), label: `${hourString}:00` });
  }

  useEffect(() => {
    getClosingTimeAndDate();
  }, []);

  const getClosingTimeAndDate = async () => {
    const account = await apiService.account.getAccount();
    const { settings, headImg } = account || {};
    setClosingHour(settings?.closingHour);
    setClosingDate(settings?.closingDate);
    setFreeText(settings?.freeText);
    setHeadImg({ headImg: null, imagePreviewUrl: headImg });
    setName(settings?.name);
  };

  const handleChange = (event: SelectChangeEvent) => {
    setClosingHour(event?.target.value);
  };

  const onSaveSettings = async () => {
    try {
      const formData = new FormData();
      formData.append(
        "settings",
        JSON.stringify({ closingDate, closingHour, freeText, name })
      );
      if (headImg?.headImg) {
        formData.append("headImg", headImg.headImg); // Ensure this is a File object
      }

      await apiService.account.updateAccount(formData);

      toast.success("ההגדרות עודכנו בהצלחה");
    } catch (e) {
      toast.error("עדכון נקודת מכירה נכשל, אנא נסה נסית במועד מאוחר יותר");
      console.error("Error creating product:", e);
    }
  };

  const onChangeHeadImage = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const file = event?.target?.files[0];
      const img = new Image();
      const imageData = {
        headImg: file,
        imagePreviewUrl: URL?.createObjectURL(file),
      };
      img.src = URL.createObjectURL(file);
      img.onload = () => {
        const aspectRatio = img.width / img.height;
        if (aspectRatio < 1.5) {
          toast.error("התמונה קטנה מידי, אנא עלה תמונה ביחס של 5:1");
        } else {
          setHeadImg(imageData);
        }
      };
    }
  };

  return (
    <SettingsWrapper>
      <ToastContainer position="top-center" />
      <Section>
        <SectionTitle>פרטי העסק</SectionTitle>
        <FieldLabel>בחר שעה ותאריך סגירת ההזמנות</FieldLabel>
        <FormControl sx={{ width: "500px" }}>
          <InputLabel>שעה</InputLabel>
          <Select value={closingHour} onChange={handleChange}>
            {hours.map((hour) => (
              <MenuItem key={hour?.value} value={hour?.value}>
                {hour.label}
              </MenuItem>
            ))}
          </Select>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              minDate={dayjs()}
              value={dayjs(closingDate)}
              onChange={(value) => {
                const dateString = value?.format("YYYY-MM-DD") || "";
                setClosingDate(dateString);
              }}
            />
          </LocalizationProvider>
        </FormControl>

        <FieldLabel>הכנס מידע כללי אשר יופיע ללקוח בעת כניסתו לאתר</FieldLabel>
        <FormControl fullWidth>
          <TextField
            label="טקסט חופשי"
            value={freeText}
            multiline
            rows={6}
            onChange={(event) => setFreeText(event.target.value)}
            inputProps={{
              sx: { textAlign: "right" },
            }}
          />
        </FormControl>

        <FieldLabel>תמונה ראשית</FieldLabel>
        <FormControl>
          {headImg ? (
            <div style={{ display: "flex", alignItems: "center" }}>
              <img src={headImg.imagePreviewUrl} alt="Preview" width="50" />
              <IconButton onClick={() => setHeadImg(null)}>{"x"}</IconButton>
            </div>
          ) : (
            <Button
              component="label"
              variant="contained"
              startIcon={<Icon type="add" />}
            >
              העלה
              <input
                type="file"
                hidden
                onChange={(event) => {
                  if (event.target.files && event.target.files[0]) {
                    onChangeHeadImage(event);
                  }
                }}
              />
            </Button>
          )}
        </FormControl>

        <FieldLabel>שם העסק</FieldLabel>
        <FormControl sx={{ width: "500px" }}>
          <TextField
            value={name}
            onChange={(event) => setName(event.target.value)}
            size="small"
            inputProps={{
              style: { textAlign: "right" },
            }}
          />
        </FormControl>
      </Section>

      <Section>
        <SectionTitle>פרטי סליקה</SectionTitle>
        <FieldLabel>מספר חשבון</FieldLabel>
        <FormControl sx={{ width: "500px" }}>
          <TextField
            value={accountNumber}
            onChange={(event) => setAccountNumber(event.target.value)}
            size="small"
            inputProps={{
              style: { textAlign: "right" },
            }}
          />
        </FormControl>
        <FieldLabel> תז/ח״פ</FieldLabel>
        <FormControl sx={{ width: "500px" }}>
          <TextField
            value={idNumber}
            onChange={(event) => setIdNUmber(event.target.value)}
            size="small"
            inputProps={{
              style: { textAlign: "right" },
            }}
          />
        </FormControl>
      </Section>

      <SaveButton variant="contained" onClick={onSaveSettings}>
        שמור
      </SaveButton>
    </SettingsWrapper>
  );
};

export default Settings;

const SettingsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 32px;
  max-width: 800px;
  margin: auto;
  background-color: #f9f9f9;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  text-align: right;
`;

const Section = styled.div`
  background-color: #ffffff;
  padding: 20px;
  border: 1px solid var(--border-color);
  border-radius: 8px;
`;

const SectionTitle = styled.h3`
  font-size: 1.25em;
  font-weight: 500;
  margin-bottom: 12px;
  color: #333;
  text-align: right;
`;

const FieldLabel = styled.h4`
  font-size: 1em;
  font-weight: 400;
  margin-bottom: 8px;
  color: #666;
  text-align: right;
`;

const PreviewImage = styled.img`
  width: 200px;
  height: auto;
  margin-bottom: 16px;
  border-radius: 4px;
`;

const SaveButton = styled(Button)`
  margin-top: 200px;
  align-self: flex-end;
  font-weight: 500;
  padding: 10px 24px;
  background-color: #f9dc5c;
  color: #f9dc5c;
  &:hover {
    background-color: #f9dc5c;
  }
`;
