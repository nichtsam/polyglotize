import { LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { Language, translate } from "../utils/translate.server";

export async function loader({ request }: LoaderFunctionArgs) {
  const searchParams = new URL(request.url).searchParams;
  const sentence = searchParams.get("sentence");
  const targets = searchParams.getAll("targets") as Language[];
  let translation: { language: string; translations: Language[] }[] = [];
  if (sentence != null && sentence.length > 0 && targets.length > 0) {
    translation = await translate(sentence, targets);
  }
  return translation;
}

export default function Page() {
  const data = useLoaderData<typeof loader>();
  return (
    <div>
      <form method="get">
        <div>
          <input name="sentence" placeholder="Sentence" />
        </div>

        <div>
          <label htmlFor="targets">Target Languages:</label>
          <select name="targets" id="targets" multiple>
            <option value="chinese">中文</option>
            <option value="english">English</option>
            <option value="german">Deutsch</option>
            <option value="french">Français</option>
          </select>
        </div>

        <button type="submit">Submit</button>
      </form>

      {data.length > 0
        ? data.map((d) => (
            <div>
              <p>{d.language}</p>
              {d.translations.map((t) => (
                <p>{t}</p>
              ))}
            </div>
          ))
        : null}
    </div>
  );
}
