import React from 'react'
import { FormControl, FormItem, FormLabel, FormMessage } from './ui/form';
import { Input } from './ui/input';
import { Control, Controller, FieldValues, Path, useFormContext } from 'react-hook-form';

interface FormFieldProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  label: string;
  placeholder?: string;
  type?: "text" | "email" | "password" | "file"
};

const FormField = <T extends FieldValues>({control, name, label, placeholder, type="text"}: FormFieldProps<T>) => {

  const { formState, watch } = useFormContext<T>();
  const value = watch(name);

  // Only for password field
  let passwordMessage = null;
  if (type === "password") {
    if (formState.errors[name]) {
      passwordMessage = (
        <span className="text-yellow-600 text-xs block mt-1">
          {formState.errors[name]?.message as string}
        </span>
      );
    } else if (value && value.length >= 8) {
      passwordMessage = (
        <span className="text-green-700 text-xs block mt-1">
          Password length is matched!
        </span>
      );
    }
  }

  return (

    <Controller name={name} control={control} render={({ field }) => (
      <FormItem>
        <FormLabel className="label">{label}</FormLabel>
        <FormControl>
          <Input 
            className="input" 
            placeholder={placeholder} 
            type={type} 
            {...field} 
          />
        </FormControl>
        {passwordMessage}
        <FormMessage />
      </FormItem>
    )}
    />
  );
  
};

export default FormField
