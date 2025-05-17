import { validateFullName } from "./register.validation";

interface ErrorsOnboarding {
  fullName: string;
  bio: string;
  nativeLanguage: string;
  learningLanguage: string;
  country: string;
  profilePic: string;
}

export const validationOnboarding = (
  onboardingData: ErrorsOnboarding
): ErrorsOnboarding => {
  return {
    fullName: validateFullName(onboardingData.fullName),
    bio: onboardingData.bio.trim() === "" ? "Bio cannot be empty" : "",
    nativeLanguage:
      onboardingData.nativeLanguage.trim() === ""
        ? "Native language cannot be empty"
        : "",
    learningLanguage:
      onboardingData.learningLanguage.trim() === ""
        ? "Learning language cannot be empty"
        : "",
    country:
      onboardingData.country.trim() === "" ? "Country cannot be empty" : "",
    profilePic:
      onboardingData.profilePic.trim() === ""
        ? "Profile picture cannot be empty"
        : "",
  };
};
