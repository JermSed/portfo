"use client";

import { cn } from "@/lib/utils";
import { useId } from "react";

interface FieldProps {
  value: string;
  label: string;
  name: string;
  placeholder?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const Field = ({
  value,
  label,
  onChange,
  name,
  placeholder,
  ...props
}: FieldProps) => {
  const id = useId();

  return (
    <div className="flex flex-col gap-y-1">
      <label className="text-[14px] font-medium text-white/90" htmlFor={id}>
        {label}
      </label>
      <input
        type="text"
        name={name}
        id={id}
        placeholder={placeholder}
        required
        autoComplete="off"
        autoCorrect="off"
        className={cn(
          "w-full rounded-md border border-white/50 bg-black/25 p-3 text-[16px] font-normal text-white outline-none transition placeholder:text-white/60 focus:border-white/70 focus:bg-black/35 focus:placeholder:text-white/50"
        )}
        onChange={onChange}
        value={value}
        {...props}
      />
    </div>
  );
};

export default Field;
