import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import HomePage from './pages/HomePage';
import NutritionChatPage from './pages/NutritionChatPage';

function App() {
  const { t } = useTranslation();

  return (
    <BrowserRouter>
      <div className="app">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/nutrition-chat" element={<NutritionChatPage />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
