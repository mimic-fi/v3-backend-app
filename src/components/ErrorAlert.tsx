import React, { useState } from 'react'

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
    <div className="error-alert">
      <span>{message}</span>
      <button className="close-button" onClick={closeAlert}>x</button>
    </div>
  ) : null
}
