import { RouterProvider } from "react-router/dom"
import router from './router';
import { ThemeProvider } from 'antd-style'
import customToken from '@/theme'
import { useAppStyles } from './app.style';
function App() {
  const { styles } = useAppStyles();
  return (
      <div className={styles.container}>
        <ThemeProvider customToken={customToken}>
          <RouterProvider router={router} />
        </ThemeProvider>
      </div>
  )
}

export default App
