import { SchemaType } from "@google/generative-ai";
import { genAI } from "./ai.server";

export enum Language {
  Chinese = "chinese",
  English = "english",
  German = "german",
  French = "french",
}

export async function translate(string: string, targets: Language[]) {
  const prompt =
    `Translate the following string into the specified languages: ${targets}. ` +
    "Generate exactly 3 translations for each language specified. " +
    `String: "${string}"`;

  const schema = {
    description: "An array of translations for the provided string.",
    type: SchemaType.ARRAY,
    items: {
      type: SchemaType.OBJECT,
      properties: {
        language: {
          nullable: false,
          type: SchemaType.STRING,
          description: "The name or code of the target language",
        },
        translations: {
          nullable: false,
          type: SchemaType.ARRAY,
          description:
            "An array of possible translations into the target language.",
          items: {
            type: SchemaType.STRING,
            description: "The translated string in the target language.",
          },
        },
      },
      required: ["language", "translations"],
    },
  };

  const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash-8b",
    generationConfig: {
      responseMimeType: "application/json",
      responseSchema: schema,
    },
  });

  const result = await model.generateContent(prompt);
  return JSON.parse(result.response.text());
}
