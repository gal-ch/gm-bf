import React, { useEffect, useState } from "react";
import styled from "styled-components";
import {
  Button,
  FormControl,
  FormHelperText,
  Input,
  InputLabel,
  Snackbar,
  Alert,
} from "@mui/material";
import { Currency } from "../types/Catalog";
import { useStore } from "../stores/StoreContext";
import { AppApiService } from "../services/app-api.service";
import { useLocation, useNavigate } from "react-router-dom";
import { OrderDetails } from "../pages/Cart";

interface ITotalSummary {
  handelOnCheckout: (orderDetails: OrderDetails) => void;
}

const TotalSummary: React.FC<ITotalSummary> = ({handelOnCheckout}) => {
  const { productStore } = useStore();
  const apiService = new AppApiService();
  const userDetails = JSON.parse(localStorage.getItem("userDetails") || "{}");

  const [clientName, setClientName] = useState(userDetails?.name || "");
  const [clientEmail, setClientEmail] = useState(userDetails?.email || "");
  const [clientPhoneNumber, setClientPhoneNumber] = useState(
    userDetails?.phone || ""
  );
  const [store, setStore] = useState(
    JSON.parse(localStorage.getItem("distributionPoint") || "{}")
  );
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const [creditCardNumber, setCreditCardNumber] = useState("");
  const [creditCardExpiration, setCreditCardExpiration] = useState("");
  const [creditCardCvv, setCreditCardCvv] = useState("");
  const [citizenID, setCitizenID] = useState("");
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [errors, setErrors] = useState({
    name: false,
    email: false,
    phone: false,
    creditCardNumber: false,
    creditCardCvv: false,
    creditCardExpiration: false,
    citizenID: false,
  });
  const location = useLocation();
  const accountUrl = location.pathname.split("/")[1];
  const navigate = useNavigate();

  useEffect(() => {
    const calculateTotalPrice = () => {
      let total = 0;
      productStore.cartProducts.forEach(
        (item) => (total += item.product.price * item.quantity)
      );
      setTotalPrice(total);
    };

    calculateTotalPrice();
    setStore(productStore.selectedDistributionPoint);
  }, [productStore.cartProducts, productStore.selectedDistributionPoint]);

  const validateForm = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^\d{10}$/;
    const creditCardRegex = /^\d{13,19}$/;
    const cvvRegex = /^\d{3,4}$/;
    const idRegex = /^\d{9}$/;
    const expirationRegex = /^(0[1-9]|1[0-2])\/\d{2}$/;

    const expirationDateValid = (() => {
      if (!creditCardExpiration.match(expirationRegex)) return false;
      const [month, year] = creditCardExpiration.split("/").map(Number);
      const currentYear = new Date().getFullYear() % 100;
      const currentMonth = new Date().getMonth() + 1;
      return (
        year > currentYear || (year === currentYear && month >= currentMonth)
      );
    })();

    const newErrors = {
      name: !clientName.trim(),
      email: !emailRegex.test(clientEmail),
      phone: !phoneRegex.test(clientPhoneNumber),
      creditCardNumber: !creditCardRegex.test(creditCardNumber),
      creditCardCvv: !cvvRegex.test(creditCardCvv),
      creditCardExpiration: !expirationDateValid,
      citizenID: !idRegex.test(citizenID),
    };
    setErrors(newErrors);
    return !Object.values(newErrors).includes(true);
  };

  const onCheckout = async () => {
    if (!validateForm()) return;

    const cardDetails = {
      creditCardNumber,
      creditCardCvv,
      creditCardExpiration,
      citizenID,
    };

    const orderDetails = {
      clientName,
      clientEmail,
      clientPhoneNumber,
      store,
      details: productStore.cartProducts.map((product)=> ({
        productId: product.product.id,
        productName: product.product.name,
        price: product.product.price,
        amount: product.quantity,

      })),
      accountUrl,
    };

    try {
      const response = await apiService.orders.checkout({
        orderDetails,
        cardDetails,
      });
      //  if (response?.status === 200) {
      setPaymentSuccess(true);
      localStorage.setItem(
        "userDetails",
        JSON.stringify({
          name: clientName,
          email: clientEmail,
          phone: clientPhoneNumber,
        })
      );
      productStore.removeAllProductsFromCart();
      navigate(`/${accountUrl}`);
      // }
    } catch (error) {
      console.error("Payment failed:", error);
    }
  };

  return (
    <TotalSummaryWrapper>
      <h2>
        סך הכל: {Currency.ILS} {totalPrice.toFixed(2)}
      </h2>
      <h2>סיכום הזמנה</h2>

      <OrderSummary>
        <p>הזמנה עבור: {clientName}</p>
        <p>
          איסוף מ: {store?.address} {store?.name}
        </p>
        <p>
          סך לתשלום: {Currency.ILS} {totalPrice.toFixed(2)}
        </p>
      </OrderSummary>

      <UserDetails>
        <DetailForm
          label="שם מלא"
          value={clientName}
          setValue={setClientName}
          error={errors.name}
          helperText="נא למלא שם מלא"
        />
        <DetailForm
          label="אימייל"
          value={clientEmail}
          setValue={setClientEmail}
          error={errors.email}
          helperText="נא למלא אימייל"
        />
        <DetailForm
          label="טלפון"
          value={clientPhoneNumber}
          setValue={setClientPhoneNumber}
          error={errors.phone}
          helperText="נא למלא טלפון"
        />
      </UserDetails>

      <CardDetails>
        <h3>פרטי כרטיס אשראי</h3>
        <DetailForm
          label="מספר כרטיס"
          value={creditCardNumber}
          setValue={setCreditCardNumber}
          error={errors.creditCardNumber}
          helperText="מספר כרטיס אשראי לא חוקי"
        />
        <DetailForm
          label="תאריך תפוגה"
          value={creditCardExpiration}
          setValue={setCreditCardExpiration}
          error={errors.creditCardExpiration}
          helperText="תאריך תפוגה לא חוקי (פורמט MM/YY)"
        />
        <DetailForm
          label="CVV"
          value={creditCardCvv}
          setValue={setCreditCardCvv}
          error={errors.creditCardCvv}
          helperText="CVV לא חוקי"
        />
        <DetailForm
          label="מספר תעודת זהות"
          value={citizenID}
          setValue={setCitizenID}
          error={errors.citizenID}
          helperText="מספר תעודת זהות חייב להכיל 9 ספרות"
        />
      </CardDetails>

      <Button
        variant="contained"
        color="primary"
        fullWidth
        onClick={onCheckout}
        style={{ marginTop: 16 }}
        disabled={!productStore.cartProducts.length}
      >
        לתשלום
      </Button>

      <Snackbar
        open={paymentSuccess}
        autoHideDuration={4000}
        onClose={() => setPaymentSuccess(false)}
      >
        <Alert onClose={() => setPaymentSuccess(false)} severity="success">
          התשלום הושלם בהצלחה!
        </Alert>
      </Snackbar>
    </TotalSummaryWrapper>
  );
};

const TotalSummaryWrapper = styled.div`
  border: 1px solid var(--border-color);
  background-color: var(--card-background);
  padding: 32px;
  width: 100%;
  max-width: 500px;
  margin: 0 auto;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);

  h2 {
    text-align: center;
  }

  @media (max-width: 768px) {
    padding: 16px;
  }

  @media (max-width: 480px) {
    h2 {
      font-size: 18px;
    }
  }
`;

const OrderSummary = styled.div`
  border: 1px solid #ddd;
  padding: 16px;
  border-radius: 8px;
  margin-bottom: 24px;
  text-align: right;

  p {
    margin: 4px 0;
  }

  @media (max-width: 480px) {
    padding: 12px;
    p {
      font-size: 14px;
    }
  }
`;

const UserDetails = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  border: 1px solid var(--border-color);
  padding: 16px;
  text-align: right;

  @media (max-width: 480px) {
    padding: 12px;
    gap: 12px;
  }
`;

const CardDetails = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-top: 24px;
  text-align: right;

  @media (max-width: 480px) {
    margin-top: 16px;
    gap: 12px;
  }
`;
const CardPreview = styled.div`
  border: 1px solid var(--border-color);
  padding: 16px;
  border-radius: 8px;
  background-color: #f3f3f3;
  text-align: center;
  margin-bottom: 16px;
  font-size: 14px;
  color: #555;
`;

interface DetailFormProps {
  label: string;
  value: string;
  setValue: React.Dispatch<React.SetStateAction<string>>;
  error?: boolean;
  helperText?: string;
}
const DetailForm: React.FC<DetailFormProps> = ({
  label,
  value,
  setValue,
  error,
  helperText,
}) => (
  <FormControl error={error} variant="standard" fullWidth>
    <InputLabel>{label}</InputLabel>
    <Input
      value={value}
      onChange={(e) => setValue(e.target.value)}
      inputProps={{
        style: { textAlign: "right" },
      }}
    />
    {error && helperText && <FormHelperText>{helperText}</FormHelperText>}
  </FormControl>
);

export default TotalSummary;
