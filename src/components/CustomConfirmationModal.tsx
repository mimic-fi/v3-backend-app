import React from 'react';
import styled from 'styled-components';

interface CustomConfirmationModalProps {
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ModalContent = styled.div`
  background: #A89AFF;
  padding: 20px;
  border-radius: 8px;
  width: 300px;
  text-align: center;
`;

const Button = styled.button`
  margin: 0 10px;
  padding: 10px 20px;
  cursor: pointer;
  border: none;
  border-radius: 4px;
`;

const CustomConfirmationModal: React.FC<CustomConfirmationModalProps> = ({
  message,
  onConfirm,
  onCancel,
}) => {
  return (
    <ModalOverlay>
      <ModalContent>
        <p>{message}</p>
        <Button onClick={onConfirm}>Yes</Button>
        <Button onClick={onCancel}>No</Button>
      </ModalContent>
    </ModalOverlay>
  );
};

export default CustomConfirmationModal;
