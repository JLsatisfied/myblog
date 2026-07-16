---
title: React 19 新特性完全指南 🚀
excerpt: React 19 带来了许多激动人心的新特性，包括 Actions、use() hook、Server Components 等。本文逐一介绍并附带示例。
category: tech
tags:
  - React
  - 前端
  - JavaScript
  - 教程
author: KAI
publishedAt: 2026-06-15
featured: true
---

# React 19 新特性完全指南 🚀

React 19 是一个重要的版本更新，带来了许多开发者期待已久的功能。让我们一起来看看有哪些值得关注的新特性。

## 1. Actions

React 19 引入了 **Actions** 的概念，让处理表单和异步操作变得更加简单：

```tsx
function UpdateName() {
  const [error, submitAction, isPending] = useActionState(
    async (previousState, formData) => {
      const name = formData.get('name');
      const error = await updateName(name);
      if (error) return error;
      return null;
    },
    null
  );

  return (
    <form action={submitAction}>
      <input name="name" />
      <button type="submit" disabled={isPending}>
        {isPending ? '更新中...' : '更新'}
      </button>
      {error && <p className="error">{error}</p>}
    </form>
  );
}
```

## 2. `use()` Hook

全新的 `use()` hook 可以在渲染中读取 Promise 和 Context：

```tsx
function Comments({ commentsPromise }) {
  // use() 会在 Promise resolve 之前暂停渲染
  const comments = use(commentsPromise);
  return comments.map(c => <Comment key={c.id} {...c} />);
}
```

## 3. `useOptimistic`

乐观更新变得超级简单：

```tsx
const [optimisticMessages, addOptimisticMessage] = useOptimistic(
  messages,
  (state, newMessage) => [...state, { text: newMessage, sending: true }]
);
```

## 4. Ref 作为普通 Props

不再需要 `forwardRef`！

```tsx
function MyInput({ ref, ...props }) {
  return <input ref={ref} {...props} />;
}
```

## 总结

React 19 的更新方向很明确：简化异步操作、提升开发体验。Actions 和 `use()` hook 是两个最值得关注的功能。建议尽早升级体验！
