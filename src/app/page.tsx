"use client";
import Button from "@/components/Button";
import Debugger from "@/components/Debuger";
import TextArea from "@components/TextArea";
import { useState } from "react";
import { z } from "zod";

export default function Home() {
  const [text, setText] = useState("");
  const [data, setData] = useState<z.infer<typeof schema> | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  //define the schema for the form
  const schema = z
    .object({
      name: z.string().min(1).nullish().describe("The name of the person"),
      company: z
        .string()
        .min(1)
        .nullish()
        .describe("The company of the person"),
      email: z.string().email().nullish().describe("The email of the person"),
      message: z
        .string()
        .min(1)
        .nullish()
        .describe("Any other information you would like to provide"),
    })
    .describe("contact information for an business inquiry");

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
    const response = await fetch("/form-parser", {
      method: "POST",
      body: text,
      });
      const data = await response.json();
      setData(data[0]);
    } catch (error) {
      setData({});
      setIsLoading(false);
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center text-black">
      <div className="w-full">
        <TextArea
          value={text}
          onChange={(e: any) => setText(e.target.value)}
          //pass the schema to the textarea
          schema={schema}
          parseddata={data}
        />
        <Button
          type="submit"
          className="mt-4 w-full py-2 rounded bg-black text-white"
          onClick={handleSubmit}
          loading={isLoading}
        >
          Submit
        </Button>
        <Debugger data={data} schema={schema} />

      </div>
    </main>
  );
}
