import { useEffect, useState } from "react";
import styled from "styled-components";
import { Box, Modal } from "@mui/material";

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

interface ISiteDetailsModal {
  modalText: string;
  isOpen: boolean;
  onClose: () => void;
}

const SiteDetailsModal: React.FC<ISiteDetailsModal> = ({
  modalText,
  isOpen,
  onClose,
}) => {
  return (
    <Modal
      open={isOpen}
      onClose={onClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        <div>{modalText}</div>
      </Box>
    </Modal>
  );
};

export default SiteDetailsModal;
