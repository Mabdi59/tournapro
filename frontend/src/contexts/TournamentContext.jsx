import { createContext, useContext, useState } from "react";

const TournamentContext = createContext(undefined);

export const TournamentProvider = ({ children }) => {
  const [currentTitle, setCurrentTitle] = useState("");

  return (
    <TournamentContext.Provider value={{ currentTitle, setCurrentTitle }}>
      {children}
    </TournamentContext.Provider>
  );
};

export const useTournamentContext = () => {
  const ctx = useContext(TournamentContext);
  if (!ctx) {
    throw new Error("useTournamentContext must be used inside TournamentProvider");
  }
  return ctx;
};
