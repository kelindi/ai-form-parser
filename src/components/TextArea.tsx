import { useEffect, useRef, useState } from "react";

import styles from "@system/TextArea.module.scss";
import { z } from "zod";

function TextArea(props: {
  label: string;
  value: string;
  onChange: (e: any) => void;
  schema: z.ZodObject<any>;
  parseddata: null | z.infer<typeof props.schema>;
}) {
  const textAreaRef = useRef<HTMLTextAreaElement | null>(null);

  function extractFieldsFromSchema(schema: z.ZodObject<any>): string {
    return formatLabels(Object.keys(schema.shape));
  }

  const resizeTextArea = () => {
    if (!textAreaRef.current) {
      return;
    }

    textAreaRef.current.style.height = "auto";
    textAreaRef.current.style.height = `${textAreaRef.current.scrollHeight}px`;
  };
    
    
  function formatLabels(labels: string[]): string {
    if (labels.length > 1) {
      const last = labels.pop();
      return `${labels.join(", ")} and ${last}`;
    }
    return labels.join();
  }

  useEffect(() => {
    resizeTextArea();

    window.addEventListener("resize", resizeTextArea);
    return () => {
      window.removeEventListener("resize", resizeTextArea);
    };
  }, []);

  const [missingFields, setMissingFields] = useState<string[]>([]);

  useEffect(() => {
    if (props.parseddata) {
      const missing = Object.keys(props.schema.shape).filter((key) => {
        const value = props.parseddata ? props.parseddata[key] : undefined;
        return value === null || value === undefined || value === "";
      });

      setMissingFields(missing);
    }
  }, [props.parseddata, props.schema]);



  return (
    <>
      <label className="block text-[12px] font-medium leading-[16px] text-gray-900 pb-2">
        Please provide: {extractFieldsFromSchema(props.schema)} {missingFields.length > 0 && <span className="text-red-500">*Please include {missingFields.join(", ")}</span>}
      </label>
      <textarea
        className="appearance-none box-border w-full rounded p-3 leading-6 transition-all duration-200 outline-none border border-gray-200 shadow-none focus:shadow-outline focus:outline-none bg-white text-black min-h-32"
        ref={textAreaRef}
        {...props}
        onChange={(e) => {
          resizeTextArea();
          if (props.onChange) {
            props.onChange(e);
          }
        }}
      />
    </>
  );
}

export default TextArea;
