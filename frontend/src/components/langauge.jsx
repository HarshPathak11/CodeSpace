import React, { useState } from 'react';

const languages = [
  { code: 'javascript', name: 'JavaScript' },
  { code: 'java', name: 'Java' },
  { code: 'python', name: 'Python' },
  { code: 'cpp', name: 'C++' },
  { code: 'php', name: 'PHP' },
  
  
  // Add more languages as needed
];

export const LanguageDropdown = ({language,onSelect}) => {
  const [selectedLanguage, setSelectedLanguage] = useState(language); // Initial selected language

  const handleLanguageChange = (event) => {
    console.log(event.target.value)
    setSelectedLanguage(languages.find((lang) => lang.code === event.target.value));
  
    onSelect(event.target.value)
  };

  return (
    <div className="relative inline-block w-full">
      <select
        value={selectedLanguage.code}
        onChange={handleLanguageChange}
        className="text-white rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 bg-slate-800 my-1 font-medium px-1 py-2 text-base leading-5 hover:bg-gray-700 dark:hover:bg-gray-500"
      >
        {languages.map((language) => (
          <option key={language.code} value={language.code}>
            {language.code}
          </option>
        ))}
      </select>
    </div>
  );
};




