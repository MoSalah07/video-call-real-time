import type { JSX } from "react";
import { LANGUAGE_TO_FLAG, type Language } from "../constant";

export function getLanguageFlag(language: string): JSX.Element | null {
  if (!language) return null;
  const langLower = language.toLowerCase();

  if (langLower in LANGUAGE_TO_FLAG) {
    const countryCode = LANGUAGE_TO_FLAG[langLower as Language];

    return (
      <img
        src={`https://flagcdn.com/24x18/${countryCode}.png`}
        alt={`${langLower} flag`}
        className="h-3 mr-1 inline-block"
      />
    );
  }

  return null;
}
