"use client"

import { useState, useEffect } from 'react';
import { XCircle, Save } from 'lucide-react';
import { Spinner } from '@radix-ui/themes';
import { useUpdateShoeSize } from '@/app/components/hooks/useUpdateShoeSize';

interface SizeInventoryItem {
    size: string;
    price: number;
    quantity: number;
}

interface EditSizeModalProps {
    isOpen: boolean;
    onClose: () => void;
    shoeId: string;
    sizeData: SizeInventoryItem | null;
    onSuccess: () => void;
}

export default function EditSizeModal({ isOpen, onClose, shoeId, sizeData, onSuccess }: EditSizeModalProps) {
    const { register, handleSubmit, reset, onSubmit, isUpdatingSize, errors } = useUpdateShoeSize();

    useEffect(() => {
        if (isOpen && sizeData) {
            reset({
                quantity: sizeData.quantity,
                price: sizeData.price,
            });
        }
    }, [isOpen, sizeData, reset]);

    const onFormSubmit = handleSubmit(async (data) => {
        if (!sizeData) return;

        const result = await onSubmit(shoeId, sizeData.size, data);

        if (result?.success) {
            onSuccess();
            onClose();
        }
    });

    const handleCancel = () => {
        reset();
        onClose();
    };

    if (!isOpen || !sizeData) return null;

    return (
        <div className="fixed inset-0 bg-[rgba(0,0,0,0.5)] z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg w-full max-w-md overflow-hidden">
                <form onSubmit={onFormSubmit} className="flex flex-col text-sm">
                    {/* Header */}
                    <div className="flex flex-col justify-center items-center gap-1 py-6 bg-white border-b border-gray-200">
                        <h1 className="text-2xl font-semibold text-gray-900">Edit Size {sizeData.size}</h1>
                        <p className="text-gray-500">Update quantity and price for this size</p>
                    </div>

                    {/* Content */}
                    <div className="p-6">
                        <div className="space-y-6">
                            {/* Quantity Field */}
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700">
                                    Quantity *
                                </label>
                                <input
                                    type="number"
                                    min="0"
                                    placeholder="0"
                                    {...register('quantity')}
                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 bg-white"
                                />
                                {errors.quantity && (
                                    <p className="text-red-500 text-xs mt-1">{errors.quantity.message}</p>
                                )}
                            </div>

                            {/* Price Field */}
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700">
                                    Price (RWF) *
                                </label>
                                <input
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    placeholder="0"
                                    {...register('price')}
                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 bg-white"
                                />
                                {errors.price && (
                                    <p className="text-red-500 text-xs mt-1">{errors.price.message}</p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="border-t border-gray-200 bg-white p-6">
                        <div className="flex justify-end gap-3">
                            <button
                                type="button"
                                onClick={handleCancel}
                                className="flex text-gray-700 items-center justify-center gap-2 px-6 py-2.5 bg-gray-100 rounded-lg hover:bg-gray-200 transition-all duration-200 font-medium"
                            >
                                <XCircle strokeWidth={1.5} size={16} />
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={isUpdatingSize}
                                className="flex items-center gap-2 px-6 py-2.5 rounded-lg bg-gradient-to-r from-orange-500 to-red-500 text-white hover:from-orange-600 hover:to-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium shadow-sm hover:shadow-md"
                            >
                                {isUpdatingSize ? (
                                    <>
                                        <Spinner /> Updating...
                                    </>
                                ) : (
                                    <>
                                        <Save size={16} /> Update Size
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}
