import useConfigReducer from 'hooks/useConfigReducer';
import React, { createContext } from 'react';

export type Themes = 'light' | 'dark';

export const ThemeContext = createContext<{
  theme: Themes;
  setTheme: React.Dispatch<React.SetStateAction<Themes>>;
}>({
  theme: 'light',
  setTheme: () => { }
});

export const ThemeProvider = (props: React.PropsWithChildren<{}>) => {
  const [theme, setTheme] = useConfigReducer('theme');

  return <ThemeContext.Provider value={{ theme, setTheme }}>{props.children}</ThemeContext.Provider>;
};
