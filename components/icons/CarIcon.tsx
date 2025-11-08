
import React from 'react';

export const CarIcon: React.FC<{className?: string}> = ({ className }) => (
    <svg 
        viewBox="0 0 24 24" 
        fill="currentColor" 
        className={className}
        xmlns="http://www.w3.org/2000/svg"
    >
        <path d="M6 18C4.89543 18 4 17.1046 4 16V13C4 12.4477 4.44772 12 5 12H19C19.5523 12 20 12.4477 20 13V16C20 17.1046 19.1046 18 18 18H6Z" />
        <path d="M4 12L5.87642 6.37077C6.15175 5.53953 6.95013 5 7.84633 5H16.1537C17.0499 5 17.8482 5.53953 18.1236 6.37077L20 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="7.5" cy="17.5" r="1.5" fill="black" />
        <circle cx="16.5" cy="17.5" r="1.5" fill="black" />
    </svg>
);
