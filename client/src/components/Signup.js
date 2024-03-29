import React from "react";
import axios from "axios";
import { Formik, Form, useField } from "formik";
import * as Yup from "yup";
import { Link, useHistory, useLocation } from "react-router-dom";
import { useAuth } from "../provider/AuthProvider";

const MyTextInput = ({ label, ...props }) => {
  const [field, meta] = useField(props);
  return (
    <div
      className={`px-3 mb-6 md:mb-0 ${
        field.name === "email" || "name" ? "md:w-full" : "md:w-1/2 "
      }`}
    >
      <label
        htmlFor={props.id || props.name}
        className="block uppercase tracking-wide text-grey-darker dark:text-gray-100 text-xs font-bold mb-2"
      >
        {label}
      </label>
      <input
        className={`appearance-none block w-full bg-white dark:bg-gray-900 dark:text-gray-100 text-grey-darker border-none  rounded py-3 px-4 mb-3 ${
          meta.error ? "border-red" : "border-grey"
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

const Signup = () => {
  const auth = useAuth();
  let history = useHistory();
  let location = useLocation();
  let { from } = location.state || { from: { pathname: "/" } };
  return (
    <div className="flex justify-center my-10">
      <div className="dark:bg-gray-800 dark:text-gray-100 bg-gray-100 p-4 rounded-lg">
        <Formik
          className="px-8 pt-6 pb-8 mb-4 bg-white rounded dark:bg-gray-800"
          initialValues={{
            name: "",
            email: "",
            password: "",
            confirmPassword: "",
          }}
          validationSchema={Yup.object({
            name: Yup.string()
              .max(35, "Must be 35 characters or less")
              .required("Required"),
            email: Yup.string()
              .email("Invalid email address")
              .required("Required"),
            password: Yup.string()
              .label("Password")
              .required("Required")
              .min(8, "Seems a bit short...")
              .max(20, "We prefer insecure system, try a shorter password."),
            confirmPassword: Yup.string()
              .label("Password")
              .required("Required")
              .test(
                "passwords-match",
                "Passwords must match",
                function (value) {
                  return this.parent.password === value;
                }
              ),
          })}
          onSubmit={async (values, { setSubmitting }) => {
            axios
              .post("http://localhost:8080/auth/register", values)
              .then((res) => {
                console.log(res.data);
                auth.login(res.data);
                history.replace(from);
              })
              .catch((err) => {
                console.log(err);
              });
          }}
        >
          <Form>
            <div className="-mx-3 md:flex mb-6">
              <MyTextInput
                label="Name"
                name="name"
                type="text"
                placeholder="John Doe"
              />
            </div>
            <div className="-mx-3 md:flex mb-6">
              <MyTextInput
                label="Email"
                name="email"
                type="email"
                placeholder="jane@formik.com"
              />
            </div>
            <div className="-mx-3 md:flex mb-6">
              <MyTextInput
                label="Password"
                name="password"
                type="password"
                placeholder="**********"
              />
              <MyTextInput
                label="Confirm Password"
                name="confirmPassword"
                type="password"
                placeholder="**********"
              />
            </div>
            <div className="mb-6 text-center">
              <button
                className="w-full px-4 py-2 font-bold text-white bg-blue-500 rounded-full hover:bg-blue-700 focus:outline-none focus:shadow-outline"
                type="submit"
              >
                Register Account
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
                to="/login"
              >
                Already have an account? Login!
              </Link>
            </div>
          </Form>
        </Formik>
      </div>
    </div>
  );
};

export default Signup;
