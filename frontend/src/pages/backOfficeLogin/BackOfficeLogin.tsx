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
import { BackOfficeApiService } from "../../services/back-office-api.service";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import IPageWrapper from "../../components/IPageWrapper";

export function BackOfficeLogin() {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const apiService = new BackOfficeApiService();
  const navigate = useNavigate();
  const { login: authLogin } = useAuth();
  const handleLogin = async () => {
    setError(null);
    if (!username || !password) {
      setError("Please enter both username and password.");
      return;
    }

    try {
      setLoading(true);
      const { access_token, account } = await apiService.account.login(
        username,
        password
      );

      authLogin(access_token);
      const { siteUrl } = account;
      navigate(`/${siteUrl}/admin-settings`);
    } catch (error: any) {
      setError(
        error?.response?.data?.message || "Login failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageWrapper>
      <LoginContainer>
        <Typography variant="h4" align="center" gutterBottom>
          התחברות
        </Typography>
        <Typography variant="body1" align="center" color="textSecondary">
          התחברו עם אימייל וסיסמא
        </Typography>

        {error && <Alert severity="error">{error}</Alert>}
        <FormControl fullWidth>
          <StyledTextField
            variant="outlined"
            onChange={(e) => setUsername(e.target.value)}
            placeholder="אימייל"
            inputProps={{
              style: { textAlign: "right" },
            }}
            fullWidth
          />
        </FormControl>
        <StyledTextField
          variant="outlined"
          type="password"
          onChange={(e) => setPassword(e.target.value)}
          placeholder="סיסמא"
          fullWidth
          inputProps={{
            style: { textAlign: "right" },
          }}
        />

        <ActionContainer>
          <Button
            color="primary"
            onClick={() => alert("Password reset link sent!")}
          >
            שכחת סיסמא?
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={handleLogin}
            disabled={loading}
            fullWidth
          >
            {loading ? <CircularProgress size={24} /> : "Login"}
          </Button>
        </ActionContainer>
      </LoginContainer>
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
