import React, { useState } from "react";
import {
  Button,
  TextField,
  Alert,
  Typography,
  CircularProgress,
  FormControl,
} from "@mui/material";
import styled from "styled-components";
import IPageWrapper from "./IPageWrapper";

export function NotFound() {


  return (
    <PageWrapper>
        <div>ddfdsfsfdsfsdf</div>
    </PageWrapper>
  );
}

const PageWrapper = styled(IPageWrapper)`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f0f2f5;
  margin-top: 18px;
`;

const LoginContainer = styled.div`
  width: 100%;
  max-width: 400px;
  background-color: #ffffff;
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 60px;
`;

const ActionContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 16px;
  gap: 8px;
`;

const StyledTextField = styled(TextField)`
  margin: 12px 0 !important;
`;
