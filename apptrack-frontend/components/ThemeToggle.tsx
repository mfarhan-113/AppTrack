'use client';

import * as React from 'react';
import { Moon, Sun } from 'lucide-react';
import { Button } from './ui/button';

export function ThemeToggle() {
  const [theme, setTheme] = React.useState<'light' | 'dark'>('dark');
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    const savedTheme = (localStorage.getItem('theme') as 'light' | 'dark' | null) || 'dark';
    setTheme(savedTheme);
    document.documentElement.classList.toggle('dark', savedTheme === 'dark');
    document.documentElement.dataset.theme = savedTheme;
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
    document.documentElement.dataset.theme = newTheme;
  };

  const icon = theme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />;

  return (
    <Button variant="ghost" size="icon" onClick={toggleTheme} aria-label="Toggle theme">
      {mounted ? icon : <Sun className="h-5 w-5" />}
    </Button>
  );
}