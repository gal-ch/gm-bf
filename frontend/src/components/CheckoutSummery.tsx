import React from "react";
import styled from "styled-components";
import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { Currency } from "../types/Catalog";
import type { OrderDetails } from "../pages/Cart"; 

interface ICheckoutSummary {
    checkoutDetails: OrderDetails
}

const CheckoutSummary: React.FC<ICheckoutSummary> = ({ checkoutDetails}) => {  
  return (
    <CheckoutSummaryWrapper>
      <h2>סיכום הזמנה</h2>

      <OrderSummary>
        <h3>תודה על ההזמנה שלך!</h3>
        <p>הזמנה עבור: {checkoutDetails.clientName}</p>
        <p>אימייל: {checkoutDetails.clientEmail}</p>
        <p>טלפון: {checkoutDetails.clientPhoneNumber}</p>
        <p>
          איסוף מ: {checkoutDetails.store?.name || "לא צויין"}{" "}
          {checkoutDetails.store?.address || ""}
        </p>

        <OrderDetails>
          <h4>פרטי ההזמנה:</h4>
          {checkoutDetails.details?.map((item: any, index: number) => (
            <OrderItem key={index}>
              <span>{item.product.name}</span>
              <span>
                {item.quantity} x {Currency.ILS} {(+item.product.price).toFixed(2)}
              </span>
            </OrderItem>
          ))}
        </OrderDetails>

        <TotalPrice>
          סך לתשלום: {Currency.ILS}{" "}
          {checkoutDetails.details
            ?.reduce(
              (total: number, item: any) =>
                total + item.product.price * item.quantity,
              0
            )
            .toFixed(2)}
        </TotalPrice>
      </OrderSummary>
    </CheckoutSummaryWrapper>
  );
};

const CheckoutSummaryWrapper = styled.div`
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
  text-align: right;
  margin-bottom: 24px;

  h3 {
    text-align: center;
    margin-bottom: 16px;
    font-size: 18px;
  }

  p {
    margin: 4px 0;
  }
`;

const OrderDetails = styled.div`
  border: 1px solid #ddd;
  padding: 16px;
  border-radius: 8px;
  margin-top: 16px;

  h4 {
    margin-bottom: 8px;
  }
`;

const OrderItem = styled.div`
  display: flex;
  justify-content: space-between;
  margin: 4px 0;

  span {
    font-size: 14px;
  }
`;

const TotalPrice = styled.div`
  margin-top: 16px;
  font-weight: bold;
  text-align: center;
`;

export default CheckoutSummary;
