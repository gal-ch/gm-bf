import { useEffect, useState } from "react";
import styled from "styled-components";
import {
  Box,
  Button,
  FormControl,
  FormHelperText,
  Input,
  InputLabel,
  MenuItem,
  Modal,
  Select,
  Typography,
} from "@mui/material";
import { Store } from "./DistributionPointsTable";
import { AppApiService } from "../services/app-api.service";
import { useLocation } from "react-router-dom";

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid var(--border-color)",
  boxShadow: 24,
  p: 4,
};

interface IUserDetails {
  isOpen: boolean;
}

const UserDetailsModal: React.FC<IUserDetails> = ({ isOpen }) => {
  const [open, setOpen] = useState(isOpen);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [distributionPoints, setDistributionPoints] = useState<Store[]>([]);
  const apiService = new AppApiService();
  const [errors, setErrors] = useState({
    name: false,
    email: false,
    phone: false,
    distributionPoint: false,
  });
  const location = useLocation();
  const accountUrl = location.pathname.split("/")[1];

  useEffect(() => {
    setOpen(isOpen);

  }, [isOpen]);

  useEffect(() => {
    getDistributionPoints()
  }, []);

  const getDistributionPoints = async () => {
    const points = await apiService.stores.getStores(accountUrl);
    setDistributionPoints(points);
  };

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    if (name === "name") setName(value);
    if (name === "email") setEmail(value);
    if (name === "phone") setPhone(value);
    if (name === "distributionPoint") setDistributionPoints(value);
  };

  const validateForm = () => {
    const newErrors = {
      name: !name.trim(),
      email: !email.trim(),
      phone: !phone.trim(),
      distributionPoint: !distributionPoints,
    };
    setErrors(newErrors);
    return !Object.values(newErrors).includes(true);
  };

  const handleSave = () => {
    if (validateForm()) {
      const userDetails = { name, email, phone, distributionPoint: distributionPoints };
      localStorage.setItem("userDetails", JSON.stringify(userDetails));
      setOpen(false);
    }
  };

  return (
    <Modal
      open={isOpen}
      onClose={(e: any) => e.preventDefault()} // Prevent closing the modal
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        <Typography id="modal-modal-title" variant="h6" component="h2">
          מלא את הפרטים הבאים:
        </Typography>
        <InputContainer>
          <FormControl error={errors.name} variant="standard">
            <InputLabel htmlFor="name">שם מלא</InputLabel>
            <Input
              id="name"
              name="name"
              value={name}
              onChange={handleChange}
              aria-describedby="name-error-text"
            />
            {errors.name && (
              <FormHelperText id="name-error-text">
                Error: נא למלא שם מלא
              </FormHelperText>
            )}
          </FormControl>
          <FormControl error={errors.email} variant="standard">
            <InputLabel htmlFor="email">אימייל</InputLabel>
            <Input
              id="email"
              name="email"
              value={email}
              onChange={handleChange}
              aria-describedby="email-error-text"
            />
            {errors.email && (
              <FormHelperText id="email-error-text">
                נא למלא אימייל
              </FormHelperText>
            )}
          </FormControl>
          <FormControl error={errors.phone} variant="standard">
            <InputLabel htmlFor="phone">טלפון</InputLabel>
            <Input
              id="phone"
              name="phone"
              value={phone}
              onChange={handleChange}
              aria-describedby="phone-error-text"
            />
            {errors.phone && (
              <FormHelperText id="phone-error-text">
                נא למלא טלפון
              </FormHelperText>
            )}
          </FormControl>
          <FormControl error={errors.distributionPoint} variant="standard">
            <InputLabel id="distribution-points-label">נקודת חלוקה</InputLabel>
            <Select
              labelId="distribution-points-label"
              id="distribution-points-input"
              name="distributionPoint"
              value={distributionPoints}
              onChange={handleChange}
            >
              {distributionPoints?.map((point) => (
                <MenuItem key={point.id} value={point.name}>
                  {point.name}
                </MenuItem>
              ))}
            </Select>
            {/* {errors.distributionPoint && (
              <FormHelperText id="distribution-point-error-text">
                נא לבחור נקודת חלוקה
              </FormHelperText>
            )} */}
          </FormControl>

          <Button onClick={handleSave}>שמור</Button>
        </InputContainer>
      </Box>
    </Modal>
  );
};

const InputContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 16px;
  text-align: right;
`;
export default UserDetailsModal;
