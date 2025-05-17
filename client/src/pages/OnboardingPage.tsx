import { useState, type FormEvent } from "react";
import Loader from "../components/shared/Loader";
import { useAuth } from "../hooks/useAuth";
import type { IOnboardingDataInput } from "../interface";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { completeOnboarding } from "../lib/api";
import {
  CameraIcon,
  LoaderIcon,
  MapPinIcon,
  ShipWheelIcon,
  ShuffleIcon,
} from "lucide-react";
import { LANGUAGES } from "../constant";
import { AxiosError } from "axios";
import { validationOnboarding } from "../validations/onboarding.validation";
import ErrorsComponent from "../components/shared/ErrorsComponent";

export default function OnboardingPage() {
  const { authUser, isLoading } = useAuth();

  const [formState, setFormState] = useState<IOnboardingDataInput>({
    fullName: authUser?.fullName || "",
    bio: authUser?.bio || "",
    learningLanguage: authUser?.learningLanguage || "",
    nativeLanguage: authUser?.nativeLanguage || "",
    country: authUser?.country || "",
    profilePic: authUser?.profilePic || "",
  });

  const validation = validationOnboarding(formState);

  const queryClient = useQueryClient();

  const { mutate: onboardingMutation, isPending } = useMutation({
    mutationFn: completeOnboarding,
    onSuccess: () => {
      toast.success("Profile Onboarded completed successfully");
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
    },
    onError: (error: unknown) => {
      if (error instanceof AxiosError) {
        const message =
          error.response?.data?.message ||
          error.message ||
          "Something went wrong";
        toast.error(message);
      } else {
        toast.error("Unexpected error occurred");
        console.error(error);
      }
    },
  });

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isPending) return;
    onboardingMutation(formState);
  };

  const handleRandomAvatar = () => {
    const idx = Math.floor(Math.random() * 100) + 1;
    const randomAvatar = `https://avatar.iran.liara.run/public/${idx}.png`;
    setFormState((prev) => ({ ...prev, profilePic: randomAvatar }));
    toast.success(`Avatar Changed Successfully`);
  };

  if (isLoading) return <Loader />;

  return (
    <div className="min-h-screen bg-base-100 flex items-center justify-center p-4">
      <div className="card bg-base-200 w-full max-w-3xl shadow-xl">
        <div className="card-body p-6 sm:p-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-center mb-6">
            Complete Your Profile
          </h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* PROFILE PIC CONTAINER */}
            <div className="flex flex-col items-center justify-center space-y-4">
              {/* IMAGE PREVIEW */}
              <div className="size-32 rounded-full bg-base-300 overflow-hidden">
                {formState.profilePic ? (
                  <img
                    src={formState.profilePic}
                    alt="Profile Preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <CameraIcon className="size-12 text-base-content opacity-40" />
                  </div>
                )}
              </div>

              {/* Generate Random Avatar BTN */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleRandomAvatar}
                  className="btn btn-accent"
                >
                  <ShuffleIcon className="size-4 mr-2" />
                  Generate Random Avatar
                </button>
              </div>
            </div>

            {/* FULL NAME */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">Full Name</span>
              </label>
              <input
                type="text"
                name="fullName"
                value={formState.fullName}
                onChange={(e) =>
                  setFormState({ ...formState, fullName: e.target.value })
                }
                className={`input input-bordered w-full ${
                  validation.fullName && "border-red-800 focus:border-red-800"
                }`}
                placeholder="Your full name"
              />
              {validation.fullName && (
                <ErrorsComponent error={validation.fullName} />
              )}
            </div>

            {/* BIO */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">Bio</span>
              </label>
              <textarea
                name="bio"
                value={formState.bio}
                onChange={(e) =>
                  setFormState({ ...formState, bio: e.target.value })
                }
                className={`textarea textarea-bordered h-24 resize-none ${
                  validation.bio && "border-red-800 focus:border-red-800"
                }`}
                placeholder="Tell others about yourself and your language learning goals"
              />
              {validation.bio && <ErrorsComponent error={validation.bio} />}
            </div>

            {/* LANGUAGES */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* NATIVE LANGUAGE */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Native Language</span>
                </label>
                <select
                  name="nativeLanguage"
                  value={formState.nativeLanguage}
                  onChange={(e) =>
                    setFormState({
                      ...formState,
                      nativeLanguage: e.target.value,
                    })
                  }
                  className={`select select-bordered w-full ${
                    validation.nativeLanguage &&
                    "border-red-800 focus:border-red-800"
                  }`}
                >
                  <option value="">Select your native language</option>
                  {LANGUAGES.map((lang) => (
                    <option key={`native-${lang}`} value={lang.toLowerCase()}>
                      {lang}
                    </option>
                  ))}
                </select>
                {validation.nativeLanguage && (
                  <ErrorsComponent error={validation.nativeLanguage} />
                )}
              </div>

              {/* LEARNING LANGUAGE */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Learning Language</span>
                </label>
                <select
                  name="learningLanguage"
                  value={formState.learningLanguage}
                  onChange={(e) =>
                    setFormState({
                      ...formState,
                      learningLanguage: e.target.value,
                    })
                  }
                  className={`select select-bordered w-full ${
                    validation.learningLanguage &&
                    "border-red-800 focus:border-red-800"
                  }`}
                >
                  <option value="">Select language you're learning</option>
                  {LANGUAGES.map((lang) => (
                    <option key={`learning-${lang}`} value={lang.toLowerCase()}>
                      {lang}
                    </option>
                  ))}
                </select>
                {validation.learningLanguage && (
                  <ErrorsComponent error={validation.learningLanguage} />
                )}
              </div>
            </div>

            {/* LOCATION */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">Location</span>
              </label>
              <div className="relative">
                <MapPinIcon
                  className={`absolute top-1/2 transform ${
                    validation.country
                      ? "-translate-y-[22px]"
                      : "-translate-y-1/2"
                  } left-3 size-5 text-base-content opacity-70`}
                />
                <input
                  type="text"
                  name="location"
                  value={formState.country}
                  onChange={(e) =>
                    setFormState({ ...formState, country: e.target.value })
                  }
                  className={`input input-bordered w-full pl-10 ${
                    validation.country && "border-red-800 focus:border-red-800"
                  }`}
                  placeholder="City, Country"
                />
                {validation.country && (
                  <ErrorsComponent error={validation.country} />
                )}
              </div>
            </div>

            {/* SUBMIT BUTTON */}

            <button
              className="btn btn-primary w-full"
              disabled={isPending}
              type="submit"
            >
              {!isPending ? (
                <>
                  <ShipWheelIcon className="size-5 mr-2" />
                  Complete Onboarding
                </>
              ) : (
                <>
                  <LoaderIcon className="animate-spin size-5 mr-2" />
                  Onboarding...
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
