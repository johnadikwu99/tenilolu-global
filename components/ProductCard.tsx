'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ShoppingCart } from 'react-icons/fa';
import { formatNaira } from '@/lib/utils';
import { useCartStore } from '@/store/cart';
import { showSuccess } from '@/components/Toast';
import { cn } from '@/lib/cn';

interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  category: string;
  stock: number;
  imageUrl?: string;
  featured?: boolean;
  className?: string;
}

export function ProductCard({
  id,
  name,
  price,
  category,
  stock,
  imageUrl,
  className,
}: ProductCardProps) {
  const { addItem } = useCartStore();
  const outOfStock = stock === 0;

  const handleAddToCart = () => {
    addItem({
      id,
      name,
      price,
      imageUrl,
    });
    showSuccess(`${name} added to cart`);
  };

  return (
    <div className={cn('bg-white rounded-lg border border-secondary-200 overflow-hidden hover:shadow-md transition-shadow', className)}>
      {/* Image Container */}
      <Link href={`/products/${id}`} className="block relative w-full h-48 bg-secondary-100 overflow-hidden">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={name}
            fill
            className="object-cover hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-secondary-400">
            <ShoppingCart size={32} />
          </div>
        )}
        {outOfStock && (
          <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
            <span className="text-white font-semibold">Out of Stock</span>
          </div>
        )}
      </Link>

      {/* Content */}
      <div className="p-4">
        <div className="mb-2">
          <Link href={`/products/${id}`} className="hover:text-primary-600 transition-colors">
            <h3 className="font-semibold text-secondary-900 text-sm line-clamp-2">{name}</h3>
          </Link>
        </div>

        <p className="text-xs text-secondary-500 mb-3">{category}</p>

        <div className="flex items-center justify-between mb-4">
          <span className="text-lg font-semibold text-primary-600">{formatNaira(price)}</span>
          {stock > 0 && stock <= 10 && (
            <span className="text-xs text-warning bg-yellow-50 px-2 py-1 rounded">Low stock</span>
          )}
        </div>

        <button
          onClick={handleAddToCart}
          disabled={outOfStock}
          className={cn(
            'w-full py-2 rounded text-sm font-medium transition-colors',
            outOfStock
              ? 'bg-secondary-200 text-secondary-400 cursor-not-allowed'
              : 'bg-primary-600 text-white hover:bg-primary-700'
          )}
        >
          {outOfStock ? 'Out of Stock' : 'Add to Cart'}
        </button>
      </div>
    </div>
  );
}
