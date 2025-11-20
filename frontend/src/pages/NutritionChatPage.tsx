import { useTranslation } from 'react-i18next';
import { useNutritionChatStore } from '../store/nutrition-chat-store';
import ImageUpload from '../components/ImageUpload';
import NutritionCard from '../components/NutritionCard';
import ChatInterface from '../components/ChatInterface';
import './NutritionChatPage.css';

function NutritionChatPage() {
  const { t } = useTranslation();
  const { session, error, clearError, clearSession } = useNutritionChatStore();

  return (
    <div className="nutrition-chat-page">
      <div className="page-header">
        <h1>{t('nutrition_chat.title')}</h1>
        <p>{t('nutrition_chat.description')}</p>
        {session && (
          <button className="clear-button" onClick={clearSession}>
            {t('nutrition_chat.actions.clear_session')}
          </button>
        )}
      </div>

      {error && (
        <div className="error-banner">
          <span>{error}</span>
          <button onClick={clearError}>&times;</button>
        </div>
      )}

      <div className="content-container">
        {!session ? (
          <div className="upload-section">
            <ImageUpload />
          </div>
        ) : (
          <div className="chat-section">
            <div className="left-panel">
              {session.nutritionData && (
                <NutritionCard nutritionData={session.nutritionData} />
              )}
            </div>
            <div className="right-panel">
              <ChatInterface />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default NutritionChatPage;
