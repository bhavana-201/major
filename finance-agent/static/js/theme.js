// Tailwind Configuration
tailwind.config = {
    darkMode: 'class',
    theme: {
        extend: {
            colors: {
                primary: '#667eea',
                secondary: '#764ba2',
            }
        }
    }
}

// Theme Toggle Logic
// Check for saved theme or default to system preference
const isDark = localStorage.getItem('theme') === 'dark' ||
    (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches);

if (isDark) {
    document.documentElement.classList.add('dark');
} else {
    document.documentElement.classList.remove('dark');
}

function toggleTheme() {
    const el = document.documentElement;
    const currentlyDark = el.classList.toggle('dark');
    localStorage.setItem('theme', currentlyDark ? 'dark' : 'light');
    console.log('Theme toggled. Is dark:', currentlyDark);
}
