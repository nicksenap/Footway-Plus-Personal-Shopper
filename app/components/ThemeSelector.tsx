'use client';

import { useTheme } from '../hooks/useTheme';

export default function ThemeSelector() {
  const { setTheme } = useTheme();

  return (
    <select 
      data-choose-theme 
      className="select select-bordered"
      onChange={(e) => setTheme(e.target.value)}
    >
      <option value="light">Light</option>
      <option value="dark">Dark</option>
      <option value="cupcake">Cupcake</option>
      <option value="synthwave">Synthwave</option>
      <option value="retro">Retro</option>
    </select>
  );
} 