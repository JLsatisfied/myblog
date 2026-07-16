import { useMemo } from 'react';
import { getCategoryById } from '@/data/categories';
import { getIcon } from '@/utils/icons';

interface CategoryTagProps {
  categoryId: string;
  showIcon?: boolean;
  className?: string;
}

export default function CategoryTag({
  categoryId,
  showIcon = true,
  className = '',
}: CategoryTagProps) {
  const cat = getCategoryById(categoryId);
  const IconComponent = useMemo(() => (cat ? getIcon(cat.icon) : undefined), [cat]);

  if (!cat) return null;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-medium border ${className}`}
      style={{
        backgroundColor: `${cat.color}12`,
        color: cat.color,
        borderColor: `${cat.color}40`,
        clipPath: 'polygon(3px 0, 100% 0, calc(100% - 3px) 100%, 0 100%)',
      }}
    >
      {showIcon && IconComponent && <IconComponent size={13} />}
      {cat.name}
    </span>
  );
}
