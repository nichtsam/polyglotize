import { Toggle } from '#app/components/toggle.tsx'
import { Button } from '#app/components/ui/button.tsx'
import { Textarea } from '#app/components/ui/textarea.tsx'
import { languages } from '#app/utils/translate.ts'

export const loader = async () => {
	return null
}

export default function Page() {
	return (
		<form method="get" className="flex flex-col gap-y-4">
			<Textarea
				name="expression"
				aria-label="Expression to be translated"
				className="resize-none font-serif text-xl md:text-3xl"
				placeholder="What are you trying to express?"
				autoResize
			/>

			<fieldset>
				<legend className="mb-2 text-lg md:text-xl">Languages</legend>

				<div className="flex flex-wrap gap-2">
					{languages.map((lang) => (
						<Toggle
							key={lang.value}
							name="tls"
							value={lang.value}
							variant="outline"
						>
							{lang.label}
						</Toggle>
					))}
				</div>
			</fieldset>

			<Button type="submit">Teach me</Button>
		</form>
	)
}
