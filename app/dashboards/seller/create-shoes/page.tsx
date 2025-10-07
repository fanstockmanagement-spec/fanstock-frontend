"use client";

import React, { useState } from 'react';
import { PlusIcon, TrashIcon, UploadIcon, Cross2Icon, TriangleRightIcon, TriangleLeftIcon } from '@radix-ui/react-icons';
import { useRouter } from 'next/navigation';
import AnimatedCard from '../components/AnimatedCard';
import { useShoes } from '@/app/components/hooks/useShoes';
import { Spinner } from '@radix-ui/themes';
import { XCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { useForm, useFieldArray } from 'react-hook-form';

interface VariantForm {
    size: string;
    color: string;
    quantity: string;
    price: string;
}

interface FormData {
    brand: string;
    model_name: string;
    category: string;
    price_retail: string;
    description: string;
    variants: VariantForm[];
}

export default function CreateShoesPage() {
    const [step, setStep] = useState(1);
    const [images, setImages] = useState<File[]>([]);
    const router = useRouter();
    const { onSubmit: originalOnSubmit, isSubmitting } = useShoes();
    
    const {
        register,
        handleSubmit,
        watch,
        control,
        formState: { errors },
        trigger,
        reset
    } = useForm<FormData>({
        defaultValues: {
            brand: '',
            model_name: '',
            category: '',
            price_retail: '',
            description: '',
            variants: [{ size: '', color: '', quantity: '', price: '' }]
        }
    });

    const { fields, append, remove } = useFieldArray({
        control,
        name: 'variants'
    });

    const handleCancel = () => router.back();

    const validateStep1 = async () => {
        const isValid = await trigger(['brand', 'model_name', 'category', 'price_retail', 'description']);
        
        if (!isValid) {
            toast.error('Please fill in all required fields');
            return false;
        }
        
        if (images.length === 0) {
            toast.error('Please upload at least one image');
            return false;
        }
        
        return true;
    };

    const handleNext = async () => {
        if (!(await validateStep1())) return;
        setStep(2);
    };

    const addVariant = () => {
        const defaultPrice = watch('price_retail') || '';
        append({ size: '', color: '', quantity: '', price: defaultPrice });
    };

    const removeVariant = (index: number) => {
        if (fields.length > 1) {
            remove(index);
        }
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        console.log('Files selected:', files.length);
        if (files.length > 0) {
            setImages(prev => {
                const newImages = [...prev, ...files];
                console.log('Total images now:', newImages.length);
                return newImages;
            });
        }
        // Reset input value to allow selecting the same file again
        e.target.value = '';
    };

    const removeImage = (index: number) => {
        setImages(prev => prev.filter((_, i) => i !== index));
    };

    const validateVariants = (variants: VariantForm[]) => {
        const invalidVariants = variants.filter(v => 
            !v.size || !v.color || !v.quantity || isNaN(parseInt(v.quantity)) || parseInt(v.quantity) <= 0
        );
        
        if (invalidVariants.length > 0) {
            toast.error('Please fill in all variant details with valid quantities');
            return false;
        }

        // Additional validation for realistic values
        for (const variant of variants) {
            const size = parseInt(variant.size);
            const quantity = parseInt(variant.quantity);
            const price = parseFloat(variant.price);

            if (size < 35 || size > 50) {
                toast.error('Shoe size must be between 35 and 50');
                return false;
            }

            if (quantity > 1000) {
                toast.error('Quantity cannot exceed 1000');
                return false;
            }

            if (price > 10000) {
                toast.error('Price cannot exceed $10,000');
                return false;
            }
        }
        
        return true;
    };

    const onSubmit = async (data: FormData) => {
        // Validate variants
        if (!validateVariants(data.variants)) return;

        // Transform variants into colors and sizes arrays
        const colors = [...new Set(data.variants.map(v => v.color).filter(Boolean))];
        const sizes = [...new Set(data.variants.map(v => v.size).filter(Boolean))];

        // Create variants array for backend
        const variants = data.variants.map(v => ({
            size: v.size,
            color: v.color,
            quantity: parseInt(v.quantity) || 0,
            price: parseFloat(v.price) || parseFloat(data.price_retail) || 0
        }));

        // Create FormData for file upload (back to FormData to handle images)
        const formData = new FormData();
        
        // Add text fields
        formData.append('brand', data.brand);
        formData.append('model_name', data.model_name);
        formData.append('category', data.category);
        formData.append('price_retail', data.price_retail);
        formData.append('description', data.description);
        formData.append('stockin', data.price_retail);
        
        // Add arrays as JSON strings
        formData.append('colors', JSON.stringify(colors));
        formData.append('sizes', JSON.stringify(sizes));
        formData.append('variants', JSON.stringify(variants));
        
        // Add image files - try 'imageUrls' field name
        images.forEach((file) => {
            formData.append('imageUrls', file);
        });

        // Debug: Log FormData contents (can be removed in production)
        console.log('FormData being sent:');
        console.log('Images count:', images.length);

        // Send FormData to backend
        const result = await originalOnSubmit(formData);
        
        // If successful, reset the form and images
        if (result && result.success) {
            // Reset react-hook-form
            reset({
                brand: '',
                model_name: '',
                category: '',
                price_retail: '',
                description: '',
                variants: [{ size: '', color: '', quantity: '', price: '' }]
            });
            
            // Reset images state
            setImages([]);
            
            // Reset step to 1
            setStep(1);
            
            console.log('Form reset successfully after shoe creation');
        }
        
        return result;
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col min-h-screen text-sm">
            {/* Header */}
            <div className="flex flex-col justify-center items-center gap-1 py-6 border-gray-200">
                <h1 className="text-2xl font-semibold">Create New Shoes</h1>
                <p className="text-gray-500">Add a new product to your inventory</p>
                <div className="flex items-center gap-2 mt-2">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${step >= 1 ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white' : 'bg-gray-200 text-gray-500'
                        }`}>
                        1
                    </div>
                    <div className={`w-16 h-1 ${step >= 2 ? 'bg-[#CA425A]' : 'bg-gray-200'}`}></div>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${step >= 2 ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white' : 'bg-gray-200 text-gray-500'
                        }`}>
                        2
                    </div>
                </div>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-6">
                <div className="max-w-4xl mx-auto space-y-6">
                    {step === 1 ? (
                        <>
                            {/* Basic Information */}
                            <AnimatedCard delay={0} className="bg-white border border-gray-200 p-6 rounded-lg">
                                <h2 className="text-lg font-semibold mb-4">Basic Information</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="block text-sm">Brand</label>
                                        <input 
                                            type="text" 
                                            placeholder="e.g., Nike, Adidas" 
                                            className="w-full px-4 py-2 border border-gray-100 rounded-md focus:outline-none focus:border focus:border-orange-500 transition-all duration-200 bg-white" 
                                            {...register('brand', { required: 'Brand is required' })}
                                        />
                                        {errors.brand && <p className="text-red-500 text-sm mt-1">{errors.brand.message}</p>}
                                    </div>
                                    <div className="space-y-2">
                                        <label className="block text-sm">Model</label>
                                        <input 
                                            type="text" 
                                            placeholder="e.g., Air Max 90" 
                                            className="w-full px-4 py-2 border border-gray-100 rounded-md focus:outline-none focus:border focus:border-orange-500 transition-all duration-200 bg-white" 
                                            {...register('model_name', { required: 'Model is required' })}
                                        />
                                        {errors.model_name && <p className="text-red-500 text-sm mt-1">{errors.model_name.message}</p>}
                                    </div>
                                    <div className="space-y-2">
                                        <label className="block text-sm">Category</label>
                                        <select 
                                            className="w-full px-4 py-2 border border-gray-100 rounded-md focus:outline-none focus:border focus:border-orange-500 transition-all duration-200 bg-white" 
                                            {...register('category', { required: 'Category is required' })}
                                        >
                                            <option value="">Select category</option>
                                            {['Men', 'Women', 'Kids', 'Sports', 'Unisex'].map(opt => 
                                                <option key={opt} value={opt}>{opt}</option>
                                            )}
                                        </select>
                                        {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category.message}</p>}
                                    </div>
                                    <div className="space-y-2">
                                        <label className="block text-sm">Default Price (RWF)</label>
                                        <input 
                                            type="number" 
                                            placeholder="120.00" 
                                            className="w-full px-4 py-2 border border-gray-100 rounded-md focus:outline-none focus:border focus:border-orange-500 transition-all duration-200 bg-white" 
                                            {...register('price_retail', { 
                                                required: 'Price is required',
                                                min: { value: 0.01, message: 'Price must be greater than 0' }
                                            })}
                                        />
                                        {errors.price_retail && <p className="text-red-500 text-sm mt-1">{errors.price_retail.message}</p>}
                                    </div>
                                </div>
                                <div className="mt-6">
                                    <div className="space-y-2">
                                        <label className="block text-sm">Description</label>
                                        <textarea 
                                            placeholder="Describe the shoes..." 
                                            rows={4} 
                                            className="w-full px-4 py-2 border border-gray-100 rounded-md focus:outline-none focus:border focus:border-orange-500 transition-all duration-200 bg-white resize-none" 
                                            {...register('description', { required: 'Description is required' })}
                                        />
                                        {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>}
                                    </div>
                                </div>
                            </AnimatedCard>

                            {/* Image Upload */}
                            <AnimatedCard delay={100} className="bg-white border border-gray-200 p-6 rounded-lg">
                                <h2 className="text-lg font-semibold mb-6">Product Images</h2>
                                <div className="border border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-orange-500 transition-colors duration-200">
                                    <UploadIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                                    <p className="text-gray-600 mb-2 ">Upload product images</p>
                                    <p className="text-gray-500 mb-6 text-xs">PNG, JPG, JPEG up to 10MB each</p>
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
                                        className="inline-flex items-center gap-2 text-white bg-gradient-to-r from-orange-500 to-red-500 px-4 py-2 rounded-md cursor-pointer transition-all duration-200 font-medium shadow-sm hover:shadow-md"
                                    >
                                        <UploadIcon className="w-5 h-5" /> Choose Files
                                    </label>
                                    
                                </div>
                                {images.length > 0 && (
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
                                            {images.map((image, index) => (
                                                <div key={index} className="relative group">
                                                    <div className="w-24 h-24 rounded-xl overflow-hidden border-2 border-gray-200 shadow-sm">
                                                        <img 
                                                            src={URL.createObjectURL(image)} 
                                                            alt={`Preview ${index + 1}`} 
                                                            className="w-full h-full object-cover" 
                                                        />
                                                    </div>
                                                    <button 
                                                        onClick={() => removeImage(index)} 
                                                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1.5 hover:bg-red-600 transition-colors duration-200 shadow-lg opacity-0 group-hover:opacity-100"
                                                    >
                                                        <Cross2Icon className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                            </AnimatedCard>
                        </>
                    ) : (
                        <>
                            {/* Product Summary */}
                            <AnimatedCard delay={0} className="bg-white border border-gray-200 p-6 rounded-lg">
                                <h2 className="text-lg font-semibold mb-6">Product Summary</h2>
                                <div className="flex flex-wrap gap-3">
                                    {[
                                        { text: `${watch('brand')} ${watch('model_name')}`, bg: 'bg-blue-50', textColor: 'text-blue-700', border: 'border-blue-200' },
                                        { text: watch('category'), bg: 'bg-green-50', textColor: 'text-green-700', border: 'border-green-200' },
                                        { text: `$${watch('price_retail')}`, bg: 'bg-purple-50', textColor: 'text-purple-700', border: 'border-purple-200' }
                                    ].map((badge, i) => (
                                        <span key={i} className={`px-4 py-2 ${badge.bg} ${badge.textColor} ${badge.border} border rounded-lg text-sm font-medium`}>{badge.text}</span>
                                    ))}
                                </div>
                            </AnimatedCard>

                            {/* Variants */}
                            <div className="bg-white border border-gray-200 p-6">
                                <div className="flex justify-between items-center mb-6">
                                    <h2 className="text-lg font-semibold">Product Variants</h2>
                                    <button 
                                        onClick={addVariant} 
                                        className="inline-flex items-center gap-2 text-white bg-gradient-to-r from-orange-500 to-red-500 px-4 py-2 rounded-md cursor-pointer transition-all duration-200 font-medium shadow-sm hover:shadow-md"
                                    >
                                        <PlusIcon className="w-4 h-4" /> Add Variant
                                    </button>
                                </div>
                                <div className="space-y-4">
                                    {fields.map((field, index) => (
                                        <div key={field.id} className="grid grid-cols-1 md:grid-cols-4 gap-4 p-6 bg-gray-50 rounded-xl border border-gray-100">
                                            {[
                                                { label: 'Size', field: 'size', type: 'number', placeholder: '42', min: '35', max: '50' },
                                                { label: 'Color', field: 'color', type: 'select', options: ['Black', 'White', 'Red', 'Blue', 'Green', 'Yellow', 'Orange', 'Purple', 'Pink', 'Brown', 'Gray', 'Navy', 'Beige', 'Gold', 'Silver'] },
                                                { label: 'Quantity', field: 'quantity', type: 'number', placeholder: '10', min: '0' },
                                                { label: 'Price ($)', field: 'price', type: 'number', placeholder: watch('price_retail'), step: '0.01', min: '0' }
                                            ].map((fieldConfig, i) => (
                                                <div key={i} className={i === 3 ? 'flex gap-3' : ''}>
                                                    <div className={i === 3 ? 'flex-1' : ''}>
                                                        <label className="block text-sm font-semibold text-gray-800 mb-2">{fieldConfig.label}</label>
                                                        {fieldConfig.type === 'select' ? (
                                                            <select 
                                                                {...register(`variants.${index}.color` as const, { required: `${fieldConfig.label} is required` })}
                                                                className="w-full px-3 py-2.5 border border-gray-100 rounded-md focus:outline-none focus:border focus:border-orange-500 transition-all duration-200 bg-white"
                                                            >
                                                                <option value="">Select color</option>
                                                                {fieldConfig.options?.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                                                            </select>
                                                        ) : (
                                                            <input 
                                                                type={fieldConfig.type} 
                                                                {...register(
                                                                    fieldConfig.field === 'size' ? `variants.${index}.size` as const :
                                                                    fieldConfig.field === 'quantity' ? `variants.${index}.quantity` as const :
                                                                    `variants.${index}.price` as const,
                                                                    { 
                                                                        required: `${fieldConfig.label} is required`,
                                                                        ...(fieldConfig.field === 'quantity' && { 
                                                                            min: { value: 1, message: 'Quantity must be at least 1' }
                                                                        })
                                                                    }
                                                                )}
                                                                placeholder={fieldConfig.placeholder} 
                                                                className="w-full px-3 py-2.5 border border-gray-100 rounded-md focus:outline-none focus:border focus:border-orange-500 transition-all duration-200 bg-white" 
                                                                {...(fieldConfig.min && { min: fieldConfig.min })} 
                                                                {...(fieldConfig.max && { max: fieldConfig.max })} 
                                                                {...(fieldConfig.step && { step: fieldConfig.step })} 
                                                            />
                                                        )}
                                                    </div>
                                                    {i === 3 && fields.length > 1 && (
                                                        <button 
                                                            type="button"
                                                            onClick={() => removeVariant(index)} 
                                                            className="self-end px-3 py-2.5 bg-red-500 text-white rounded-lg hover:bg-red-600 cursor-pointer transition-all duration-200 shadow-sm hover:shadow-md"
                                                        >
                                                            <TrashIcon className="w-4 h-4" />
                                                        </button>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>

            {/* Sticky Footer */}
            <div className="sticky bottom-0 border-t border-gray-200 bg-white p-6">
                <div className="max-w-4xl mx-auto flex justify-between">
                    {step === 1 ? (
                        <>
                            <button 
                                onClick={handleCancel} 
                                className="flex text-gray-700 items-center justify-center gap-2 px-6 py-3 bg-gray-100 rounded-lg cursor-pointer hover:bg-gray-200 transition-all duration-200 font-medium"
                            >
                                <XCircle strokeWidth={1.5} size={16} />
                                Cancel
                            </button>
                            <button 
                                onClick={handleNext} 
                                className="flex items-center gap-2 px-6 py-2 rounded-md border border-orange-500 text-orange-500 hover:bg-orange-500/20 hover:text-orange-600 cursor-pointer transition-all duration-200 font-medium shadow-sm hover:shadow-md"
                            >
                                Add Variants <TriangleRightIcon />
                            </button>
                        </>
                    ) : (
                        <>
                            <button 
                                onClick={() => setStep(1)} 
                                className="flex items-center gap-2 px-6 py-2 rounded-md border border-orange-500 text-orange-500 hover:bg-orange-500/20 hover:text-orange-600 cursor-pointer transition-all duration-200 font-medium"
                            >
                                <TriangleLeftIcon /> Back
                            </button>
                            <div className="flex flex-row gap-3">
                                <button 
                                    onClick={handleCancel} 
                                    className="flex text-gray-700 items-center justify-center gap-2 px-6 py-2 bg-gray-100 rounded-md cursor-pointer hover:bg-gray-200 transition-all duration-200 font-medium"
                                >
                                    <XCircle strokeWidth={1.5} size={16} />
                                    Cancel
                                </button>                                
                                <button 
                                    type="submit" 
                                    disabled={isSubmitting}
                                    className="flex items-center gap-2 px-6 py-2 rounded-md bg-gradient-to-r from-orange-500 to-red-500 text-white hover:from-orange-600 hover:to-red-600 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium shadow-sm hover:shadow-md"
                                >
                                    {isSubmitting ? <Spinner /> : 'Create Product'}
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </form>
    );
}