import { ShipWheelIcon } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import type { AxiosError } from "axios";
import { vaildationRegister } from "../validations/register.validation";
import ErrorsComponent from "../components/shared/ErrorsComponent";
import useSignup from "../hooks/useSignup";
import type { ISignDataInput } from "../interface";

export default function SignUpPage() {
  const [signupData, setSignupData] = useState<ISignDataInput>({
    fullName: "",
    email: "",
    password: "",
  });

  const { signUpMutation, error, isPending } = useSignup();

  const errorsValidation = vaildationRegister(signupData);

  const handleSignup = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    signUpMutation(signupData);
  };

  return (
    <div
      className="h-screen flex items-center justify-center p-4 sm:p-6 md:p-8"
      data-theme="forest"
    >
      <div className="border border-primary/25 flex flex-col lg:flex-row w-full max-w-5xl mx-auto bg-base-100 rounded-xl shadow-lg overflow-hidden">
        {/* Left Side */}
        <div className="w-full lg:w-1/2 p-4 sm:p-8 flex flex-col">
          <div className="mb-4 flex items-center justify-start gap-2">
            <ShipWheelIcon className="size-9 text-primary" />
            <span className="text-3xl font-bold font-mono bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
              StreamMoSalah
            </span>
          </div>
          {error && (
            <div className="alert alert-error mb-3">
              <span>
                {(error as AxiosError<Error>)?.response?.data?.message ||
                  "حدث خطأ غير متوقع"}
              </span>
            </div>
          )}
          <div className="w-full">
            <form onSubmit={handleSignup}>
              <div className="space-y-4">
                <div>
                  <h2 className="text-xl font-semibold">Create an Account</h2>
                  <p className="text-sm opacity-70">
                    Join Streamify and start your language learning adventure!
                  </p>
                </div>
                <div className="space-y-3">
                  <div className="form-control w-full">
                    <label htmlFor="label" className={`label`}>
                      <span className="label-text">Full Name</span>
                    </label>
                    <input
                      type="text"
                      placeholder="John Doe"
                      className={`input input-bordered w-full ${
                        errorsValidation.fullName && "border-red-800"
                      }`}
                      value={signupData.fullName}
                      name="fullName"
                      required
                      onChange={(e) =>
                        setSignupData({
                          ...signupData,
                          fullName: e.target.value,
                        })
                      }
                    />
                    {errorsValidation.fullName && (
                      <ErrorsComponent error={errorsValidation.fullName} />
                    )}
                  </div>
                  <div className="form-control w-full">
                    <label htmlFor="label" className="label">
                      <span className="label-text">Email</span>
                    </label>
                    <input
                      type="email"
                      placeholder="John@gmail"
                      className={`input input-bordered w-full ${
                        errorsValidation.fullName && "border-red-800"
                      }`}
                      value={signupData.email}
                      name="email"
                      required
                      onChange={(e) =>
                        setSignupData({
                          ...signupData,
                          email: e.target.value,
                        })
                      }
                    />
                    {errorsValidation.email && (
                      <ErrorsComponent error={errorsValidation.email} />
                    )}
                  </div>
                  <div className="form-control w-full">
                    <label htmlFor="label" className="label">
                      <span className="label-text">Password</span>
                    </label>
                    <input
                      type="password"
                      placeholder="*******"
                      className={`input input-bordered w-full ${
                        errorsValidation.password && "border-red-800"
                      }`}
                      value={signupData.password}
                      name="password"
                      required
                      onChange={(e) =>
                        setSignupData({
                          ...signupData,
                          password: e.target.value,
                        })
                      }
                    />
                    {errorsValidation.password && (
                      <ErrorsComponent error={errorsValidation.password} />
                    )}
                  </div>
                  <div className="form-control">
                    <label className="label cursor-pointer justify-start gap-2">
                      <input
                        type="checkbox"
                        className="checkbox checkbox-sm"
                        required
                      />
                      <span className="text-xs leading-tight">
                        I agree to the {` `}
                      </span>
                      <span className="text-primary hover:underline">
                        terms of service
                      </span>{" "}
                      and {` `}
                      <span className="text-primary hover:underline">
                        privacy policy
                      </span>
                    </label>
                  </div>
                </div>
                <button className="btn btn-primary w-full" type="submit">
                  {isPending ? (
                    <>
                      <span className="loading loading-spinner loading-xs">
                        Loading...
                      </span>
                    </>
                  ) : (
                    "Create Account"
                  )}
                </button>
                <div className="text-center mt-4">
                  <p className="text-sm">
                    Already have an account? {` `}
                    <Link
                      to={`/login`}
                      className="text-primary hover:underline"
                    >
                      Sign in
                    </Link>
                  </p>
                </div>
              </div>
            </form>
          </div>
        </div>
        {/* Right Side */}
        <div className="hidden lg:flex w-full lg:w-1/2 bg-primary/10 items-center justify-center">
          <div className="max-w-md p-8">
            {/* Illustration */}
            <div className="relative aspect-square max-w-sm mx-auto">
              <img
                src="/i.png"
                alt="Language connection illustration"
                className="w-full h-full"
              />
            </div>

            <div className="text-center space-y-3 mt-6">
              <h2 className="text-xl font-semibold">
                Connect with language partners worldwide
              </h2>
              <p className="opacity-70">
                Practice conversations, make friends, and improve your language
                skills together
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
