import React from 'react';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
  showActions?: boolean;
  onEdit?: (product: Product) => void;
  onDelete?: (productId: string) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  showActions = false,
  onEdit,
  onDelete,
}) => {
  return (
    <div className="card hover:shadow-lg transition-shadow duration-300">
      <div className="mb-4">
        <h3 className="text-xl font-semibold text-gray-800">{product.name}</h3>
        <div className="flex justify-between items-center mt-2">
          <span className="text-gray-600">{product.quantity}</span>
          <span className="font-bold text-lg text-green-600">₹{product.price.toLocaleString()}</span>
        </div>
      </div>
      
      <div className="border-t border-gray-200 pt-4">
        <h4 className="font-medium text-gray-700 mb-2">Description</h4>
        <p className="text-gray-600 mb-2">{product.descriptionEnglish}</p>
        
        <div className="mt-3 pt-3 border-t border-gray-100">
          <p className="text-gray-600 text-sm">{product.descriptionLocal}</p>
        </div>
      </div>
      
      {showActions && (
        <div className="mt-4 pt-4 border-t border-gray-200 flex justify-end space-x-2">
          <button
            onClick={() => onEdit && onEdit(product)}
            className="px-3 py-1 gradient-bg text-white rounded hover:opacity-90 transition-opacity"
          >
            Edit
          </button>
          <button
            onClick={() => onDelete && onDelete(product.id)}
            className="px-3 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors"
          >
            Delete
          </button>
        </div>
      )}
    </div>
  );
};

export default ProductCard; 