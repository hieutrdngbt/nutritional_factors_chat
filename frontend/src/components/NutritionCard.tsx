import { useTranslation } from 'react-i18next';
import { NutritionData } from '../types/nutrition.types';
import './NutritionCard.css';

interface NutritionCardProps {
  nutritionData: NutritionData;
}

function NutritionCard({ nutritionData }: NutritionCardProps) {
  const { t } = useTranslation();

  const renderNutrientRow = (
    label: string,
    value: string | number | undefined,
    isBold = false,
    indent = 0,
  ) => {
    if (value === undefined) return null;

    return (
      <div className={`nutrient-row ${isBold ? 'bold' : ''} indent-${indent}`}>
        <span className="nutrient-label">{label}</span>
        <span className="nutrient-value">{value}</span>
      </div>
    );
  };

  return (
    <div className="nutrition-card">
      <div className="nutrition-header">
        <h2 className="nutrition-title">{t('nutrition_chat.nutrition_facts.title')}</h2>
      </div>

      <div className="nutrition-body">
        {renderNutrientRow(
          t('nutrition_chat.nutrition_facts.serving_size'),
          nutritionData.servingSize,
          true,
        )}

        {nutritionData.servingsPerContainer && (
          <div className="servings-per-container">
            {t('nutrition_chat.nutrition_facts.servings_per_container')}:{' '}
            {nutritionData.servingsPerContainer}
          </div>
        )}

        <div className="thick-divider"></div>

        <div className="calories-section">
          <div className="calories-row">
            <span className="calories-label">{t('nutrition_chat.nutrition_facts.calories')}</span>
            <span className="calories-value">{nutritionData.calories || 0}</span>
          </div>
        </div>

        <div className="medium-divider"></div>

        <div className="daily-value-header">
          <span>{t('nutrition_chat.nutrition_facts.daily_value')}</span>
        </div>

        <div className="thin-divider"></div>

        {renderNutrientRow(
          t('nutrition_chat.nutrition_facts.total_fat'),
          nutritionData.totalFat,
          true,
        )}
        {renderNutrientRow(
          t('nutrition_chat.nutrition_facts.saturated_fat'),
          nutritionData.saturatedFat,
          false,
          1,
        )}
        {renderNutrientRow(
          t('nutrition_chat.nutrition_facts.trans_fat'),
          nutritionData.transFat,
          false,
          1,
        )}

        <div className="thin-divider"></div>

        {renderNutrientRow(
          t('nutrition_chat.nutrition_facts.cholesterol'),
          nutritionData.cholesterol,
          true,
        )}

        <div className="thin-divider"></div>

        {renderNutrientRow(t('nutrition_chat.nutrition_facts.sodium'), nutritionData.sodium, true)}

        <div className="thin-divider"></div>

        {renderNutrientRow(
          t('nutrition_chat.nutrition_facts.total_carbohydrates'),
          nutritionData.totalCarbohydrates,
          true,
        )}
        {renderNutrientRow(
          t('nutrition_chat.nutrition_facts.dietary_fiber'),
          nutritionData.dietaryFiber,
          false,
          1,
        )}
        {renderNutrientRow(
          t('nutrition_chat.nutrition_facts.total_sugars'),
          nutritionData.totalSugars,
          false,
          1,
        )}
        {renderNutrientRow(
          t('nutrition_chat.nutrition_facts.added_sugars'),
          nutritionData.addedSugars,
          false,
          2,
        )}

        <div className="thin-divider"></div>

        {renderNutrientRow(t('nutrition_chat.nutrition_facts.protein'), nutritionData.protein, true)}

        <div className="thick-divider"></div>

        {renderNutrientRow(
          t('nutrition_chat.nutrition_facts.vitamin_d'),
          nutritionData.vitaminD,
        )}
        {renderNutrientRow(t('nutrition_chat.nutrition_facts.calcium'), nutritionData.calcium)}
        {renderNutrientRow(t('nutrition_chat.nutrition_facts.iron'), nutritionData.iron)}
        {renderNutrientRow(t('nutrition_chat.nutrition_facts.potassium'), nutritionData.potassium)}

        <div className="medium-divider"></div>

        <div className="daily-value-note">
          <p>{t('nutrition_chat.nutrition_facts.daily_value_note')}</p>
        </div>
      </div>
    </div>
  );
}

export default NutritionCard;
