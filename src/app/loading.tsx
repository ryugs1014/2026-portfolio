// app/loading.tsx
import React from 'react';

export default function Loading() {
  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'var(--color-bg-normal)',
        zIndex: 999998,
      }}
    />
  );
}
