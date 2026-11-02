import React, { useEffect, useState } from 'react';
import { FiAlertCircle, FiCheckCircle, FiInfo, FiX, FiAlertTriangle } from 'react-icons/fi';

const icons = {
    success: FiCheckCircle,
    error: FiAlertCircle,
    warning: FiAlertTriangle,
    info: FiInfo
};

const Toasts = () => {
    const [toasts, setToasts] = useState([]);

    useEffect(() => {
        const handleToast = (event) => {
            const toast = event.detail;
            setToasts((current) => [...current, toast]);
            window.setTimeout(() => {
                setToasts((current) => current.filter((item) => item.id !== toast.id));
            }, 3600);
        };
        window.addEventListener('app:toast', handleToast);
        return () => window.removeEventListener('app:toast', handleToast);
    }, []);

    return (
        <div className='toast-stack' aria-live='polite' aria-atomic='false'>
            {toasts.map((toast) => {
                const Icon = icons[toast.type] || icons.info;
                return <div className={`toast toast-${toast.type}`} key={toast.id} role='status'>
                    <Icon className='toast-icon' aria-hidden='true' />
                    <span>{toast.message}</span>
                    <button className='toast-close' onClick={() => setToasts((current) => current.filter((item) => item.id !== toast.id))} aria-label='Cerrar notificación'><FiX /></button>
                </div>;
            })}
        </div>
    );
};

export default Toasts;
