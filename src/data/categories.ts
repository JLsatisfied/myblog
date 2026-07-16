import type { BlogPost, Category } from '@/types/blog';

export const categories: Category[] = [
  {
    id: 'anime',
    name: '番剧解析',
    nameJa: 'アニメ',
    color: '#00f0ff',
    icon: 'Tv',
    description: '新番硬核分析、作画解构与世界观拆解',
  },
  {
    id: 'tech',
    name: '技术深渊',
    nameJa: 'テック',
    color: '#b400ff',
    icon: 'Code2',
    description: '底层架构、性能优化与前沿技术探索',
  },
  {
    id: 'life',
    name: '碎碎念',
    nameJa: '日常',
    color: '#00ff88',
    icon: 'Zap',
    description: '日常思考、工具分享与效率方法论',
  },
  {
    id: 'game',
    name: '游戏攻略',
    nameJa: 'ゲーム',
    color: '#ff6600',
    icon: 'Gamepad2',
    description: '硬核评测、速通分析与配装研究',
  },
];

export function getCategoryById(id: string): Category | undefined {
  return categories.find((c) => c.id === id);
}

export function getCategoryColor(categoryId: string): string {
  return getCategoryById(categoryId)?.color ?? '#00f0ff';
}

export function getFeaturedPosts(posts: BlogPost[]): BlogPost[] {
  return posts.filter((p) => p.featured).slice(0, 6);
}

export function getPostsByCategory(posts: BlogPost[], categoryId: string): BlogPost[] {
  return posts.filter((p) => p.category === categoryId);
}
