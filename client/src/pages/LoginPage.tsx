import { useState } from "react";
import { ShipWheelIcon } from "lucide-react";
import type { AxiosError } from "axios";
import ErrorsComponent from "../components/shared/ErrorsComponent";
import { vaildationLogin } from "../validations/login.validation";
import { Link } from "react-router";
import useLogin from "../hooks/useLogin";

interface LoginInput {
  email: string;
  password: string;
}

export default function LoginPage() {
  const [loginData, setLoginData] = useState<LoginInput>({
    email: "",
    password: "",
  });

  const errorsValidation = vaildationLogin(loginData);

  const { loginMutation, error, isPending } = useLogin();

  const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isPending) return;
    loginMutation(loginData, {
      onSuccess: () => {
        setLoginData({ email: "", password: "" });
      },
    });
  };

  return (
    <div
      className="h-screen flex items-center justify-center p-4 sm:p-6 md:p-8"
      data-theme="forest"
    >
      <div className="border border-primary/25 flex flex-col lg:flex-row w-full max-w-5xl mx-auto bg-base-100 rounded-xl shadow-lg overflow-hidden">
        {/* Login Form */}
        <div className="w-full lg:w-1/2 p-4 sm:p-6 md:p-8 flex flex-col">
          {/* Logo */}
          <div className="mb-4 flex items-center justify-start gap-2">
            <ShipWheelIcon className="text-primary size-9" />
            <span className="text-3xl font-bold font-mono bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary tracking-wider">
              StreamMoSalah
            </span>
          </div>
          {/* Error Message */}
          {error && (
            <div className="alert alert-error mb-3">
              <span>
                {(error as AxiosError<Error>)?.response?.data?.message ||
                  "حدث خطأ غير متوقع"}
              </span>
            </div>
          )}

          <div className="w-full">
            <form onSubmit={handleLogin}>
              <div className="space-y-4">
                <div>
                  <h2 className="text-xl font-semibold">Welcome Back</h2>
                  <p className="text-sm opacity-70">
                    sign in to your account to continue your language journey
                  </p>
                </div>

                <div className="flex flex-col gap-2">
                  {/* Email */}
                  <div className="form-control w-full">
                    <label htmlFor="label" className="label">
                      <span className="label-text">Email</span>
                    </label>
                    <input
                      type="email"
                      placeholder="John@gmail"
                      className={`input input-bordered w-full ${
                        errorsValidation.email &&
                        "border-red-800 focus:border-red-800"
                      }`}
                      value={loginData.email}
                      name="email"
                      required
                      onChange={(e) =>
                        setLoginData({
                          ...loginData,
                          email: e.target.value,
                        })
                      }
                    />
                    {errorsValidation.email && (
                      <ErrorsComponent error={errorsValidation.email} />
                    )}
                  </div>
                  {/* Password */}
                  <div className="form-control w-full">
                    <label htmlFor="label" className="label">
                      <span className="label-text">Password</span>
                    </label>
                    <input
                      type="password"
                      placeholder="*******"
                      className={`input input-bordered w-full ${
                        errorsValidation.password &&
                        "border-red-800 focus:border-red-800"
                      }`}
                      value={loginData.password}
                      name="password"
                      required
                      onChange={(e) =>
                        setLoginData({
                          ...loginData,
                          password: e.target.value,
                        })
                      }
                    />
                    {errorsValidation.password && (
                      <ErrorsComponent error={errorsValidation.password} />
                    )}
                  </div>
                  <button className="btn btn-primary w-full" type="submit">
                    {isPending ? (
                      <>
                        <span className="loading loading-spinner loading-xs">
                          Signing in...
                        </span>
                      </>
                    ) : (
                      "Sign in"
                    )}
                  </button>
                  <div className="text-center mt-4">
                    <p className="text-sm">
                      don't have an account?{` `}
                      <Link
                        to={`/signup`}
                        className="text-primary hover:underline"
                      >
                        Create one
                      </Link>
                    </p>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>

        {/* IMAGE SECTION */}
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
