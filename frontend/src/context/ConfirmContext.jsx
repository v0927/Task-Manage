import React, { createContext, useState, useCallback } from 'react';

export const ConfirmContext = createContext();

export const ConfirmProvider = ({ children }) => {
  const [confirmDialog, setConfirmDialog] = useState(null);

  const confirm = useCallback((options = {}) => {
    return new Promise((resolve) => {
      setConfirmDialog({
        ...options,
        resolve
      });
    });
  }, []);

  const handleConfirm = () => {
    if (confirmDialog?.resolve) {
      confirmDialog.resolve(true);
    }
    setConfirmDialog(null);
  };

  const handleCancel = () => {
    if (confirmDialog?.resolve) {
      confirmDialog.resolve(false);
    }
    setConfirmDialog(null);
  };

  return (
    <ConfirmContext.Provider value={{ confirm, confirmDialog, handleConfirm, handleCancel }}>
      {children}
    </ConfirmContext.Provider>
  );
};

export const useConfirm = () => {
  const context = React.useContext(ConfirmContext);
  if (!context) {
    throw new Error('useConfirm debe ser usado dentro de ConfirmProvider');
  }
  return context;
};
