import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { object, string, TypeOf } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const authLoginValidator = object({
  email: string().email("Not a valid email").nonempty({
    message: "Email is required",
  }),
  password: string().nonempty({ message: "Password is required" }),
}).strict();

const authRegisterValidator = object({
  name: string().nonempty({
    message: "Name is required",
  }),
  password: string()
    .nonempty({ message: "Password is required" })
    .min(6, "Too short should be 6 chars minimum"),
  passwordConfirm: string().nonempty({
    message: "Password Confirm is required",
  }),
  email: string().email("Not a valid email").nonempty({
    message: "Email is required",
  }),
})
  .strict()
  .refine((data) => data.password === data.passwordConfirm, {
    message: "Passwords do not match",
    path: ["passwordConfirm"],
  });

type AuthLoginValidator = TypeOf<typeof authLoginValidator>;
type AuthRegisterValidator = TypeOf<typeof authRegisterValidator>;

const Auth = () => {
  const navigate = useNavigate();
  const [login, setLogin] = useState(true);
  const [registerError, setRegisterError] = useState(null);
  const [loginError, setLoginError] = useState(null);

  const {
    register: registerFrom,
    formState: { errors: registerErrors },
    handleSubmit: handleSubmitRegister,
  } = useForm<AuthRegisterValidator>({
    resolver: zodResolver(authRegisterValidator),
  });

  const {
    register: loginFrom,
    formState: { errors: loginErrors },
    handleSubmit: handleSubmitLogin,
  } = useForm<AuthLoginValidator>({
    resolver: zodResolver(authLoginValidator),
  });

  const onRegisterSubmit = async (values: AuthRegisterValidator) => {
    setRegisterError(null);
    try {
      console.log(values);

      await axios.post(
        `${process.env.REACT_APP_SERVER_ENDPOINT}/api/register`,
        values
      );
      navigate("/");
    } catch (error: any) {
      setRegisterError(error.message);
    }
  };

  const onLoginSubmit = async (values: AuthLoginValidator) => {
    setLoginError(null);
    try {
      console.log(values);

      await axios.post(
        `${process.env.REACT_APP_SERVER_ENDPOINT}/api/login`,
        values,
        { withCredentials: true }
      );
      navigate("/");
    } catch (error: any) {
      setLoginError(error.message);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        width: "100vw",
        height: "100vh",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div>
        <button onClick={() => setLogin(!login)}>Switch Mode</button>
        {login ? <h1>Mode Login</h1> : <h1>Mode Register</h1>}
        {login ? (
          <div>
            <form onSubmit={handleSubmitLogin(onLoginSubmit)}>
              <div>
                <label htmlFor="email">Email</label>
                <input
                  id="email"
                  type="email"
                  placeholder="oryan445@mgial.com"
                  {...loginFrom("email")}
                />
                <p>{(loginErrors as any) && loginErrors?.email?.message}</p>
              </div>
              <div>
                <label htmlFor="password">Password</label>
                <input
                  id="password"
                  type="password"
                  placeholder="******"
                  {...loginFrom("password")}
                />
                <p>{(loginErrors as any) && loginErrors?.password?.message}</p>
              </div>
              <button type="submit">Submit</button>
              <p>{loginError}</p>
            </form>
          </div>
        ) : (
          <div>
            <form onSubmit={handleSubmitRegister(onRegisterSubmit)}>
              <div>
                <label htmlFor="name">Name</label>
                <input
                  id="name"
                  type="name"
                  placeholder="name"
                  {...registerFrom("name")}
                />
                <p>
                  {(registerErrors as any) && registerErrors?.name?.message}
                </p>
              </div>
              <div>
                <label htmlFor="email">Email</label>
                <input
                  id="email"
                  type="email"
                  placeholder="oryan445@mgial.com"
                  {...registerFrom("email")}
                />
                <p>
                  {(registerErrors as any) && registerErrors?.email?.message}
                </p>
              </div>

              <div>
                <label htmlFor="password">Password</label>
                <input
                  id="password"
                  type="password"
                  placeholder="******"
                  {...registerFrom("password")}
                />
                <p>
                  {(registerErrors as any) && registerErrors?.password?.message}
                </p>
              </div>

              <div>
                <label htmlFor="passwordConfirm">password Confirm</label>
                <input
                  id="passwordConfirm"
                  type="password"
                  placeholder="******"
                  {...registerFrom("passwordConfirm")}
                />
                <p>
                  {(registerErrors as any) &&
                    registerErrors?.passwordConfirm?.message}
                </p>
              </div>
              <button type="submit">Submit</button>
              <p>{registerError}</p>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default Auth;
