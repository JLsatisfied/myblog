import type React from 'react';
import { type FC } from 'react';
import * as Icons from 'lucide-react';

type AnyIcon = FC<{ size?: number; className?: string; color?: string }>;

const iconsMap: Record<string, AnyIcon> = {};

// Build a safe map of icon names to components
for (const [name, component] of Object.entries(Icons)) {
  if (typeof component === 'function' && name !== 'Icon') {
    iconsMap[name] = component as unknown as AnyIcon;
  }
}

export function getIcon(name: string, fallback?: AnyIcon): AnyIcon {
  return iconsMap[name] ?? fallback ?? Icons.FileText as unknown as AnyIcon;
}

export { iconsMap };
