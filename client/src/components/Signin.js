import React from "react";
import axios from "axios";
import { Formik, Form, useField } from "formik";
import * as Yup from "yup";
import { Link, useHistory, useLocation } from "react-router-dom";
import { useAuth } from "../provider/AuthProvider";

const MyTextInput = ({ label, ...props }) => {
  const [field, meta] = useField(props);
  return (
    <div className={"px-3 mb-6 md:mb-0 w-full"}>
      <label
        htmlFor={props.id || props.name}
        className="block uppercase tracking-wide text-gray-darker dark:text-white text-xs font-bold mb-2"
      >
        {label}
      </label>
      <input
        className={`appearance-none block w-full bg-white dark:bg-gray-900 dark:text-gray-100 text-gray-darker border-none  rounded py-3 px-4 mb-3 ${
          meta.error ? "border-red-300" : "border-gray-darker"
        }`}
        {...field}
        {...props}
      />
      {meta.touched && meta.error ? (
        <div className="block uppercase text-xs text-red-400">{meta.error}</div>
      ) : null}
    </div>
  );
};

const Signin = () => {
  let history = useHistory();
  let location = useLocation();

  const auth = useAuth();

  let { from } = location.state || { from: { pathname: "/" } };

  return (
    <div className="flex justify-center my-10">
      <div className="dark:bg-gray-800 bg-gray-100 p-4 rounded-lg">
        <Formik
          className="px-8 pt-6 pb-8 mb-4 bg-white dark:bg-gray-800 rounded"
          initialValues={{
            email: "",
            password: "",
          }}
          validationSchema={Yup.object({
            email: Yup.string()
              .email("Invalid email address")
              .required("Required"),
            password: Yup.string()
              .label("Password")
              .required("Required")
              .min(8, "Seems a bit short...")
              .max(20, "We prefer insecure system, try a shorter password."),
          })}
          onSubmit={(values, { setSubmitting }) => {
            // setTimeout(() => {
            //   alert(JSON.stringify(values, null, 2));
            //   setSubmitting(false);
            // }, 400);
            axios
              .post("http://localhost:8080/auth/login", values)
              .then((res) => {
                console.log(res.data);
                auth.login(res.data);
                history.replace(from);
              })
              .catch((err) => {
                console.log(err);
              });
            // axios
            //   .get("http://localhost:8080/testauth")
            //   .then((res) => {
            //     console.log(res);
            //   })
            //   .catch((err) => {
            //     console.log(err);
            //   });
          }}
        >
          <Form>
            <div className="-mx-3 md:flex mb-6">
              <MyTextInput
                label="Email"
                name="email"
                type="email"
                placeholder="example@domain.com"
              />
            </div>
            <div className="-mx-3 md:flex mb-6">
              <MyTextInput
                label="Password"
                name="password"
                type="password"
                placeholder="**********"
              />
            </div>
            <div className="mb-6 text-center">
              <button
                className="w-full px-4 py-2 font-bold text-white bg-blue-500 rounded-full hover:bg-blue-700 focus:outline-none focus:shadow-outline"
                type="submit"
              >
                Login
              </button>
            </div>
            <hr className="mb-6 border-t" />
            <div className="text-center">
              <Link
                className="inline-block text-sm text-blue-500 align-baseline hover:text-blue-800"
                to="/forgot-password"
              >
                Forgot Password?
              </Link>
            </div>
            <div className="text-center">
              <Link
                className="inline-block text-sm text-blue-500 align-baseline hover:text-blue-800"
                to="/register"
              >
                Dont have an account? Singup!
              </Link>
            </div>
          </Form>
        </Formik>
      </div>
    </div>
  );
};

export default Signin;
