import { createContext, useState, useContext } from 'react';

const LanguageContext = createContext();

export const useLanguage = () => useContext(LanguageContext);

export const LanguageProvider = ({ children }) => {
    const [language, setLanguage] = useState('English');

    const languages = ['English', 'Spanish', 'French', 'German', 'Japanese', 'Chinese'];

    return (
        <LanguageContext.Provider value={{ language, setLanguage, languages }}>
            {children}
        </LanguageContext.Provider>
    );
};

export default LanguageContext;
