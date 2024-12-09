import React from "react";
import styled from "styled-components";

const PageWrapper = styled.div`
  width: 100%;
  height: 100%;
`;
const ContentWrapper = styled.div<{ $usePadding: boolean }>`
padding: ${(props) => (props.$usePadding ? "24px 32px" : 0)};
  height: 100%;
`;
interface Props {
  children: React.ReactNode;
  usePadding?: boolean;
  onClick?: Function;
  className?: string;
  id?: string;
}
const IPageWrapper = ({
  children,
  usePadding = true,
  onClick,
  className,
  id,
}: Props) => {
  return (
    <PageWrapper
      id={id}
      className={className}
      onClick={(e) => {
        if (onClick) onClick(e);
      }}
    >
      <ContentWrapper $usePadding={usePadding}>{children}</ContentWrapper>
    </PageWrapper>
  );
};

export default IPageWrapper;
