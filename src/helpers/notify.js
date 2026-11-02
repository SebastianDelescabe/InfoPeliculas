// Publica un evento global para que el contenedor de notificaciones lo muestre.
export const notify = (message, type = 'info') => {
    window.dispatchEvent(new CustomEvent('app:toast', {
        detail: { id: `${Date.now()}-${Math.random()}`, message, type }
    }));
};
