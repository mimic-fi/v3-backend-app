import { useState } from 'react'
import styled from 'styled-components'

interface ErrorAlertProps {
  message: string
  onClose: () => void
}

export default function ErrorAlert({ message, onClose }: ErrorAlertProps) {
  const [visible, setVisible] = useState(true)

  const closeAlert = () => {
    setVisible(false)
    onClose()
  }

  return visible ? (
    <Error className="error-alert">
      <span>{message}</span>
      <button className="close-button" onClick={closeAlert}>x</button>
    </Error>
  ) : null
}


const Error = styled.div`
  background: #6F5CE6;
  padding: 5px 15px;
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: space-between;
  button {
    background: transparent;
    color: white;
    font-weight: bold;
    border: 0px;
    font-size: 20px;
  }
`
