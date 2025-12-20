"use client"

import { useState, useEffect } from 'react';
import { PlusIcon, TrashIcon, UploadIcon, Cross2Icon } from '@radix-ui/react-icons';
import { XCircle, Save } from 'lucide-react';
import { Spinner } from '@radix-ui/themes';
import toast from 'react-hot-toast';
import Image from 'next/image';
import useUpdateShow from '@/app/components/hooks/useUpdateShow';

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
  const { register, handleSubmit, reset, onSubmit, isUpdatingShoe } = useUpdateShow();
  const [sizes, setSizes] = useState<string[]>([]);
  const [newImages, setNewImages] = useState<File[]>([]);
  const [imagesToDelete, setImagesToDelete] = useState<number[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>([]);

  const MAX_FILE_SIZE = 5 * 1024 * 1024;
  const MAX_IMAGES = 5;

  useEffect(() => {
    if (isOpen && initialData) {
      // Reset form with initial data
      reset({
        brand: initialData.brand,
        model_name: initialData.model_name,
        category: initialData.category,
        price_retail: initialData.price_retail,
        description: initialData.description,
        colors: initialData.colors,
        sizes: initialData.sizes,
        stockToAdd: initialData.stockToAdd,
      });
      setSizes(initialData.sizes || []);
      setExistingImages(initialData.existingImages || []);
      setNewImages([]);
      setImagesToDelete([]);
    }
  }, [isOpen, initialData, reset]);

  const addSize = (size: string) => {
    if (size.trim() && !sizes.includes(size.trim())) {
      setSizes(prev => [...prev, size.trim()]);
    }
  };

  const removeSize = (index: number) => {
    setSizes(prev => prev.filter((_, i) => i !== index));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const totalImages = existingImages.length - imagesToDelete.length + newImages.length + files.length;

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

  const onFormSubmit = handleSubmit(async (data) => {
    const formDataToSend = new FormData();

    // Add form fields
    formDataToSend.append('brand', data.brand);
    if (data.model_name) formDataToSend.append('model_name', data.model_name);
    if (data.category) formDataToSend.append('category', data.category);
    formDataToSend.append('price_retail', parseFloat(data.price_retail).toString());
    if (data.description) formDataToSend.append('description', data.description);

    // Add sizes array
    formDataToSend.append('sizes', JSON.stringify(sizes));

    // Add colors if any
    if (data.colors && data.colors.length > 0) {
      formDataToSend.append('colors', JSON.stringify(data.colors));
    }

    // Add stockToAdd if provided
    if (data.stockToAdd) {
      formDataToSend.append('stockToAdd', data.stockToAdd);
    }

    // Append new image files
    newImages.forEach(image => {
      formDataToSend.append('imageUrls', image);
    });

    // Add images to delete
    if (imagesToDelete.length > 0) {
      formDataToSend.append('imagesToDelete', JSON.stringify(imagesToDelete));
    }

    const result = await onSubmit(formDataToSend);

    if (result?.success) {
      onClose();
      window.location.reload();
    }
  });

  const handleCancel = () => {
    if (confirm('Are you sure you want to cancel? All changes will be lost.')) {
      reset();
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-[rgba(0,0,0,0.5)] bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg w-full max-w-7xl max-h-[90vh] flex flex-col overflow-y-auto">
        <form onSubmit={onFormSubmit} className="flex flex-col h-full text-sm">
          {/* Header */}
          <div className="flex flex-col justify-center items-center gap-1 py-6 bg-white border-b border-gray-200">
            <h1 className="text-2xl font-semibold text-gray-900">Update Shoe</h1>
            <p className="text-gray-500">Modify product details and inventory</p>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6">
            <div className="max-w-4xl mx-auto space-y-6">
              {/* Basic Information */}
              <div className="bg-white border border-gray-200 p-6 rounded-lg shadow-sm">
                <h2 className="text-lg font-semibold mb-4 text-gray-900">Basic Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Brand *</label>
                    <input
                      type="text"
                      placeholder="e.g., Nike, Adidas"
                      {...register('brand')}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 bg-white"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Model</label>
                    <input
                      type="text"
                      placeholder="e.g., Air Max 90"
                      {...register('model_name')}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 bg-white"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Retail Price (RWF) *</label>
                    <input
                      type="number"
                      step="0.01"
                      placeholder="30000"
                      {...register('price_retail')}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 bg-white"
                    />
                  </div>
                </div>
              </div>

              {/* Sizes */}
              <div className="bg-white border border-gray-200 p-6 rounded-lg shadow-sm">
                <h2 className="text-lg font-semibold mb-4 text-gray-900">Product Variants</h2>
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
                    {sizes.map((size, idx) => (
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

              {/* Image Management */}
              <div className="bg-white border border-gray-200 p-6 rounded-lg shadow-sm">
                <h2 className="text-lg font-semibold mb-4 text-gray-900">Product Images</h2>

                {/* Existing Images */}
                {existingImages.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-sm font-medium text-gray-700 mb-3">Current Images</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {existingImages.map((imageUrl, index) => (
                        <div key={index} className="relative group">
                          <div className={`w-full h-32 rounded-lg overflow-hidden border-2 ${imagesToDelete.includes(index) ? 'border-red-500 opacity-50' : 'border-gray-200'
                            } shadow-sm`}>
                            <Image
                              src={imageUrl}
                              alt={`Product ${index + 1}`}
                              className="w-full h-full object-cover"
                              width={128}
                              height={128}
                            />
                          </div>
                          <button
                            type="button"
                            onClick={() => markImageForDeletion(index)}
                            className={`absolute -top-2 -right-2 ${imagesToDelete.includes(index) ? 'bg-yellow-500 hover:bg-yellow-600' : 'bg-red-500 hover:bg-red-600'
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
                    Total: {existingImages.length - imagesToDelete.length + newImages.length}/{MAX_IMAGES}
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
                      {newImages.map((image: File, index: number) => (
                        <div key={index} className="relative group">
                          <div className="w-full h-32 rounded-lg overflow-hidden border-2 border-green-500 shadow-sm">
                            <Image
                              src={URL.createObjectURL(image)}
                              alt={`New ${index + 1}`}
                              className="w-full h-full object-cover"
                              width={128}
                              height={128}
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
            </div>
          </div>

          {/* Footer */}
          <div className="border-t border-gray-200 bg-white p-6">
            <div className="max-w-4xl mx-auto flex justify-end gap-3">
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
                disabled={isUpdatingShoe}
                className="flex items-center gap-2 px-6 py-2.5 rounded-lg bg-gradient-to-r from-orange-500 to-red-500 text-white hover:from-orange-600 hover:to-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium shadow-sm hover:shadow-md"
              >
                {isUpdatingShoe ? (
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
          </div>
        </form>
      </div>
    </div>
  );
}