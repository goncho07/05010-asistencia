import React, { useState, useRef, useEffect, createContext, useContext } from 'react';

type DropdownContextType = {
    isOpen: boolean;
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const DropdownContext = createContext<DropdownContextType | undefined>(undefined);

interface DropdownProps {
    children: React.ReactNode;
    // FIX: Explicitly set the generic for React.ReactElement to 'any'.
    // This prevents TypeScript's strict mode from inferring the props as 'unknown',
    // which would throw an error on line 37 when trying to add an 'onClick' handler with cloneElement.
    trigger: React.ReactElement<any>;
    align?: 'left' | 'right';
}

export const Dropdown: React.FC<DropdownProps> = ({ children, trigger, align = 'left' }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const menuId = useRef(`dropdown-menu-${Math.random().toString(36).substring(2, 9)}`).current;

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const alignClass = align === 'right' ? 'right-0' : 'left-0';

    return (
        <DropdownContext.Provider value={{ isOpen, setIsOpen }}>
            <div className="relative" ref={dropdownRef}>
                {React.cloneElement(trigger, { 
                    onClick: () => setIsOpen(!isOpen),
                    'aria-haspopup': 'true',
                    'aria-expanded': isOpen,
                    'aria-controls': isOpen ? menuId : undefined
                })}

                {isOpen && (
                    <div 
                        id={menuId}
                        className={`absolute z-50 mt-2 w-56 rounded-md shadow-lg bg-white dark:bg-slate-800 ring-1 ring-black ring-opacity-5 dark:ring-slate-700 animate-fade-in ${alignClass}`}
                        style={{ animationDuration: '150ms' }}
                    >
                        <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
                            {children}
                        </div>
                    </div>
                )}
            </div>
        </DropdownContext.Provider>
    );
};

interface DropdownItemProps {
    children: React.ReactNode;
    onSelect: () => void;
}

export const DropdownItem: React.FC<DropdownItemProps> = ({ children, onSelect }) => {
    const context = useContext(DropdownContext);
    if (!context) {
        throw new Error('DropdownItem must be used within a Dropdown');
    }
    const { setIsOpen } = context;

    const handleSelect = () => {
        onSelect();
        setIsOpen(false);
    };

    return (
        <button
            onClick={handleSelect}
            className="flex items-center w-full px-4 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
            role="menuitem"
        >
            {children}
        </button>
    );
};