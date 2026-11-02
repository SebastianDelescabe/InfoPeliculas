import React, { useEffect, useState } from 'react';
import { FiArrowUp } from 'react-icons/fi';

const ScrollToTop = () => {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const updateVisibility = () => setVisible(window.scrollY > 400);
        updateVisibility();
        window.addEventListener('scroll', updateVisibility, { passive: true });
        return () => window.removeEventListener('scroll', updateVisibility);
    }, []);

    if (!visible) return null;

    return (
        <button
            type='button'
            className='scroll-top-button'
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            aria-label='Volver arriba'
            title='Volver arriba'
        >
            <FiArrowUp aria-hidden='true' />
        </button>
    );
};

export default ScrollToTop;
