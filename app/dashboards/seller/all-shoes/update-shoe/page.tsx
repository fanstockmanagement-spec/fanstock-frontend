"use client"

import { useState, useEffect } from 'react';
import { PlusIcon, TrashIcon, UploadIcon, Cross2Icon, TriangleRightIcon, TriangleLeftIcon } from '@radix-ui/react-icons';
import { XCircle, Save } from 'lucide-react';
import { Spinner } from '@radix-ui/themes';
import toast from 'react-hot-toast';

interface UpdateShoeFormProps {
  isOpen: boolean;
  onClose: () => void;
  shoeId: string;
  initialData: {
    brand: string;
    model_name: string;
    category: string;
    price_retail: string;
    description: string;
    colors: string[];
    sizes: string[];
    existingImages: string[];
    stockToAdd: string;
  };
}

export default function UpdateShoeForm({ isOpen, onClose, shoeId, initialData }: UpdateShoeFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<{
    brand: string;
    model_name: string;
    category: string;
    price_retail: string;
    description: string;
    colors: string[];
    sizes: string[];
    existingImages: string[];
    stockToAdd: string;
  }>({
    brand: '',
    model_name: '',
    category: '',
    price_retail: '',
    description: '',
    colors: [],
    sizes: [],
    existingImages: [],
    stockToAdd: ''
  });
  const [newImages, setNewImages] = useState<File[]>([]);
  const [imagesToDelete, setImagesToDelete] = useState<number[]>([]);

  const MAX_FILE_SIZE = 5 * 1024 * 1024;
  const MAX_IMAGES = 5;

  useEffect(() => {
    if (isOpen && initialData) {
      setFormData(initialData);
      setNewImages([]);
      setImagesToDelete([]);
      setStep(1);
    }
  }, [isOpen, initialData]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const addColor = (color: string) => {
    if (color.trim() && !formData.colors.includes(color.trim())) {
      setFormData(prev => ({ ...prev, colors: [...prev.colors, color.trim()] }));
    }
  };

  const removeColor = (index: number) => {
    setFormData(prev => ({ ...prev, colors: prev.colors.filter((_, i) => i !== index) }));
  };

  const addSize = (size: string) => {
    if (size.trim() && !formData.sizes.includes(size.trim())) {
      setFormData(prev => ({ ...prev, sizes: [...prev.sizes, size.trim()] }));
    }
  };

  const removeSize = (index: number) => {
    setFormData(prev => ({ ...prev, sizes: prev.sizes.filter((_, i) => i !== index) }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const totalImages = (formData.existingImages?.length || 0) - imagesToDelete.length + newImages.length + files.length;
    
    if (totalImages > MAX_IMAGES) {
      toast.error(`Maximum ${MAX_IMAGES} images allowed`);
      return;
    }
    
    const validFiles = files.filter(file => {
      if (file.size > MAX_FILE_SIZE) {
        toast.error(`${file.name} exceeds ${MAX_FILE_SIZE / (1024 * 1024)}MB`);
        return false;
      }
      return true;
    });
    
    setNewImages(prev => [...prev, ...validFiles]);
  };

  const removeNewImage = (index: number) => {
    setNewImages(prev => prev.filter((_, i) => i !== index));
  };

  const markImageForDeletion = (index: number) => {
    if (imagesToDelete.includes(index)) {
      setImagesToDelete(prev => prev.filter(i => i !== index));
    } else {
      setImagesToDelete(prev => [...prev, index]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const formDataToSend = new FormData();
      
      // Add all form fields except existingImages
      Object.entries(formData).forEach(([key, value]) => {
        if (key === 'existingImages') return;
        
        if (key === 'colors' || key === 'sizes') {
          // Send arrays as JSON strings
          formDataToSend.append(key, JSON.stringify(value));
        } else if (key === 'price_retail') {
          // Send price as a properly formatted number
          formDataToSend.append(key, parseFloat(value).toString());
        } else if (key === 'stockToAdd') {
          // Send stockToAdd as number
          formDataToSend.append(key, value);
        } else {
          formDataToSend.append(key, String(value));
        }
      });
      
      // Append new image files
      // Each file should be appended individually with the key 'imageUrls'
      newImages.forEach(image => {
        formDataToSend.append('imageUrls', image);
      });
      
      // Add images to delete as JSON array
      if (imagesToDelete.length > 0) {
        formDataToSend.append('imagesToDelete', JSON.stringify(imagesToDelete));
      }
      
      const token = localStorage.getItem('token');
      const headers: HeadersInit = {
        'Authorization': `Bearer ${token}`,
      };
      
      console.log('Submitting form with data:');
      console.log('- Brand:', formData.brand);
      console.log('- Model:', formData.model_name);
      console.log('- Price:', formData.price_retail);
      console.log('- Colors:', formData.colors);
      console.log('- Sizes:', formData.sizes);
      console.log('- New Images:', newImages.length);
      console.log('- Images to Delete:', imagesToDelete);
      
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/update-shoe/${shoeId}`,
        {
          method: 'PUT',
          headers,
          body: formDataToSend
        }
      );
      
      if (response.ok) {
        toast.success('Shoe updated successfully!');
        onClose();
        window.location.reload();
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Update failed');
      }
    } catch (error) {
      console.error('Error updating shoe:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to update shoe';
      toast.error(`Failed to update shoe: ${errorMessage}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNext = () => {
    if (!formData.brand || !formData.model_name || !formData.category || !formData.price_retail || !formData.description) {
      toast.error('Please fill in all required fields');
      return;
    }
    setStep(2);
  };

  const handleBack = () => setStep(1);

  const handleCancel = () => {
    if (confirm('Are you sure you want to cancel? All changes will be lost.')) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-[rgba(0,0,0,0.5)] bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg w-full max-w-6xl max-h-[90vh] flex flex-col overflow-y-auto">
        <form onSubmit={handleSubmit} className="flex flex-col h-full text-sm">
          {/* Header */}
          <div className="flex flex-col justify-center items-center gap-1 py-6 bg-white border-b border-gray-200">
            <h1 className="text-2xl font-semibold text-gray-900">Update Shoe</h1>
            <p className="text-gray-500">Modify product details and inventory</p>
            <div className="flex items-center gap-2 mt-4">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                step >= 1 ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white' : 'bg-gray-200 text-gray-500'
              }`}>
                1
              </div>
              <div className={`w-16 h-1 ${step >= 2 ? 'bg-orange-500' : 'bg-gray-200'}`}></div>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                step >= 2 ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white' : 'bg-gray-200 text-gray-500'
              }`}>
                2
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6">
            <div className="max-w-4xl mx-auto space-y-6">
              {step === 1 ? (
                <>
                  {/* Basic Information */}
                  <div className="bg-white border border-gray-200 p-6 rounded-lg shadow-sm">
                    <h2 className="text-lg font-semibold mb-4 text-gray-900">Basic Information</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">Brand *</label>
                        <input 
                          type="text" 
                          placeholder="e.g., Nike, Adidas" 
                          value={formData.brand}
                          onChange={(e) => handleInputChange('brand', e.target.value)}
                          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 bg-white" 
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">Model *</label>
                        <input 
                          type="text" 
                          placeholder="e.g., Air Max 90" 
                          value={formData.model_name}
                          onChange={(e) => handleInputChange('model_name', e.target.value)}
                          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 bg-white" 
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">Category *</label>
                        <select 
                          value={formData.category}
                          onChange={(e) => handleInputChange('category', e.target.value)}
                          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 bg-white" 
                        >
                          <option value="">Select category</option>
                          {['Men', 'Women', 'Kids', 'Sports', 'Unisex'].map(opt => 
                            <option key={opt} value={opt}>{opt}</option>
                          )}
                        </select>
                      </div>
                      
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">Retail Price (RWF) *</label>
                        <input 
                          type="number" 
                          step="0.01"
                          placeholder="30000" 
                          value={formData.price_retail}
                          onChange={(e) => handleInputChange('price_retail', e.target.value)}
                          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 bg-white" 
                        />
                      </div>
                    </div>
                    
                    <div className="mt-6 space-y-2">
                      <label className="block text-sm font-medium text-gray-700">Description *</label>
                      <textarea 
                        placeholder="Describe the shoes..." 
                        rows={4} 
                        value={formData.description}
                        onChange={(e) => handleInputChange('description', e.target.value)}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 bg-white resize-none" 
                      />
                    </div>
                  </div>

                  {/* Colors and Sizes */}
                  <div className="bg-white border border-gray-200 p-6 rounded-lg shadow-sm">
                    <h2 className="text-lg font-semibold mb-4 text-gray-900">Product Variants</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Colors */}
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">Available Colors</label>
                        <div className="flex gap-2">
                          <input 
                            type="text" 
                            placeholder="Add color..."
                            onKeyPress={(e) => {
                              if (e.key === 'Enter') {
                                e.preventDefault();
                                addColor((e.target as HTMLInputElement).value);
                                (e.target as HTMLInputElement).value = '';
                              }
                            }}
                            className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 bg-white" 
                          />
                          <button
                            type="button"
                            onClick={(e) => {
                              const input = e.currentTarget.previousElementSibling as HTMLInputElement;
                              addColor(input.value);
                              input.value = '';
                            }}
                            className="px-4 py-2.5 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-all duration-200"
                          >
                            <PlusIcon className="w-5 h-5" />
                          </button>
                        </div>
                        <div className="flex flex-wrap gap-2 mt-3">
                          {formData.colors.map((color, idx) => (
                            <span 
                              key={idx} 
                              className="px-3 py-1.5 bg-orange-50 text-orange-700 rounded-full text-sm border border-orange-200 flex items-center gap-2 group"
                            >
                              {color}
                              <button
                                type="button"
                                onClick={() => removeColor(idx)}
                                className="hover:bg-orange-200 rounded-full p-0.5 transition-colors"
                              >
                                <Cross2Icon className="w-3 h-3" />
                              </button>
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Sizes */}
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">Available Sizes</label>
                        <div className="flex gap-2">
                          <input 
                            type="text" 
                            placeholder="Add size..."
                            onKeyPress={(e) => {
                              if (e.key === 'Enter') {
                                e.preventDefault();
                                addSize((e.target as HTMLInputElement).value);
                                (e.target as HTMLInputElement).value = '';
                              }
                            }}
                            className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 bg-white" 
                          />
                          <button
                            type="button"
                            onClick={(e) => {
                              const input = e.currentTarget.previousElementSibling as HTMLInputElement;
                              addSize(input.value);
                              input.value = '';
                            }}
                            className="px-4 py-2.5 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-all duration-200"
                          >
                            <PlusIcon className="w-5 h-5" />
                          </button>
                        </div>
                        <div className="flex flex-wrap gap-2 mt-3">
                          {formData.sizes.map((size, idx) => (
                            <span 
                              key={idx} 
                              className="px-3 py-1.5 bg-blue-50 text-blue-700 rounded-full text-sm border border-blue-200 flex items-center gap-2 group"
                            >
                              {size}
                              <button
                                type="button"
                                onClick={() => removeSize(idx)}
                                className="hover:bg-blue-200 rounded-full p-0.5 transition-colors"
                              >
                                <Cross2Icon className="w-3 h-3" />
                              </button>
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Image Management */}
                  <div className="bg-white border border-gray-200 p-6 rounded-lg shadow-sm">
                    <h2 className="text-lg font-semibold mb-4 text-gray-900">Product Images</h2>
                    
                    {/* Existing Images */}
                    {formData.existingImages.length > 0 && (
                      <div className="mb-6">
                        <h3 className="text-sm font-medium text-gray-700 mb-3">Current Images</h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          {formData.existingImages.map((imageUrl, index) => (
                            <div key={index} className="relative group">
                              <div className={`w-full h-32 rounded-lg overflow-hidden border-2 ${
                                imagesToDelete.includes(index) ? 'border-red-500 opacity-50' : 'border-gray-200'
                              } shadow-sm`}>
                                <img 
                                  src={imageUrl} 
                                  alt={`Product ${index + 1}`} 
                                  className="w-full h-full object-cover" 
                                />
                              </div>
                              <button 
                                type="button"
                                onClick={() => markImageForDeletion(index)} 
                                className={`absolute -top-2 -right-2 ${
                                  imagesToDelete.includes(index) ? 'bg-yellow-500 hover:bg-yellow-600' : 'bg-red-500 hover:bg-red-600'
                                } text-white rounded-full p-1.5 transition-colors duration-200 shadow-lg opacity-0 group-hover:opacity-100`}
                              >
                                {imagesToDelete.includes(index) ? (
                                  <PlusIcon className="w-4 h-4" />
                                ) : (
                                  <TrashIcon className="w-4 h-4" />
                                )}
                              </button>
                              {imagesToDelete.includes(index) && (
                                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-lg">
                                  <span className="text-white text-xs font-medium">Marked for deletion</span>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* New Images Upload */}
                    <div className="border border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-orange-500 transition-colors duration-200 bg-gray-50">
                      <UploadIcon className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                      <p className="text-gray-600 mb-2 font-medium">Upload New Images</p>
                      <p className="text-gray-500 mb-4 text-xs">
                        PNG, JPG, JPEG up to {MAX_FILE_SIZE / (1024 * 1024)}MB each
                      </p>
                      <p className="text-gray-500 mb-4 text-xs">
                        Total: {formData.existingImages.length - imagesToDelete.length + newImages.length}/{MAX_IMAGES}
                      </p>
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        className="hidden"
                        id="new-image-upload"
                        onChange={handleImageUpload}
                      />
                      <label
                        htmlFor="new-image-upload"
                        className="inline-flex items-center gap-2 text-white bg-gradient-to-r from-orange-500 to-red-500 px-5 py-2.5 rounded-lg cursor-pointer transition-all duration-200 font-medium shadow-sm hover:shadow-md hover:from-orange-600 hover:to-red-600"
                      >
                        <UploadIcon className="w-4 h-4" /> Choose Files
                      </label>
                    </div>

                    {/* New Images Preview */}
                    {newImages.length > 0 && (
                      <div className="mt-6">
                        <h3 className="text-sm font-medium text-gray-700 mb-3">New Images to Upload</h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          {newImages.map((image, index) => (
                            <div key={index} className="relative group">
                              <div className="w-full h-32 rounded-lg overflow-hidden border-2 border-green-500 shadow-sm">
                                <img 
                                  src={URL.createObjectURL(image)} 
                                  alt={`New ${index + 1}`} 
                                  className="w-full h-full object-cover" 
                                />
                              </div>
                              <button 
                                type="button"
                                onClick={() => removeNewImage(index)} 
                                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1.5 hover:bg-red-600 transition-colors duration-200 shadow-lg opacity-0 group-hover:opacity-100"
                              >
                                <Cross2Icon className="w-4 h-4" />
                              </button>
                              <div className="absolute top-2 left-2 bg-green-500 text-white text-xs px-2 py-1 rounded font-medium">
                                NEW
                              </div>
                              <div className="absolute bottom-2 left-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded">
                                {(image.size / (1024 * 1024)).toFixed(2)} MB
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <>
                  {/* Step 2: Stock & Variants */}
                  <div className="bg-white border border-gray-200 p-6 rounded-lg shadow-sm">
                    <h2 className="text-lg font-semibold mb-4 text-gray-900">Product Summary</h2>
                    <div className="flex flex-wrap gap-3">
                      <span className="px-4 py-2 bg-blue-50 text-blue-700 border border-blue-200 rounded-lg text-sm font-medium">
                        {formData.brand} {formData.model_name}
                      </span>
                      <span className="px-4 py-2 bg-green-50 text-green-700 border border-green-200 rounded-lg text-sm font-medium">
                        {formData.category}
                      </span>
                      <span className="px-4 py-2 bg-purple-50 text-purple-700 border border-purple-200 rounded-lg text-sm font-medium">
                        {formData.price_retail} RWF
                      </span>
                    </div>
                  </div>

                  <div className="bg-white border border-gray-200 p-6 rounded-lg shadow-sm">
                    <h2 className="text-lg font-semibold mb-4 text-gray-900">Stock to Add</h2>
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">Additional Stock Quantity *</label>
                      <input 
                        type="number" 
                        placeholder="500" 
                        value={formData.stockToAdd}
                        onChange={(e) => handleInputChange('stockToAdd', e.target.value)}
                        className="w-full md:w-1/2 px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 bg-white" 
                      />
                      <p className="text-xs text-gray-500">This will be added to the existing stock</p>
                    </div>
                  </div>

                  <div className="bg-white border border-gray-200 p-6 rounded-lg shadow-sm">
                    <h2 className="text-lg font-semibold mb-4 text-gray-900">Available Options (Read-only)</h2>
                    <p className="text-sm text-gray-500 mb-4">Colors and sizes can be edited in Step 1</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">Colors</label>
                        <div className="flex flex-wrap gap-2">
                          {formData.colors.map((color, idx) => (
                            <span key={idx} className="px-3 py-1.5 bg-orange-50 text-orange-700 rounded-full text-sm border border-orange-200">
                              {color}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">Sizes</label>
                        <div className="flex flex-wrap gap-2">
                          {formData.sizes.map((size, idx) => (
                            <span key={idx} className="px-3 py-1.5 bg-blue-50 text-blue-700 rounded-full text-sm border border-blue-200">
                              {size}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="border-t border-gray-200 bg-white p-6">
            <div className="max-w-4xl mx-auto flex justify-between">
              {step === 1 ? (
                <>
                  <button 
                    type="button"
                    onClick={handleCancel} 
                    className="flex text-gray-700 items-center justify-center gap-2 px-6 py-2.5 bg-gray-100 rounded-lg hover:bg-gray-200 transition-all duration-200 font-medium"
                  >
                    <XCircle strokeWidth={1.5} size={16} />
                    Cancel
                  </button>
                  <button 
                    type="button"
                    onClick={handleNext} 
                    className="flex items-center gap-2 px-6 py-2.5 rounded-lg bg-gradient-to-r from-orange-500 to-red-500 text-white hover:from-orange-600 hover:to-red-600 transition-all duration-200 font-medium shadow-sm hover:shadow-md"
                  >
                    Next: Stock & Review <TriangleRightIcon />
                  </button>
                </>
              ) : (
                <>
                  <button 
                    type="button"
                    onClick={handleBack} 
                    className="flex items-center gap-2 px-6 py-2.5 rounded-lg border-2 border-orange-500 text-orange-500 hover:bg-orange-50 transition-all duration-200 font-medium"
                  >
                    <TriangleLeftIcon /> Back
                  </button>
                  <div className="flex gap-3">
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
                      disabled={isSubmitting}
                      className="flex items-center gap-2 px-6 py-2.5 rounded-lg bg-gradient-to-r from-orange-500 to-red-500 text-white hover:from-orange-600 hover:to-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium shadow-sm hover:shadow-md"
                    >
                      {isSubmitting ? (
                        <>
                          <Spinner /> Updating...
                        </>
                      ) : (
                        <>
                          <Save size={16} /> Update Shoe
                        </>
                      )}
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}