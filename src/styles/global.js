import useTheme from 'hooks/useTheme';
import React from 'react';

const GlobalStyles = React.memo(() => {
  const { theme } = useTheme();

  return (
    <style>
      {`:root{
        --common-backgroundBodyColor: ${theme === 'dark' ? '#111111' : '#F4F4F4'};
        --common-backgroundScrollColor: ${theme === 'dark' ? 'rgba(216, 221, 227, 0.2)' : '#E0E0E0'};
        }`}
    </style>
  );
});

export default GlobalStyles;
