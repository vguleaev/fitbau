import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

const LOCAL_STORAGE_KEY = 'fitbau_lang';
const LANG_RU = 'ru';
const LANG_EN = 'en';

export const LanguageToggle = () => {
  const { i18n } = useTranslation();

  useEffect(() => {
    setTimeout(() => {
      loadPreferredLanguage();
    });
  }, []);

  const loadPreferredLanguage = () => {
    const preferredLanguage = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (preferredLanguage) {
      i18n.changeLanguage(preferredLanguage);
    }
  };

  const onToggleClick = () => {
    const toggleLanguage = i18n.language === LANG_EN ? LANG_RU : LANG_EN;
    i18n.changeLanguage(toggleLanguage);
    savePreferredLanguage(toggleLanguage);
  };

  const savePreferredLanguage = (language: string) => {
    localStorage.setItem(LOCAL_STORAGE_KEY, language);
  };

  return (
    <div>
      <button className={`btn btn-primary text-white`} onClick={() => onToggleClick()}>
        {i18n.language === LANG_EN ? 'EN' : 'RU'}
      </button>
    </div>
  );
};
