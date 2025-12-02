import React, { useContext } from 'react';
import { ConfirmContext } from '../context/ConfirmContext';
import '../styles/ConfirmDialog.css';

const ConfirmDialog = () => {
  const { confirmDialog, handleConfirm, handleCancel } = useContext(ConfirmContext);

  if (!confirmDialog) {
    return null;
  }

  const {
    title = '¿Estás seguro?',
    message = '',
    confirmText = 'Confirmar',
    cancelText = 'Cancelar',
    confirmType = 'danger'
  } = confirmDialog;

  return (
    <div className="confirm-overlay">
      <div className="confirm-dialog">
        <div className="confirm-header">
          <h3>{title}</h3>
        </div>
        
        {message && (
          <div className="confirm-body">
            <p>{message}</p>
          </div>
        )}
        
        <div className="confirm-footer">
          <button 
            className="btn btn-secondary"
            onClick={handleCancel}
          >
            {cancelText}
          </button>
          <button 
            className={`btn btn-${confirmType}`}
            onClick={handleConfirm}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;
