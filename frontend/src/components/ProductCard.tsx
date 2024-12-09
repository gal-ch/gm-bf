import React, { useContext, useEffect, useState } from "react";
import styled from "styled-components";
import { Currency, Product } from "../types/Catalog";
import { StoreContext } from "../stores/StoreContext";

interface IProductCard {
  product: Product;
  initialQuantity: number;
  onQuantityChange: (product: Product, quantity: number) => void;
  isDisabled?: boolean;
}

const ProductCard: React.FC<IProductCard> = ({
  product,
  initialQuantity,
  onQuantityChange,
  isDisabled = false,
}) => {
  const [quantity, setQuantity] = useState(initialQuantity);
  const [price, setPrice] = useState(product.price);
  const productStore = useContext(StoreContext);

  useEffect(() => {
    setQuantity(initialQuantity);
  }, [initialQuantity]);

  const handleIncrease = () => {
    setQuantity((prevQuantity) => {
      const newQuantity = prevQuantity + 1;
      onQuantityChange(product, newQuantity);
      return newQuantity;
    });
  };

  const handleDecrease = () => {
    setQuantity((prevQuantity) => {
      const newQuantity = Math.max(prevQuantity - 1, 0);
      onQuantityChange(product, newQuantity);
      return newQuantity;
    });
  };


  return (
    <ProductCardWrapper isDisabled={isDisabled}>
      <img src={product.image || require("../assets/images/no-image-available.jpg")} alt={product.name} className="product-image" />
      <ProductDetails>
        <h3 className="product-name">{product.name}</h3>
        <p className="product-price">
          {product.unit}/{Currency.ILS} {product.price}
        </p>
        <p className="amount">
          {Currency.ILS} {price * quantity}
        </p>
        <Buttons>
          <QuantityControls>
            <button
              className="quantity-button"
              onClick={handleDecrease}
              disabled={isDisabled}
            >
              -
            </button>
            <span className="quantity-display">{quantity}</span>
            <button
              className="quantity-button"
              onClick={handleIncrease}
              disabled={isDisabled}
            >
              +
            </button>
          </QuantityControls>
        </Buttons>
      </ProductDetails>
    </ProductCardWrapper>
  );
};

const ProductCardWrapper = styled.div<{ isDisabled: boolean }>`
  border: 1px solid var(--border-color);
  border-radius: 8px;
  overflow: hidden;
  width: 210px;
  box-shadow: 0 2px 4px rgba(55, 54, 54, 0.1);
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: ${({ isDisabled }) => (isDisabled ? "var(--disabled-background)" :  'var(--card-background)')};
  opacity: ${({ isDisabled }) => (isDisabled ? 0.5 : 1)};
  pointer-events: ${({ isDisabled }) => (isDisabled ? "none" : "auto")};
  min-width: 230px;

  .product-image {
    width: 100%;
    height: 150px;
    object-fit: cover;
  }
`;

const ProductDetails = styled.div`
  text-align: right;
  width: 90%;
  margin: 8px 0;
  .amount {
    font-size: 16px;
  }
`;

const QuantityControls = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  .quantity-button {
    border: 1px solid var(--border-color);
    border-radius: 4px;
    color: #545454;
    font-size: 1.2em;
    width: 32px;
    padding: 4px 8px;
    background-color: var(--action-color);
    cursor: pointer;
    transition: background-color 0.3s;
    &:disabled {
      background-color: var(--disabled-background);
      cursor: not-allowed;
    }
    &:hover:not(:disabled) {
      background-color: var(--disabled-background);
    }
  }
  .quantity-display {
    font-size: 1.2em;
    margin: 0 16px;
  }
`;

const Buttons = styled.div`
  display: flex;
  justify-content: space-between;
`;

export default ProductCard;
