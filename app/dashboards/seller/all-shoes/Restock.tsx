import { useState } from "react";
import { Plus, Package, X, XCircle } from "lucide-react";
import { Shoe } from "./page";
import useRestock from "@/app/components/hooks/useRestock";

type ItemField = 'size' | 'quantity' | 'restock_price';

export const RestockModal = ({
    onClose,
    shoe
}: {
    isOpen: boolean;
    onClose: () => void;
    shoe: Shoe;
}) => {
    const [restockItems, setRestockItems] = useState<Array<{
        size: string;
        quantity: number;
        restock_price: number;
    }>>([{ size: '', quantity: 1, restock_price: 0 }]);

    const { methods, onSubmit, isLoading: isRestocking, handleSubmit, setValue } = useRestock();
    const { register, setValue: formSetValue } = methods;
    
    // Set the shoe_id in the form
    const shoeId = shoe.shoe_id;
    formSetValue('shoe_id', shoeId);

    const handleItemChange = (index: number, field: ItemField, value: string | number) => {
        const newItems = [...restockItems];
        const newValue = field === 'quantity' || field === 'restock_price' ? Number(value) : value;

        newItems[index] = {
            ...newItems[index],
            [field]: newValue
        };

        setRestockItems(newItems);

        // Update the form state for the restock hook
        setValue(`items_restocked.${index}.${field}` as const, newValue);
    };

    const addRestockItem = () => {
        const newItems = [...restockItems, { size: '', quantity: 1, restock_price: 0 }];
        setRestockItems(newItems);
        
        // Also update the form state
        setValue('items_restocked', newItems);
    };

    const removeRestockItem = (index: number) => {
        if (restockItems.length > 1) {
            const newItems = restockItems.filter((_, i) => i !== index);
            setRestockItems(newItems);
            
            // Also update the form state
            setValue('items_restocked', newItems);
        }
    };

    const handleFormSubmit = async (data: any) => {
        // Ensure we have the latest restockItems data
        const formData = {
            ...data,
            items_restocked: restockItems,
            shoe_id: shoeId
        };
        
        const result = await onSubmit(formData);
        if (result.success) {
            onClose();
        }
    };

    const availableSizes = shoe.size_inventory || [];
    const totalItems = restockItems.reduce((sum, item) => sum + (item.quantity || 0), 0);
    const totalCost = restockItems.reduce((sum, item) => sum + ((item.quantity || 0) * (item.restock_price || 0)), 0);

    return (
        <div className="fixed inset-0 bg-white/80 backdrop-blur-[2px] flex items-center justify-center z-50 p-4 text-xs">
            <form onSubmit={handleSubmit(handleFormSubmit)}
                className="bg-white rounded-xl border border-gray-200 p-6 w-full max-w-xl max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                        <span className="p-2 bg-green-500/10 text-green-600 rounded-full">
                            <Package strokeWidth={1.5} size={16} />
                        </span>
                        Restock Inventory
                    </h2>
                    <button
                        type="button"
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Shoe Information */}
                <div className="bg-gray-50 rounded-lg p-4 mb-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-600">Restocking inventory for:</p>
                            <h3 className="font-semibold text-gray-900 capitalize">{shoe.brand}</h3>
                        </div>
                        <span className="bg-green-100 text-green-600 px-3 py-1 rounded-full capitalize">
                            {shoe.brand}
                        </span>
                    </div>
                </div>

                <input 
                    type="hidden" 
                    {...register('shoe_id')} 
                    value={shoeId}
                />
                <input 
                    type="hidden" 
                    {...register('user_id')} 
                    // You'll need to get the user_id from your auth context or props
                    value={1} // Replace with actual user ID
                />

                {/* Restock Items Section */}
                <div className="space-y-4 mb-6">
                    <div className="flex items-center justify-between">
                        <h3 className="font-medium text-gray-900">Restock Items</h3>
                        <span className="text-gray-500">
                            {restockItems.length} size{restockItems.length !== 1 ? 's' : ''}
                        </span>
                    </div>

                    {restockItems.map((item, index) => (
                        <div key={index} className="p-4 border border-gray-200 rounded-lg space-y-3 bg-white">
                            <div className="flex justify-between items-center">
                                <h4 className="font-medium text-gray-900 flex items-center gap-2">
                                    <span className="w-6 h-6 bg-green-500 text-white text-xs rounded-full flex items-center justify-center">
                                        {index + 1}
                                    </span>
                                    Size {index + 1}
                                </h4>
                                {restockItems.length > 1 && (
                                    <button
                                        type="button"
                                        onClick={() => removeRestockItem(index)}
                                        className="text-red-500 hover:text-red-700 transition-colors"
                                        title="Remove size"
                                    >
                                        <XCircle size={18} />
                                    </button>
                                )}
                            </div>

                            {/* Size Selection */}
                            <div className="space-y-2">
                                <label className="font-medium text-gray-700">Size *</label>
                                <select
                                    value={item.size}
                                    onChange={(e) => handleItemChange(index, 'size', e.target.value)}
                                    className="w-full p-3 rounded-lg border border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-200 focus:outline-none transition-colors"
                                    required
                                >
                                    <option value="">Choose size...</option>
                                    {availableSizes.map((sizeItem) => (
                                        <option
                                            key={sizeItem.size}
                                            value={sizeItem.size}
                                            className="text-gray-700"
                                        >
                                            Size {sizeItem.size} ({sizeItem.quantity} currently in stock)
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Quantity and Cost */}
                            <div className="grid grid-cols-2 gap-3">
                                <div className="space-y-2">
                                    <label className="font-medium text-gray-700">Quantity *</label>
                                    <input
                                        type="number"
                                        min="1"
                                        value={item.quantity}
                                        onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                                        className="w-full p-3 rounded-lg border border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-200 focus:outline-none transition-colors"
                                        placeholder="0"
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="font-medium text-gray-700">Cost per Item (RWF) *</label>
                                    <input
                                        type="number"
                                        min="0"
                                        step="100"
                                        value={item.restock_price || ''}
                                        onChange={(e) => handleItemChange(index, 'restock_price', e.target.value)}
                                        className="w-full p-3 rounded-lg border border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-200 focus:outline-none transition-colors"
                                        placeholder="0"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Item Total */}
                            {item.quantity > 0 && item.restock_price > 0 && (
                                <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                                    <div className="flex justify-between items-center">
                                        <span className="text-green-800">Restock cost:</span>
                                        <span className="font-semibold text-green-900">
                                            {item.quantity} × {item.restock_price.toLocaleString()} RWF = {(item.quantity * item.restock_price).toLocaleString()} RWF
                                        </span>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}

                    <button
                        type="button"
                        onClick={addRestockItem}
                        className="w-full mt-2 flex items-center justify-center gap-2 text-green-600 hover:text-green-700 border-2 border-dashed border-green-200 hover:border-green-300 rounded-lg py-3 px-4 transition-colors"
                    >
                        <Plus size={16} />
                        Add Another Size
                    </button>
                </div>

                {/* Summary Card */}
                {(totalItems > 0 || totalCost > 0) && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                        <h4 className="font-medium text-green-900 mb-2">Restock Summary</h4>
                        <div className="space-y-1">
                            <div className="flex justify-between">
                                <span className="text-green-700">Total Items to Add:</span>
                                <span className="font-medium text-green-900">+{totalItems}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-green-700">Total Restock Cost:</span>
                                <span className="font-medium text-green-900">{totalCost.toLocaleString()} RWF</span>
                            </div>
                        </div>
                    </div>
                )}

                {/* Notes Section */}
                <div className="space-y-2 mb-6">
                    <label className="font-medium text-gray-700">Restock Notes (Optional)</label>
                    <textarea
                        {...register('notes')}
                        className="w-full p-3 rounded-lg border border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-200 focus:outline-none transition-colors resize-none"
                        placeholder="Add any notes about this restock (e.g., supplier, batch number, etc.)"
                        rows={3}
                    />
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-between gap-3 pt-4 border-t border-gray-200">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-6 py-3 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors font-medium"
                        disabled={isRestocking}
                    >
                        Cancel
                    </button>

                    <button
                        type="submit"
                        disabled={isRestocking || restockItems.length === 0 || restockItems.some(item => !item.size || item.quantity < 1 || item.restock_price < 0)}
                        className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer flex items-center gap-2"
                    >
                        {isRestocking ? (
                            <>
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                Restocking...
                            </>
                        ) : (
                            <>
                                Complete Restock (+{totalItems} items)
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
};