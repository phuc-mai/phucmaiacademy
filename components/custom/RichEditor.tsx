"use client";

import dynamic from "next/dynamic";
import { useMemo } from "react";

import "react-quill/dist/quill.snow.css";

interface EditorProps {
  placeholder: string;
  onChange: (value: string) => void;
  value?: string;
}

const RichEditor = ({ placeholder, onChange, value }: EditorProps) => {
  const ReactQuill = useMemo(
    () => dynamic(() => import("react-quill"), { ssr: false }),
    []
  );

  return (
    <ReactQuill
      placeholder={placeholder}
      theme="snow"
      value={value}
      onChange={onChange}
    />
  );
};

export default RichEditor;
