import React, {  useState } from "react";
import styled from "styled-components";
import ProductTotal from "../components/ProductTotal";
import TotalSummary from "../components/TotalSummary";
import {  useStore } from "../stores/StoreContext";
import { Store } from "../components/DistributionPointsTable";
import { CartItem } from "../stores/ProductStore";

export type  OrderDetails = {
  clientName: string,
  clientEmail:string,
  clientPhoneNumber: string,
  store: Store,
  details: CartItem[],
  accountUrl?: string,
};

interface ICart {
  handelOnCheckout: (orderDetails:OrderDetails ) => void;
}

const Cart: React.FC<ICart> = ({ handelOnCheckout }) => {
  const {productStore} = useStore();
  const [totalPrice, setTotalPrice] = useState<number>(0);

  const handleQuantityChange = (productId: number, newQuantity: number) => {
    const product = productStore?.cartProducts.find(
      (p) => p.product.id === productId
    )?.product;
    if (product) {
      productStore?.addToCart(product, newQuantity);
      let totalPrice = 0;
      productStore?.cartProducts.forEach(
        (item) => (totalPrice += item.product.price * item.quantity)
      );
      setTotalPrice(totalPrice);
    }
  };

  return (
    <CatalogWrapper>
      <Header>ההזמנה שלך</Header>
      <div className="summary">
        <TotalSummary  handelOnCheckout={handelOnCheckout}/>
        <LeftSide>
          <CardWrapper>
            {productStore?.cartProducts.map(({ product, quantity }) => (
              <ProductTotal
                key={product.id}
                product={product}
                quantity={quantity}
                onQuantityChange={handleQuantityChange}
              />
            ))}
          </CardWrapper>
        </LeftSide>
      </div>
    </CatalogWrapper>
  );
};

export default Cart;

const CatalogWrapper = styled.div`
  height: auto;
  overflow: auto;
  padding: 32px;

  .summary {
    display: flex;
    flex-direction: row;
    align-items: start;
    justify-content: center;
    gap: 32px;

    @media (max-width: 768px) {
      flex-direction: column;
      gap: 16px;
    }
  }

  @media (max-width: 480px) {
    padding: 16px;
  }
`;
const LeftSide = styled.div``;

const CardWrapper = styled.div`
width: 760px;

`;

const Header = styled.div`
  display: flex;
  border: 1px;
  justify-content: center;
  padding: 24px;
  font-size: 32px;
  font-weight: bolder;
  color: #5e5e5e;
`;
