"use client";

import React from "react";

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Form } from "@/components/ui/form";
// import {ScrollArea} from '@/components/ui/scroll-area';

import TextInput from "./text-input";

// type
import { FormType } from "@/types";

interface FormProps {
  formSchema: any;
  className?: string;
  defaultValues: any | null;
  buttonPosition: string;
  button: React.ReactNode;
  values: FormType[];
  page2?: any[];
  section?: number; // only in cases where the fields are more
  loading: boolean;
  onSubmit: (data: any) => Promise<void>;
  cRef?: any | null;
}
const FormContainer: React.FC<FormProps> = ({
  formSchema,
  defaultValues,
  buttonPosition,
  button,
  values,
  page2 = [],
  section = 1,
  loading,
  onSubmit,
  className = "",
  cRef,
}) => {
  type FormValues = z.infer<typeof formSchema>;

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  return (
    <Form {...form}>
      <form
        ref={cRef}
        className={className}
        onSubmit={form.handleSubmit(onSubmit)}
      >
        {buttonPosition === "top" && button}
        <div className={`${section === 1 ? "block" : "hidden"}`}>
          {values.map((item: FormType, index: number) => (
            <TextInput
              key={index}
              form={form}
              name={item.name}
              loading={loading}
              placeholder={item.placeholder}
              textarea={item.textarea}
              type={item.type}
              subtitle={item.subtitle}
              // editor={item.editor}
              // file={item.file}
            />
          ))}
        </div>
        <div className={`${section === 2 ? "block" : "hidden"}`}>
          {page2.map((item: FormType, index: number) => (
            <TextInput
              key={index}
              form={form}
              name={item.name}
              loading={loading}
              placeholder={item.placeholder}
              textarea={item.textarea}
              subtitle={item.subtitle}
              type={item.type}
              // editor={item.editor}
              // file={item.file}
            />
          ))}
        </div>
        {buttonPosition === "bottom" && button}
      </form>
    </Form>
  );
};

export default FormContainer;
