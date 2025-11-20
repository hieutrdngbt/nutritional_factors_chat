import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

function HomePage() {
  const { t } = useTranslation();

  return (
    <div style={{ padding: '2rem' }}>
      <h1>{t('pages.home.title')}</h1>
      <p>{t('pages.home.description')}</p>
      <div style={{ marginTop: '2rem' }}>
        <Link to="/nutrition-chat">
          <button>{t('pages.home.button.get_started')}</button>
        </Link>
      </div>
    </div>
  );
}

export default HomePage;
