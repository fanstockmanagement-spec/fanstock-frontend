"use client";

import React, { useState } from 'react';
import { PlusIcon, TrashIcon, UploadIcon, Cross2Icon, TriangleRightIcon, TriangleLeftIcon } from '@radix-ui/react-icons';
import { useRouter } from 'next/navigation';
import AnimatedCard from '../components/AnimatedCard';

interface VariantForm {
    size: string;
    color: string;
    quantity: string;
    price: string;
}

const initialForm = {
    brand: '', model: '', category: '', defaultPrice: '', description: '',
    images: [] as File[], variants: [{ size: '', color: '', quantity: '', price: '' }]
};

export default function CreateShoesPage() {
    const [step, setStep] = useState(1);
    const [form, setForm] = useState(initialForm);
    const router = useRouter();
    const updateForm = (field: string, value: any) => setForm(prev => ({ ...prev, [field]: value }));
    const resetForm = () => { setStep(1); setForm(initialForm); };
    const handleCancel = () => router.back();

    const handleNext = () => {
        const { brand, model, category, defaultPrice, variants } = form;
        if (!brand.trim() || !model.trim() || !category.trim() || !defaultPrice.trim()) {
            return alert('Please fill in all product details');
        }
        if (isNaN(parseFloat(defaultPrice)) || parseFloat(defaultPrice) <= 0) {
            return alert('Please enter a valid price');
        }
        updateForm('variants', variants.map(v => ({ ...v, price: v.price || defaultPrice })));
        setStep(2);
    };

    const addVariant = () => updateForm('variants', [...form.variants, { size: '', color: '', quantity: '', price: form.defaultPrice }]);
    const removeVariant = (index: number) => form.variants.length > 1 && updateForm('variants', form.variants.filter((_, i) => i !== index));
    const updateVariant = (index: number, field: keyof VariantForm, value: string) => {
        const newVariants = [...form.variants];
        newVariants[index][field] = value;
        updateForm('variants', newVariants);
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        updateForm('images', [...form.images, ...Array.from(e.target.files || [])]);
    };
    const removeImage = (index: number) => updateForm('images', form.images.filter((_, i) => i !== index));

    const handleSubmit = () => {
        const validVariants = form.variants.filter(v => Object.values(v).every(val => val.trim()));
        if (validVariants.length === 0) return alert('Please add at least one valid variant');

        console.log('Creating product:', {
            ...form,
            variants: validVariants.map(v => ({ ...v, size: parseInt(v.size), quantity: parseInt(v.quantity), price: parseFloat(v.price) }))
        });
        alert('Product created successfully!');
        resetForm();
    };

  return (
        <div className="flex flex-col min-h-screen text-sm">
            {/* Header */}
            <div className="flex flex-col justify-center items-center gap-1 py-6 border-b border-gray-200">
                <h1 className="text-2xl font-semibold">Create New Shoes</h1>
                <p className="text-gray-500">Add a new product to your inventory</p>
                <div className="flex items-center gap-2 mt-2">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${step >= 1 ? 'bg-[#CA425A] text-white' : 'bg-gray-200 text-gray-500'
                        }`}>
                        1
                    </div>
                    <div className={`w-16 h-1 ${step >= 2 ? 'bg-[#CA425A]' : 'bg-gray-200'}`}></div>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${step >= 2 ? 'bg-[#CA425A] text-white' : 'bg-gray-200 text-gray-500'
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
                            <AnimatedCard delay={0}  className="bg-white border border-gray-200 p-6">
                                <h2 className="text-lg font-semibold mb-4">Basic Information</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {[
                                        { label: 'Brand', value: form.brand, onChange: (e: any) => updateForm('brand', e.target.value), placeholder: 'e.g., Nike, Adidas' },
                                        { label: 'Model', value: form.model, onChange: (e: any) => updateForm('model', e.target.value), placeholder: 'e.g., Air Max 90' },
                                        { label: 'Category', value: form.category, onChange: (e: any) => updateForm('category', e.target.value), type: 'select', options: ['Sneakers', 'Running', 'Basketball', 'Canvas', 'Boots', 'Formal', 'Sandals'] },
                                        { label: 'Default Price ($)', value: form.defaultPrice, onChange: (e: any) => updateForm('defaultPrice', e.target.value), type: 'number', placeholder: '120.00' }
                                    ].map((field, i) => (
                                        <div key={i}>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">{field.label}</label>
                                            {field.type === 'select' ? (
                                                <select value={field.value} onChange={field.onChange} className="w-full p-3 border border-gray-200 focus:outline-none focus:border-1 focus:border-[#CA425A]">
                                                    <option value="">Select category</option>
                                                    {field.options?.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                                                </select>
                                            ) : (
                                                <input type={field.type || 'text'} value={field.value} onChange={field.onChange} placeholder={field.placeholder} className="w-full p-3 border border-gray-200 focus:outline-none focus:border-1 focus:border-[#CA425A]" />
                                            )}
                                        </div>
                                    ))}
                                </div>
                                <div className="mt-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                                    <textarea value={form.description} onChange={(e) => updateForm('description', e.target.value)} placeholder="Describe the shoes..." rows={4} className="w-full p-3 border border-gray-200 focus:outline-none focus:border-1 focus:border-[#CA425A]" />
                                </div>
                            </AnimatedCard>

                            {/* Image Upload */}
                            <AnimatedCard delay={100}  className="bg-white border border-gray-200 p-6">
                                <h2 className="text-lg font-semibold mb-4">Product Images</h2>
                                <div className="border border-dashed border-gray-300 rounded-lg p-6 text-center">
                                    <UploadIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                                    <p className="text-gray-600 mb-2">Upload product images</p>
                                    <input type="file" multiple accept="image/*" onChange={handleImageUpload} className="hidden" id="image-upload" />
                                    <label htmlFor="image-upload" className="inline-flex items-center gap-2 text-white bg-[#CA425A] p-3 cursor-pointer  hover:bg-[#CA425A]/90 transition-colors duration-150">
                                        <UploadIcon className="w-4 h-4 mr-2" /> Choose Files
                                    </label>
                                </div>
                                {form.images.length > 0 && (
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                                        {form.images.map((image, index) => (
                                            <div key={index} className="relative w-20 h-20">
                                                <img src={URL.createObjectURL(image)} alt={`Preview ${index + 1}`} className="rounded-full h-20 w-20 overflow-hidden border border-gray-200" />
                                                <button onClick={() => removeImage(index)} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600">
                                                    <Cross2Icon className="w-3 h-3" />
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
                            <AnimatedCard delay={0}  className="bg-white border border-gray-200 p-6">
                                <h2 className="text-lg font-semibold mb-4">Product Summary</h2>
                                <div className="flex flex-wrap gap-2">
                                    {[
                                        { text: `${form.brand} ${form.model}`, bg: 'bg-blue-100', textColor: 'text-blue-800' },
                                        { text: form.category, bg: 'bg-green-100', textColor: 'text-green-800' },
                                        { text: `$${form.defaultPrice}`, bg: 'bg-purple-100', textColor: 'text-purple-800' }
                                    ].map((badge, i) => (
                                        <span key={i} className={`px-3 py-1 ${badge.bg} ${badge.textColor} rounded-full text-sm`}>{badge.text}</span>
                                    ))}
                                </div>
                            </AnimatedCard>

                            {/* Variants */}
                            <div className="bg-white border border-gray-200 p-6">
                                <div className="flex justify-between items-center mb-4">
                                    <h2 className="text-lg font-semibold">Product Variants</h2>
                                    <button onClick={addVariant} className="inline-flex items-center gap-2 text-white bg-[#CA425A] p-3 cursor-pointer  hover:bg-[#CA425A]/90 transition-colors duration-150">
                                        <PlusIcon className="w-4 h-4 mr-2" /> Add Variant
                                    </button>
                                </div>
                                <div className="space-y-4">
                                    {form.variants.map((variant, index) => (
                                        <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-3 p-4 bg-gray-50">
                                            {[
                                                { label: 'Size', field: 'size', type: 'number', placeholder: '42', min: '35', max: '50' },
                                                { label: 'Color', field: 'color', type: 'select', options: ['Black', 'White', 'Red', 'Blue', 'Green', 'Yellow', 'Orange', 'Purple', 'Pink', 'Brown', 'Gray', 'Navy', 'Beige', 'Gold', 'Silver'] },
                                                { label: 'Quantity', field: 'quantity', type: 'number', placeholder: '10', min: '0' },
                                                { label: 'Price ($)', field: 'price', type: 'number', placeholder: form.defaultPrice, step: '0.01', min: '0' }
                                            ].map((field, i) => (
                                                <div key={i} className={i === 3 ? 'flex gap-2' : ''}>
                                                    <div className={i === 3 ? 'flex-1' : ''}>
                                                        <label className="block text-xs font-medium text-gray-700 mb-1">{field.label}</label>
                                                        {field.type === 'select' ? (
                                                            <select value={variant[field.field as keyof VariantForm]} onChange={(e) => updateVariant(index, field.field as keyof VariantForm, e.target.value)} className="w-full p-3 border border-gray-200 focus:outline-none focus:border-1 focus:border-[#CA425A]">
                                                                <option value="">Select color</option>
                                                                {field.options?.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                                                            </select>
                                                        ) : (
                                                            <input type={field.type} value={variant[field.field as keyof VariantForm]} onChange={(e) => updateVariant(index, field.field as keyof VariantForm, e.target.value)} placeholder={field.placeholder} className="w-full p-3 border border-gray-200 focus:outline-none focus:border-1 focus:border-[#CA425A]" {...(field.min && { min: field.min })} {...(field.max && { max: field.max })} {...(field.step && { step: field.step })} />
                                                        )}
                                                    </div>
                                                    {i === 3 && form.variants.length > 1 && (
                                                        <button onClick={() => removeVariant(index)} className="self-end px-2 py-2 bg-red-500 text-white rounded-full hover:bg-red-600 cursor-pointer">
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
            <div className="sticky bottom-0 bg-white border-t border-gray-200 p-4">
                <div className="max-w-4xl mx-auto flex justify-between">
                     {step === 1 ? (
                         <>
                             <button onClick={handleCancel} className="px-6 py-2 border border-gray-300 text-gray-700 hover:bg-gray-50 cursor-pointer">Cancel</button>
                             <button onClick={handleNext} className="flex items-center gap-2 p-3 bg-[#CA425A] text-white hover:bg-[#CA425A]/90 cursor-pointer">Add Variants <TriangleRightIcon /> </button>
                         </>
                     ) : (
                         <>
                             <button onClick={() => setStep(1)} className="flex items-center gap-2 p-3 border border-gray-300 text-gray-700 hover:bg-gray-50 cursor-pointer"><TriangleLeftIcon /> Back</button>
                             <div className="flex gap-3">
                                 <button onClick={handleCancel} className="flex items-center gap-2 p-3 border border-gray-300 text-gray-700 hover:bg-gray-50 cursor-pointer">Cancel</button>
                                 <button onClick={handleSubmit} className="flex items-center gap-2 p-3 bg-green-500 text-white hover:bg-green-500/90 cursor-pointer">Create Product</button>
                             </div>
                         </>
                     )}
                </div>
            </div>
    </div>
  );
}