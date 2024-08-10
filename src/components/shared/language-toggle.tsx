import React from 'react';
import { useTranslation } from 'react-i18next';

export const LanguageToggle = () => {
  const { i18n } = useTranslation();

  const onToggleClick = () => {
    const toggleLanguage = i18n.language === 'en' ? 'ru' : 'en';
    i18n.changeLanguage(toggleLanguage);
  };

  return (
    <div>
      <button className={`btn btn-primary text-white`} onClick={() => onToggleClick()}>
        {i18n.language === 'en' ? 'EN' : 'RU'}
      </button>
    </div>
  );
};
