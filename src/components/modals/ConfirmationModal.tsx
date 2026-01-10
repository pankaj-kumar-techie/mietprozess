
import React from 'react';
import { Button } from "@/components/ui/button";
import { AlertTriangle, Trash2 } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';

interface ConfirmationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    description: string;
    confirmText?: string;
    cancelText?: string;
    variant?: 'danger' | 'warning' | 'info';
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
    isOpen,
    onClose,
    onConfirm,
    title,
    description,
    confirmText = 'Bestätigen',
    cancelText = 'Abbrechen',
    variant = 'danger'
}) => {
    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={title}
        >
            <div className="space-y-6 max-w-sm mx-auto text-center font-sans mt-4">
                <div className={`mx-auto w-20 h-20 rounded-full flex items-center justify-center ${variant === 'danger' ? 'bg-red-100 text-red-600' : 'bg-yellow-100 text-yellow-600'}`}>
                    {variant === 'danger' ? <Trash2 className="w-10 h-10" /> : <AlertTriangle className="w-10 h-10" />}
                </div>

                <div>
                    <p className="text-slate-600 font-medium leading-relaxed mb-8">
                        {description}
                    </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <Button
                        variant="outline"
                        onClick={onClose}
                        className="py-6 rounded-2xl text-base font-bold text-slate-600 hover:bg-slate-50 border-2"
                    >
                        {cancelText}
                    </Button>
                    <Button
                        onClick={() => {
                            onConfirm();
                            onClose();
                        }}
                        className={`py-6 rounded-2xl text-base font-bold shadow-lg text-white ${variant === 'danger'
                            ? 'bg-red-600 hover:bg-red-700 shadow-red-200'
                            : 'bg-yellow-500 hover:bg-yellow-600 shadow-yellow-200'}`}
                    >
                        {confirmText}
                    </Button>
                </div>
            </div>
        </Modal>
    );
};
