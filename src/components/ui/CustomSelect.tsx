
import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SelectOption {
    value: string;
    label: string | React.ReactNode;
}

interface CustomSelectProps {
    value: string;
    onChange: (value: string) => void;
    options: SelectOption[];
    placeholder?: string;
    className?: string;
    variant?: 'default' | 'orange' | 'outline';
    disabled?: boolean;
}

export const CustomSelect: React.FC<CustomSelectProps> = ({
    value,
    onChange,
    options,
    placeholder = 'Bitte wählen',
    className,
    variant = 'default',
    disabled = false
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const selectedOption = options.find(opt => opt.value === value);

    // Close on click outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const variants = {
        default: "bg-slate-50 border-2 border-slate-100 text-slate-800 focus:border-blue-500/20",
        orange: "bg-orange-50 text-orange-700 border-2 border-orange-50 hover:bg-orange-100",
        outline: "bg-white border-2 border-slate-100 text-slate-600 hover:border-slate-200"
    };

    return (
        <div className={cn("relative min-w-[120px]", className)} ref={containerRef}>
            <button
                type="button"
                onClick={() => !disabled && setIsOpen(!isOpen)}
                disabled={disabled}
                className={cn(
                    "w-full flex items-center justify-between px-4 py-2.5 rounded-xl font-black text-xs uppercase tracking-widest transition-all outline-none shadow-sm",
                    variants[variant],
                    disabled && "opacity-50 cursor-not-allowed",
                    isOpen && "ring-4 ring-blue-500/5 border-blue-500/20"
                )}
            >
                <span className="truncate mr-2">
                    {selectedOption ? selectedOption.label : placeholder}
                </span>
                <ChevronDown className={cn("w-4 h-4 shrink-0 transition-transform duration-200", isOpen && "rotate-180")} />
            </button>

            {isOpen && (
                <div className="absolute z-[100] mt-2 w-full bg-white rounded-xl shadow-2xl border border-slate-100 py-1.5 animate-in fade-in zoom-in-95 duration-150 overflow-hidden min-w-[160px]">
                    <div className="max-h-[250px] overflow-y-auto custom-scrollbar">
                        {options.map((option) => (
                            <button
                                key={option.value}
                                onClick={() => {
                                    onChange(option.value);
                                    setIsOpen(false);
                                }}
                                className={cn(
                                    "w-full flex items-center justify-between px-4 py-2 text-left transition-colors",
                                    option.value === value
                                        ? "bg-blue-50 text-blue-700 font-black"
                                        : "hover:bg-slate-50 text-slate-600 font-bold"
                                )}
                            >
                                <span className="text-xs uppercase tracking-widest truncate">{option.label}</span>
                                {option.value === value && <Check className="w-3.5 h-3.5" />}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};
