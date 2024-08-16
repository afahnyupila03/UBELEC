import React from "react";
import { Field } from "formik";

export default function FormField({
  id,
  name,
  value,
  onChange,
  onBlur,
  placeholder,
  as = "input",
  options = [],
}) {
  return (
    <div className="mb-4">
      {as === "select" ? (
        <Field
          as={as}
          id={id}
          name={name}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          className="block w-full px-4 py-2 text-base text-gray-700 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-500"
        >
          <option value="select">{placeholder}</option>
          {options.map((option, index) => (
            <option value={option} key={index}>
              {option}
            </option>
          ))}
        </Field>
      ) : (
        <Field
          id={id}
          name={name}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          placeholder={placeholder}
          className="block w-full px-4 py-2 text-base text-gray-700 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-500"
        />
      )}
    </div>
  );
}
