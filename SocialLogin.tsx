'use client';

import Image from 'next/image';
import Link from 'link';

interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
}

export default function ProductCard({ id, name, price, image, category }: ProductCardProps) {
  return (
    <Link 
      href={`/product/${id}`}
      className="group block"
      prefetch={true} // Prefetch on hover for instant navigation
    >
      <div className="relative aspect-square w-full overflow-hidden rounded-lg bg-gray-100">
        {/* Next.js Image component with optimization */}
        <Image
          src={image}
          alt={name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover object-center group-hover:scale-105 transition-transform duration-300"
          loading="lazy" // Lazy load below-the-fold images
          placeholder="blur"
          blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAb/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWEREiMxUf/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
        />
      </div>

      <div className="mt-4 space-y-1">
        <p className="text-sm text-gray-500">{category}</p>
        <h3 className="text-base font-medium text-gray-900 group-hover:text-gray-700">
          {name}
        </h3>
        <p className="text-base font-semibold text-gray-900">
          ${price.toFixed(2)}
        </p>
      </div>
    </Link>
  );
}
