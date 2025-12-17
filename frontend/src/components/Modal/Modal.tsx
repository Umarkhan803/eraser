import React from "react";
import styled from "styled-components";

interface ModalProps {
  children: React.ReactNode;
}
const Modal: React.FC<ModalProps> = ({ children }) => {
  return (
    <StyledWrapper>
      <div className="card">{children}</div>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  .card {
    width: 300px;
    height: 220px;
    background-color: rgb(255, 255, 255);
    border-radius: 8px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 20px 30px;
    gap: 13px;
    position: relative;
    overflow: hidden;
    box-shadow: 2px 2px 20px rgba(0, 0, 0, 0.062);
  }
`;

export default Modal;
