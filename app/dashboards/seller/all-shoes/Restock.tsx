import { useState, useEffect } from 'react';
import { Plus, Package, X, XCircle } from 'lucide-react';
import useRestock, { RestockItem } from '@/app/components/hooks/useRestock';
import toast from 'react-hot-toast';

interface Shoe {
  shoe_id: string;
  brand: string;
  size_inventory: Array<{
    size: string;
    quantity: number;
  }>;
}

interface RestockModalProps {
  isOpen: boolean;
  onClose: () => void;
  shoe: Shoe;
}

export const RestockModal = ({ onClose, shoe }: RestockModalProps) => {
  const [items, setItems] = useState<RestockItem[]>([
    { size: '', quantity: 1, restock_price: 0 }
  ]);
  
  const { methods, onSubmit, isLoading, handleSubmit, getUserId } = useRestock();
  const { register, setValue } = methods;

  // Get user ID and update form
  useEffect(() => {
    const userId = getUserId();
    if (userId) {
      setValue('user_id', userId);
    }
  }, [setValue, getUserId]);

  // Update shoe_id when shoe changes
  useEffect(() => {
    if (shoe.shoe_id) {
      setValue('shoe_id', shoe.shoe_id);
    }
  }, [shoe.shoe_id, setValue]);

  // Add new item row
  const addItem = () => {
    setItems(prev => [...prev, { size: '', quantity: 1, restock_price: 0 }]);
  };

  // Remove item row
  const removeItem = (index: number) => {
    if (items.length > 1) {
      setItems(prev => prev.filter((_, i) => i !== index));
    }
  };

  // Update item field
  const updateItem = (index: number, field: keyof RestockItem, value: string | number) => {
    setItems(prev => {
      const newItems = [...prev];
      if (field === 'quantity' || field === 'restock_price') {
        newItems[index][field] = Number(value);
      } else {
        newItems[index][field] = value as string;
      }
      return newItems;
    });
  };

  // Handle form submission
  const handleFormSubmit = async () => {
    const userId = getUserId();
    
    if (!shoe.shoe_id || !userId) {
      toast.error(userId ? 'Shoe information missing' : 'Please log in to continue');
      return;
    }

    const formData = {
      shoe_id: shoe.shoe_id,
      user_id: userId,
      newStock: items
    };

    console.log('Submitting form data:', formData);
    
    const result = await onSubmit(formData);
    
    if (result?.success) {
      onClose();
      // Reset form
      setItems([{ size: '', quantity: 1, restock_price: 0 }]);
      window.location.reload();
    }
  };

  // Get all available sizes (current inventory + custom sizes entered by user)
  const getAvailableSizes = () => {
    const inventorySizes = shoe.size_inventory || [];
    const customSizes = items
      .map(item => item.size)
      .filter(size => size && !inventorySizes.some(inv => inv.size === size));
    
    return [...inventorySizes, ...customSizes.map(size => ({ size, quantity: 0 }))];
  };

  // Check if a size is from current inventory
  const isSizeInInventory = (size: string) => {
    return shoe.size_inventory?.some(item => item.size === size) || false;
  };

  // Calculate totals
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalCost = items.reduce((sum, item) => sum + (item.quantity * item.restock_price), 0);

  // Check if form is valid
  const userId = getUserId();
  const isFormValid = items.every(item => 
    item.size && item.quantity > 0 && item.restock_price >= 0
  ) && shoe.shoe_id && userId;

  const availableSizes = getAvailableSizes();

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-100 rounded-lg">
              <Package className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold">Restock Inventory</h2>
              <p className="text-sm text-gray-500">Add new stock for {shoe.brand}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="p-6">
          {/* Hidden fields for form data */}
          <input type="hidden" {...register('shoe_id')} />
          <input type="hidden" {...register('user_id')} />

          {/* Authentication warning */}
          {!userId && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-700 text-sm">
                Please log in to restock inventory. User ID not found in localStorage.
              </p>
            </div>
          )}

          {/* Instructions */}
          <div className="mb-6 p-4 bg-orange-50 border border-orange-200 rounded-lg">
            <h3 className="font-medium text-orange-900 mb-2">How to restock:</h3>
            <ul className="text-sm text-orange-800 space-y-1">
              <li>• Select existing sizes from dropdown to add more stock</li>
              <li>• Type new sizes manually to add completely new sizes</li>
              <li>• Each size entry requires quantity and price</li>
            </ul>
          </div>

          {/* Restock Items */}
          <div className="space-y-4 mb-6">
            <div className="flex items-center justify-between">
              <h3 className="font-medium">Items to Restock</h3>
              <span className="text-sm text-gray-500">
                {items.length} item{items.length !== 1 ? 's' : ''}
              </span>
            </div>

            {items.map((item, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium flex items-center gap-2">
                    <span className="w-6 h-6 bg-orange-500 text-white text-sm rounded-full flex items-center justify-center">
                      {index + 1}
                    </span>
                    Item #{index + 1}
                    {item.size && !isSizeInInventory(item.size) && (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        New Size
                      </span>
                    )}
                  </h4>
                  {items.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeItem(index)}
                      className="text-red-500 hover:text-red-700 transition-colors"
                    >
                      <XCircle className="w-5 h-5" />
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Size Selection - Now with free text input */}
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Size *
                      {item.size && !isSizeInInventory(item.size) && (
                        <span className="ml-2 text-green-600 text-xs">(New Size)</span>
                      )}
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={item.size}
                        onChange={(e) => updateItem(index, 'size', e.target.value)}
                        list={`sizes-${index}`}
                        placeholder="Enter size (e.g., 40, 41, 10.5)"
                        className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 pr-10"
                        required
                      />
                      {/* Dropdown indicator */}
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>
                    
                    {/* Datalist for suggested sizes */}
                    <datalist id={`sizes-${index}`}>
                      {availableSizes.map((sizeItem) => (
                        <option 
                          key={sizeItem.size} 
                          value={sizeItem.size}
                        >
                          {sizeItem.size} ({sizeItem.quantity} in stock)
                        </option>
                      ))}
                    </datalist>
                    
                    {/* Size suggestions */}
                    <div className="mt-2 flex flex-wrap gap-1">
                      {availableSizes.slice(0, 6).map((sizeItem) => (
                        <button
                          key={sizeItem.size}
                          type="button"
                          onClick={() => updateItem(index, 'size', sizeItem.size)}
                          className={`px-2 py-1 text-xs rounded border transition-colors ${
                            item.size === sizeItem.size
                              ? 'bg-orange-100 border-orange-300 text-orange-700'
                              : 'bg-gray-100 border-gray-300 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          {sizeItem.size}
                          {sizeItem.quantity > 0 && ` (${sizeItem.quantity})`}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Quantity */}
                  <div>
                    <label className="block text-sm font-medium mb-2">Quantity *</label>
                    <input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) => updateItem(index, 'quantity', parseInt(e.target.value) || 1)}
                      className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      required
                    />
                  </div>

                  {/* Price */}
                  <div>
                    <label className="block text-sm font-medium mb-2">Price per Item (RWF) *</label>
                    <input
                      type="number"
                      min="0"
                      step="100"
                      value={item.restock_price}
                      onChange={(e) => updateItem(index, 'restock_price', parseFloat(e.target.value) || 0)}
                      className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      placeholder="0"
                      required
                    />
                  </div>
                </div>

                {/* Item Summary */}
                {item.size && (
                  <div className={`p-3 rounded-lg border ${
                    isSizeInInventory(item.size) 
                      ? 'bg-orange-50 border-orange-200' 
                      : 'bg-green-50 border-orange-200'
                  }`}>
                    <div className="flex justify-between items-center text-sm">
                      <span className={
                        isSizeInInventory(item.size) 
                          ? 'text-orange-500' 
                          : 'text-green-800'
                      }>
                        {isSizeInInventory(item.size) ? 'Adding to existing size' : 'Creating new size'}:
                      </span>
                      <span className={`font-semibold ${
                        isSizeInInventory(item.size) 
                          ? 'text-orange-500' 
                          : 'text-green-900'
                      }`}>
                        Size {item.size} • {item.quantity} items • {(item.quantity * item.restock_price).toLocaleString()} RWF
                      </span>
                    </div>
                  </div>
                )}
              </div>
            ))}

            {/* Add Item Button */}
            <button
              type="button"
              onClick={addItem}
              className="w-full flex items-center justify-center gap-2 py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-gray-400 hover:text-gray-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add Another Size
            </button>
          </div>

          {/* Summary */}
          {(totalItems > 0 || totalCost > 0) && (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6">
              <h4 className="font-medium mb-3">Restock Summary</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Total Items:</span>
                  <span className="font-medium">+{totalItems}</span>
                </div>
                <div className="flex justify-between">
                  <span>Total Cost:</span>
                  <span className="font-medium">{totalCost.toLocaleString()} RWF</span>
                </div>
                <div className="flex justify-between">
                  <span>New Sizes:</span>
                  <span className="font-medium text-green-600">
                    {items.filter(item => item.size && !isSizeInInventory(item.size)).length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Existing Sizes:</span>
                  <span className="font-medium text-orange-600">
                    {items.filter(item => item.size && isSizeInInventory(item.size)).length}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              disabled={isLoading}
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isLoading || !isFormValid}
              className="px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Processing...
                </>
              ) : (
                `Restock ${totalItems} Items`
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};