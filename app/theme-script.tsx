// Este script evita el parpadeo inicial al cargar la página
// Se ejecuta antes de que React se hidrate

export function ThemeScript() {
  const themeScript = `
    (function() {
      function getTheme() {
        const storedTheme = localStorage.getItem('theme')
        if (storedTheme) return storedTheme
        
        return window.matchMedia('(prefers-color-scheme: dark)').matches
          ? 'dark'
          : 'light'
      }
      
      const theme = getTheme()
      
      if (theme === 'dark') {
        document.documentElement.classList.add('dark')
      } else if (theme === 'light') {
        document.documentElement.classList.add('light')
      }
    })()
  `

  return <script dangerouslySetInnerHTML={{ __html: themeScript }} />
}

