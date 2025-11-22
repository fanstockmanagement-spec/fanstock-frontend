
import { useState } from "react";
import { Plus, ShoppingBag, X, XCircle } from "lucide-react";
import { Shoe } from "./page";
import { useRecordSales } from "@/app/components/hooks/useRecordSales";

type ItemField = 'size' | 'quantity' | 'sold_for';


export const RecordSalesModal = ({
    onClose,
    shoe
}: {
    isOpen: boolean;
    onClose: () => void;
    shoe: Shoe;
}) => {
    const [itemsSold, setItemsSold] = useState<Array<{
        size: string;
        quantity: number;
        sold_for: number;
    }>>([{ size: '', quantity: 1, sold_for: 0 }]); // Start with one empty item

    const { register, handleSubmit, onSubmit, setValue, isRecordingSales } = useRecordSales({
        shoe_id: shoe.shoe_id || '',
        items_sold: itemsSold,
    }, () => {
        onClose();
        window.location.reload();
    });

  const handleItemChange = (index: number, field: ItemField, value: string | number) => {
    const newItems = [...itemsSold];
    const newValue = field === 'quantity' || field === 'sold_for' ? Number(value) : value;

    newItems[index] = {
        ...newItems[index],
        [field]: newValue
    };

    setItemsSold(newItems);

    // Update the form state with proper type assertion
    setValue(`items_sold.${index}.${field}` as const, newValue);
};

    const addSizeItem = () => {
        setItemsSold([...itemsSold, { size: '', quantity: 1, sold_for: 0 }]);
    };

    const removeSizeItem = (index: number) => {
        if (itemsSold.length > 1) {
            const newItems = itemsSold.filter((_, i) => i !== index);
            setItemsSold(newItems);
        }
    };



    const availableSizes = shoe.size_inventory || [];
    const totalItems = itemsSold.reduce((sum, item) => sum + (item.quantity || 0), 0);
    const totalRevenue = itemsSold.reduce((sum, item) => sum + ((item.quantity || 0) * (item.sold_for || 0)), 0);

    return (
        <div className="fixed inset-0 bg-white/80 backdrop-blur-[2px] flex items-center justify-center z-50 p-4 text-xs">
            <form onSubmit={handleSubmit((data) => {
                const dataToSubmit = {
                    ...data,
                    items_sold: itemsSold.filter(item => item.size && item.quantity > 0 && item.sold_for > 0)
                };
                onSubmit(dataToSubmit);
            })}
                className="bg-white rounded-xl border border-gray-200 p-6 w-full max-w-xl max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                        <span className="p-2 bg-orange-500/10 text-orange-600 rounded-full">
                            <ShoppingBag strokeWidth={1.5} size={16} />
                        </span>
                        Record Sales
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
                            <p className=" text-gray-600">Recording sales for:</p>
                            <h3 className="font-semibold text-gray-900 capitalize">{shoe.brand}</h3>
                        </div>
                        <span className="bg-orange-100 text-orange-600  px-3 py-1 rounded-full capitalize">
                            {shoe.brand}
                        </span>
                    </div>
                </div>

                <input type="hidden" {...register('shoe_id')} />

                {/* Sales Items Section */}
                <div className="space-y-4 mb-6">
                    <div className="flex items-center justify-between">
                        <h3 className="font-medium text-gray-900">Items Sold</h3>
                        <span className=" text-gray-500">
                            {itemsSold.length} item{itemsSold.length !== 1 ? 's' : ''}
                        </span>
                    </div>

                    {itemsSold.map((item, index) => (
                        <div key={index} className="p-4 border border-gray-200 rounded-lg space-y-3 bg-white">
                            <div className="flex justify-between items-center">
                                <h4 className="font-medium text-gray-900 flex items-center gap-2">
                                    <span className="w-6 h-6 bg-orange-500 text-white text-xs rounded-full flex items-center justify-center">
                                        {index + 1}
                                    </span>
                                    Item {index + 1}
                                </h4>
                                {itemsSold.length > 1 && (
                                    <button
                                        type="button"
                                        onClick={() => removeSizeItem(index)}
                                        className="text-red-500 hover:text-red-700 transition-colors"
                                        title="Remove item"
                                    >
                                        <XCircle size={18} />
                                    </button>
                                )}
                            </div>

                            {/* Size Selection */}
                            <div className="space-y-2">
                                <label className=" font-medium text-gray-700">Size *</label>
                                <select
                                    value={item.size}
                                    onChange={(e) => handleItemChange(index, 'size', e.target.value)}
                                    className="w-full p-3 rounded-lg border border-gray-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 focus:outline-none transition-colors"
                                    required
                                >
                                    <option value="">Choose size...</option>
                                    {availableSizes.map((sizeItem) => (
                                        <option
                                            key={sizeItem.size}
                                            value={sizeItem.size}
                                            disabled={itemsSold.some((item, i) =>
                                                i !== index && item.size === sizeItem.size
                                            )}
                                            className={sizeItem.quantity === 0 ? 'text-red-500' : ''}
                                        >
                                            Size {sizeItem.size} {sizeItem.quantity === 0 ? '(Out of stock)' : `(${sizeItem.quantity} available)`}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Quantity and Price */}
                            <div className="grid grid-cols-2 gap-3">
                                <div className="space-y-2">
                                    <label className=" font-medium text-gray-700">Quantity *</label>
                                    <input
                                        type="number"
                                        value={item.quantity}
                                        onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                                        className="w-full p-3 rounded-lg border border-gray-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 focus:outline-none transition-colors"
                                        placeholder="0"
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className=" font-medium text-gray-700">Price (RWF) *</label>
                                    <input
                                        type="number"
                                        value={item.sold_for || ''}
                                        onChange={(e) => handleItemChange(index, 'sold_for', e.target.value)}
                                        className="w-full p-3 rounded-lg border border-gray-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 focus:outline-none transition-colors"
                                        placeholder="0"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Item Total */}
                            {item.quantity > 0 && item.sold_for > 0 && (
                                <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
                                    <div className="flex justify-between items-center ">
                                        <span className="text-orange-800">Item total:</span>
                                        <span className="font-semibold text-orange-900">
                                            {item.quantity} × {item.sold_for.toLocaleString()} RWF = {(item.quantity * item.sold_for).toLocaleString()} RWF
                                        </span>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}

                    <button
                        type="button"
                        onClick={addSizeItem}
                        className="w-full mt-2 flex items-center justify-center gap-2 text-orange-600 hover:text-orange-700 border-2 border-dashed border-orange-200 hover:border-orange-300 rounded-lg py-3 px-4 transition-colors"
                    >
                        <Plus size={16} />
                        Add Another Size
                    </button>
                </div>

                {/* Summary Card */}
                {(totalItems > 0 || totalRevenue > 0) && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                        <h4 className="font-medium text-blue-900 mb-2">Order Summary</h4>
                        <div className="space-y-1 ">
                            <div className="flex justify-between">
                                <span className="text-blue-700">Total Items:</span>
                                <span className="font-medium text-blue-900">{totalItems}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-blue-700">Total Revenue:</span>
                                <span className="font-medium text-blue-900">{totalRevenue.toLocaleString()} RWF</span>
                            </div>
                        </div>
                    </div>
                )}

                {/* Action Buttons */}
                <div className="flex items-center justify-between gap-3 pt-4 border-t border-gray-200">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-6 py-3 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors font-medium"
                        disabled={isRecordingSales}
                    >
                        Cancel
                    </button>

                    <button
                        type="submit"
                        disabled={isRecordingSales || itemsSold.length === 0 || itemsSold.every(item => !item.size || item.quantity < 1 || item.sold_for < 1)}
                        className="px-6 py-3 bg-orange-500 text-white rounded-lg hover:from-orange-600 hover:to-orange-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer flex items-center gap-2"
                    >
                        {isRecordingSales ? (
                            <>
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                Recording...
                            </>
                        ) : (
                            <>
                                Record Sales ({totalItems} items)
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
};