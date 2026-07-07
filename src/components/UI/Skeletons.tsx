import React from 'react';
import { PackageOpen } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const ProductCardSkeleton: React.FC = () => {
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm animate-pulse">
      <div className="aspect-square bg-slate-200 dark:bg-slate-800 w-full" />
      <div className="p-5 space-y-3">
        <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-1/3" />
        <div className="h-5 bg-slate-200 dark:bg-slate-800 rounded w-3/4" />
        <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-1/2" />
        <div className="flex justify-between items-center pt-2">
          <div className="h-6 bg-slate-200 dark:bg-slate-800 rounded w-1/4" />
          <div className="h-9 bg-slate-200 dark:bg-slate-800 rounded-full w-1/3" />
        </div>
      </div>
    </div>
  );
};

export const ProductGridSkeleton: React.FC<{ count?: number }> = ({ count = 4 }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
};

interface EmptyStateProps {
  title: string;
  description: string;
  actionText?: string;
  onAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  actionText,
  onAction,
}) => {
  const { language } = useApp();
  const isRTL = language === 'ar';

  return (
    <div className="flex flex-col items-center justify-center text-center py-16 px-4">
      <div className="bg-slate-50 dark:bg-slate-900 p-6 rounded-full text-slate-400 dark:text-slate-600 mb-6">
        <PackageOpen className="w-12 h-12" />
      </div>
      <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-200 mb-2">
        {title}
      </h3>
      <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm mb-8 leading-relaxed">
        {description}
      </p>
      {actionText && onAction && (
        <button
          onClick={onAction}
          className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-full transition-all shadow-md hover:shadow-indigo-500/20"
        >
          {actionText}
        </button>
      )}
    </div>
  );
};
