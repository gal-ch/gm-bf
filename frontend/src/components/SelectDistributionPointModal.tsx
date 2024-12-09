import { useEffect, useState } from "react";
import styled from "styled-components";
import {
  Box,
  Button,
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Modal,
  Select,
  Typography,
} from "@mui/material";
import { Store } from "./DistributionPointsTable";
import { AppApiService } from "../services/app-api.service";

const modalStyle = {
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

interface ISelectDistributionPointModal {
  isOpen: boolean;
  onChangeDistributionPoint: () => void;
  hasDistributionPoint: boolean;
  onClose: () => void;
  distributionPoints: Store[];
}

const SelectDistributionPointModal: React.FC<ISelectDistributionPointModal> = ({
  isOpen,
  onChangeDistributionPoint,
  hasDistributionPoint,
  onClose,
  distributionPoints,
}) => {
  const [open, setOpen] = useState(isOpen);
  const [selectedDistributionPoint, setSelectedDistributionPoint] = useState<
    Store | undefined
  >();
  const [errors, setErrors] = useState({ distributionPoint: false });

  useEffect(() => {
    setOpen(isOpen);
  }, [isOpen]);

  const handleChange = (event: any) => {
    const selectedPoint = distributionPoints.find(
      (point) => point.name === event.target.value
    );
    setSelectedDistributionPoint(selectedPoint);
  };

  const validateForm = () => {
    const hasError = !selectedDistributionPoint;
    setErrors({ distributionPoint: hasError });
    return !hasError;
  };

  const handleSave = () => {
    if (validateForm()) {
      localStorage.setItem(
        "distributionPoint",
        JSON.stringify(selectedDistributionPoint)
      );
      setOpen(false);
      onClose();
    }
  };

  return (
    <Modal
      open={open}
      onClose={(e: React.MouseEvent) => e.preventDefault()} // Prevent closing the modal
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={modalStyle}>
        <ContentContainer>
          <Typography
            id="modal-modal-title"
            variant="h6"
            component="h2"
            align="center"
          >
            ברוכים הבאים
          </Typography>
          <Typography variant="body1" align="center">
            כדי להתחיל, בחרו נקודת חלוקה ממנה תאספו את המוצרים
          </Typography>
          <FormControl
            fullWidth
            error={errors.distributionPoint}
            variant="standard"
            sx={{ mt: 2 }}
          >
            <InputLabel id="distribution-points-label">נקודת חלוקה</InputLabel>
            <Select
              labelId="distribution-points-label"
              id="distribution-points-input"
              name="distributionPoint"
              value={selectedDistributionPoint?.name || ""}
              onChange={handleChange}
            >
              {distributionPoints.map((point) => (
                <MenuItem key={point.id} value={point.name}>
                  {point.name}
                </MenuItem>
              ))}
            </Select>
            {errors.distributionPoint && (
              <FormHelperText>נא לבחור נקודת חלוקה</FormHelperText>
            )}
          </FormControl>
          {selectedDistributionPoint && (
            <Typography variant="body2" sx={{ mt: 2, textAlign: "center" }}>
              {` ${selectedDistributionPoint.hour}:00 המוצרים יחולקו ביום ${selectedDistributionPoint.day} בשעה`}
            </Typography>
          )}

          {hasDistributionPoint ? (
            <div>
              אם תשנה את נקודת החלוקה העגלה שלך תתאפס
              <Button
                variant="contained"
                onClick={() => {
                  onChangeDistributionPoint();
                  handleSave();
                }}
                sx={{ mt: 3 }}
              >
                שמור
              </Button>
              <Button variant="contained" onClick={handleSave} sx={{ mt: 3 }}>
                בטל
              </Button>
            </div>
          ) : (
            <Button variant="contained" onClick={handleSave} sx={{ mt: 3 }}>
              שמור
            </Button>
          )}
        </ContentContainer>
      </Box>
    </Modal>
  );
};

const ContentContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
`;

export default SelectDistributionPointModal;
