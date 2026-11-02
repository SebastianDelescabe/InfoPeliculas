import React, { useCallback, useEffect, useRef, useState } from 'react';
import { FiAlertCircle, FiCheckCircle, FiInfo, FiX, FiAlertTriangle } from 'react-icons/fi';

const icons = {
    success: FiCheckCircle,
    error: FiAlertCircle,
    warning: FiAlertTriangle,
    info: FiInfo
};

const TOAST_DURATION = 3600;
const MAX_VISIBLE_TOASTS = 4;

/** Escucha avisos globales, los muestra brevemente y limpia sus temporizadores. */
const Toasts = () => {
    const [toasts, setToasts] = useState([]);
    const timersRef = useRef(new Map());

    const dismissToast = useCallback((toastId) => {
        window.clearTimeout(timersRef.current.get(toastId));
        timersRef.current.delete(toastId);
        setToasts((current) => current.filter((item) => item.id !== toastId));
    }, []);

    useEffect(() => {
        const timers = timersRef.current;
        const handleToast = (event) => {
            const toast = event.detail;
            setToasts((current) => [...current.slice(-(MAX_VISIBLE_TOASTS - 1)), toast]);
            const timerId = window.setTimeout(() => dismissToast(toast.id), TOAST_DURATION);
            timers.set(toast.id, timerId);
        };
        window.addEventListener('app:toast', handleToast);
        return () => {
            window.removeEventListener('app:toast', handleToast);
            timers.forEach((timerId) => window.clearTimeout(timerId));
            timers.clear();
        };
    }, [dismissToast]);

    return (
        <div className='toast-stack' aria-live='polite' aria-atomic='false'>
            {toasts.map((toast) => {
                const Icon = icons[toast.type] || icons.info;
                return <div className={`toast toast-${toast.type}`} key={toast.id} role='status'>
                    <Icon className='toast-icon' aria-hidden='true' />
                    <span>{toast.message}</span>
                    <button className='toast-close' onClick={() => dismissToast(toast.id)} aria-label='Cerrar notificación'><FiX /></button>
                </div>;
            })}
        </div>
    );
};

export default Toasts;
