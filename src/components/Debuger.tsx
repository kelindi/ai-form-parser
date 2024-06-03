"use client";
import TextArea from "@components/TextArea";
import { useEffect, useState } from "react";
import { z } from "zod";

export default function Debugger(props: { data: any, schema: z.ZodObject<any> }) {
    const { data, schema } = props;
    const [valid, setValid] = useState<boolean>(false);

    useEffect(() => {
        if (props.data) {
          const missing = Object.keys(props.schema.shape).filter((key) => {
            const value = props.data ? props.data[key] : undefined;
            return value === null || value === undefined || value === "";
          });
    
          setValid(missing.length === 0);
        }
      }, [props.data, props.schema]);

 

  return (
    <div className="mt-4 w-full">
      <h1 className="block text-[12px] font-medium leading-[16px] text-gray-900 pb-2">
        Parsed Response:
      </h1>
      <pre className={`mt-1 bg-black text-white p-2 rounded min-h-32 overflow-auto ${valid && "border-green-500 border-2"}`}>
        <code>{JSON.stringify(data, null, 2)}</code>
      </pre>
    </div>
  );
}
