import IPageWrapper from "../components/IPageWrapper";
import styled from "styled-components";
import ProductCard from "../components/ProductCard";
import { Product, Units } from "../types/Catalog";
import { useStore } from "../stores/StoreContext";
import { useEffect, useState } from "react";
import { AppApiService } from "../services/app-api.service";
import { useLocation } from "react-router-dom";

const Catalog = () => {
  const { productStore } = useStore();
  const apiService = new AppApiService();
  const [productsList, setProductsList] = useState<Product[]>([]);
  const selectedDistributionPoint = JSON.parse(
    localStorage.getItem("distributionPoint") || "{}"
  ).id;
  const location = useLocation();
  const accountUrl = location.pathname.split("/")[1];


  useEffect(() => {
    if(location.pathname !== '/login'){
      getAllProduct();
    }

  }, []);

  const getAllProduct = async () => {
    const allProduct = await apiService.products.getProducts(accountUrl);
    setProductsList(allProduct);
  };

  const handleQuantityChange = (product: Product, newQuantity: number) => {
    productStore.addToCart(product, newQuantity);
  };

  return (
    <CatalogWrapper>
      <CardWrapper>
        {productsList?.map((product: Product) => {
          const productInCart = productStore.cartProducts.find(
            (p) => p.product.id === product.id
          );
          const quantity = productInCart ? productInCart.quantity : 0;
          return product.status ? (
            <ProductCard
              key={product.id}
              product={product}
              initialQuantity={quantity}
              onQuantityChange={handleQuantityChange}
              isDisabled={product.disabledStoresIds?.includes(
                selectedDistributionPoint
              )}
            />
          ) : null;
        })}
      </CardWrapper>
    </CatalogWrapper>
  );
};

export default Catalog;

const CatalogWrapper = styled(IPageWrapper)`
  height: calc(100% - 24px);
  overflow: auto;
`;
const CardWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 16px;
  padding: 16px;
`;
