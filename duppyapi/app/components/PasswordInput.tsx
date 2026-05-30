import React, { useState } from "react";

type Props = React.InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
};

export const PasswordInput: React.FC<Props> = ({ label, ...rest }) => {
  const [show, setShow] = useState(false);
  return (
    <div className="space-y-1">
      {label && <label className="block text-sm font-medium">{label}</label>}
      <div className="relative">
        <input
          type={show ? "text" : "password"}
          {...rest}
          className="w-full border rounded px-2 py-1"
        /
        >
        <button
          type="button"
          onClick={() => setShow(!show)}
          className="absolute inset-y-0 right-0 px-2 text-sm"
        >
          {show ? "Hide" : "Show"}
        </button>
      </div>
    </div>
  );
};
