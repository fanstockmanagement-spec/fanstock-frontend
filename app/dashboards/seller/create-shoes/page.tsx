"use client";

import React from 'react';
import { PlusIcon, TrashIcon, UploadIcon, Cross2Icon } from '@radix-ui/react-icons';
import AnimatedCard from '../components/AnimatedCard';
import { Spinner } from '@radix-ui/themes';
import { XCircle } from 'lucide-react';
import { useCreateShoes } from '@/app/components/hooks/useCreateShoes';
import Image from 'next/image';

export default function CreateShoesPage() {
    const {
        images,
        isSubmitting,
        register,
        handleSubmit,
        errors,
        fields,
        addVariant,
        removeVariant,
        handleImageUpload,
        removeImage,
        MAX_FILE_SIZE,
        MAX_IMAGES,
    } = useCreateShoes();

    return (
            <form onSubmit={handleSubmit}
            className="flex flex-col min-h-screen text-sm">
            {/* Header */}
            <div className="flex flex-col justify-center items-center gap-1 py-6 border-b border-gray-200">
                <h1 className="text-2xl font-semibold">Add New Product</h1>
                <p className="text-gray-500">Add a new product to your inventory</p>
            </div>

            {/* Main Content */}
            <div className="flex-1 overflow-y-auto p-6">
                <div className="max-w-4xl mx-auto space-y-6">
                    {/* Brand Name */}
                    <AnimatedCard delay={0} className="bg-white border border-gray-200 p-6 rounded-lg">
                        <h2 className="text-lg font-semibold mb-4">Product Information</h2>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Brand Name</label>
                                <input
                                    type="text"
                                    placeholder="e.g., Nike, Adidas"
                                    className="w-full px-4 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                    {...register('brand', { required: 'Brand is required' })}
                                />
                                {errors.brand && <p className="mt-1 text-sm text-red-600">{errors.brand.message}</p>}
                            </div>
                        </div>
                    </AnimatedCard>

                    {/* Image Upload */}
                    <AnimatedCard delay={100} className="bg-white border border-gray-200 p-6 rounded-lg">
                        <h2 className="text-lg font-semibold mb-4">Product Images</h2>
                        <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-orange-500 transition-colors duration-200">
                            <UploadIcon className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                            <p className="text-gray-600 mb-2">Upload product images</p>
                            <p className="text-gray-500 mb-4 text-xs">
                                PNG, JPG, JPEG up to {(MAX_FILE_SIZE * 2) / (1024 * 1024)}MB each
                            </p>
                            <p className="text-gray-500 mb-4 text-sm">
                                Maximum {MAX_IMAGES} images • Current: {images.length}/{MAX_IMAGES}
                            </p>
                            <input
                                type="file"
                                multiple
                                accept="image/*"
                                className="hidden"
                                id="image-upload"
                                onChange={handleImageUpload}
                            />
                            <label
                                htmlFor="image-upload"
                                className="inline-flex items-center gap-2 bg-orange-500 text-white px-4 py-2 rounded-md hover:bg-orange-600 cursor-pointer transition-colors duration-200 font-medium"
                            >
                                <UploadIcon className="w-4 h-4" /> Choose Files
                            </label>
                        </div>

                        {images.length > 0 && (
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mt-6">
                                {images.map((image, index) => (
                                    <div key={index} className="relative group">
                                        <div className="aspect-square rounded-lg overflow-hidden border-2 border-gray-200 shadow-sm">
                                            <Image
                                                src={URL.createObjectURL(image)}
                                                alt={`Preview ${index + 1}`}
                                                className="w-full h-full object-cover"
                                                width={200}
                                                height={200}
                                            />
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => removeImage(index)}
                                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors duration-200 shadow-lg"
                                            title="Remove image"
                                        >
                                            <Cross2Icon className="w-4 h-4" />
                                        </button>
                                        <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-xs px-2 py-1 text-center">
                                            {(image.size / (1024 * 1024)).toFixed(1)} MB
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                        {errors.imageUrls && (
                            <p className="mt-1 text-sm text-red-600">{errors.imageUrls?.message as string}</p>
                        )}
                    </AnimatedCard>

                    {/* Product Variants */}
                    <AnimatedCard delay={200} className="bg-white border border-gray-200 p-6 rounded-lg">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-lg font-semibold">Product Variants</h2>
                            <button
                                type="button"
                                onClick={addVariant}
                                className="inline-flex items-center gap-2 bg-orange-500 text-white px-4 py-2 rounded-md hover:bg-orange-600 transition-colors duration-200 font-medium"
                            >
                                <PlusIcon className="w-4 h-4" /> Add Variant
                            </button>
                        </div>

                        <div className="space-y-4">
                            {fields.map((field, index) => (
                                <div key={field.id} className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg border border-gray-100">
                                    {/* Size */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Size</label>
                                        <input
                                            type="number"
                                            placeholder="e.g., 42"
                                            className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                            {...register(`size_inventory.${index}.size`, {
                                                required: 'Size is required',
                                                min: { value: 35, message: 'Minimum size is 35' },
                                                max: { value: 60, message: 'Maximum size is 60' }
                                            })}
                                        />
                                        {errors.size_inventory?.[index]?.size && (
                                            <p className="mt-1 text-sm text-red-600">{errors.size_inventory[index]?.size?.message as string}</p>
                                        )}
                                    </div>

                                    {/* Quantity */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
                                        <input
                                            type="number"
                                            placeholder="e.g., 10"
                                            min="1"
                                            className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                            {...register(`size_inventory.${index}.quantity`, {
                                                required: 'Quantity is required',
                                                min: { value: 1, message: 'Minimum quantity is 1' },
                                                max: { value: 1000, message: 'Maximum quantity is 1000' },
                                                valueAsNumber: true
                                            })}
                                        />
                                        {errors.size_inventory?.[index]?.quantity && (
                                            <p className="mt-1 text-sm text-red-600">{errors.size_inventory[index]?.quantity?.message as string}</p>
                                        )}
                                    </div>

                                    {/* Price */}
                                    <div className="flex items-end gap-2">
                                        <div className="flex-1">
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Price (RWF)</label>
                                            <input
                                                type="number"
                                                placeholder="e.g., 50000"
                                                min="0"
                                                step="1"
                                                className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                                {...register(`size_inventory.${index}.price`, {
                                                    required: 'Price is required',
                                                    min: { value: 1, message: 'Price must be greater than 0' },
                                                    max: { value: 10000000, message: 'Maximum price is 10,000,000 RWF' },
                                                    valueAsNumber: true
                                                })}
                                            />
                                            {errors.size_inventory?.[index]?.price && (
                                                <p className="mt-1 text-sm text-red-600">{errors.size_inventory[index]?.price?.message as string}</p>
                                            )}
                                        </div>

                                        {fields.length > 1 && (
                                            <button
                                                type="button"
                                                onClick={() => removeVariant(index)}
                                                className="p-2 text-gray-500 hover:text-red-500 transition-colors duration-200"
                                                title="Remove variant"
                                            >
                                                <TrashIcon className="w-5 h-5" />
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </AnimatedCard>
                </div>
            </div>

            {/* Sticky Footer */}
            <div className="sticky bottom-0 border-t border-gray-200 bg-white p-4">
                <div className="max-w-4xl mx-auto flex justify-end gap-3">
                    <button
                        type="button"
                        className="px-6 py-2.5 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors duration-200 font-medium flex items-center gap-2"
                    >
                        <XCircle className="w-4 h-4" />
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="px-6 py-2.5 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors duration-200 font-medium flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer"
                    >
                        {isSubmitting ? (
                            <>
                                <Spinner />
                                Creating Product...
                            </>
                        ) : (
                            <>
                                <PlusIcon className="w-4 h-4" />
                                Create Product
                            </>
                        )}
                    </button>
                </div>
            </div>
        </form>
    );
}