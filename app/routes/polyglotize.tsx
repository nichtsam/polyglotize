import {
	getCollectionProps,
	getFormProps,
	getTextareaProps,
	useForm,
} from '@conform-to/react'
import { getZodConstraint, parseWithZod } from '@conform-to/zod'
import { useFetcher } from '@remix-run/react'
import { AlertCircle, ArrowUp } from 'lucide-react'
import { Toggle } from '#app/components/toggle.tsx'
import {
	Alert,
	AlertDescription,
	AlertTitle,
} from '#app/components/ui/alert.tsx'
import { Button } from '#app/components/ui/button.tsx'
import { Card, CardContent } from '#app/components/ui/card.tsx'
import { ScrollArea } from '#app/components/ui/scroll-area.tsx'
import {
	langauges,
	type Language,
	languageConfigs,
} from '#app/utils/translate.ts'
import {
	schema as formSchema,
	type loader as translationsLoader,
} from './api_+/translations.tsx'

export default function Page() {
	const fetcher = useFetcher<typeof translationsLoader>()
	const data = fetcher.data?.data ?? undefined
	const [form, fields] = useForm({
		lastResult: fetcher.data?.result,
		constraint: getZodConstraint(formSchema),
		shouldRevalidate: 'onInput',
		onValidate: ({ formData }) =>
			parseWithZod(formData, { schema: formSchema }),
	})

	const allErrors = Object.values(form.allErrors).flat()

	return (
		<div className="mx-auto flex h-full flex-col">
			<ScrollArea className="flex-grow px-4 font-serif">
				{fetcher.state !== 'idle' && <p>Loading...</p>}
				{data && (
					<div className="flex flex-col gap-y-4 py-4">
						<div className="flex flex-col items-end">
							<Card>
								<CardContent className="text-lg md:text-2xl">
									{data.expression}
								</CardContent>
							</Card>
						</div>

						<div className="flex flex-col items-start">
							<Card>
								<CardContent>
									<article className="flex flex-col gap-y-4">
										{data.polyglotization.map(({ language, expressions }) => (
											<div key={language}>
												<h2 className="text-xl md:text-3xl">
													{languageConfigs[language].label}
												</h2>
												{expressions.map((expr) => (
													<p key={expr} className="text-lg md:text-2xl">
														{expr}
													</p>
												))}
											</div>
										))}
									</article>
								</CardContent>
							</Card>
						</div>
					</div>
				)}
			</ScrollArea>

			<div className="relative px-4">
				{allErrors.length > 0 && (
					<Alert
						variant="destructive"
						className="absolute inset-x-4 bottom-full mb-2 w-auto bg-background"
					>
						<AlertCircle className="h-4 w-4" />
						<AlertTitle>There is something wrong</AlertTitle>
						<AlertDescription>{allErrors[0]}</AlertDescription>
					</Alert>
				)}
				<fetcher.Form
					method="get"
					action="/api/translations"
					className="flex flex-col gap-y-4 pb-4"
					{...getFormProps(form)}
				>
					<div className="flex min-h-[60px] w-full flex-col gap-y-2 rounded-md border border-input bg-transparent p-3 text-base shadow md:text-sm">
						<textarea
							{...getTextareaProps(fields.expression)}
							placeholder="What do you want to express today?"
							aria-label="Expression to be translated"
							className="resize-none font-serif text-xl focus-visible:outline-none md:text-3xl"
							onInput={(e) => {
								const target = e.target as HTMLTextAreaElement
								target.style.height = 'auto'
								target.style.height = target.scrollHeight + 'px'
							}}
						/>
						<div className="flex justify-between">
							<fieldset>
								<legend className="sr-only">Languages</legend>

								<div className="flex flex-wrap gap-2">
									{getCollectionProps(fields.languages, {
										type: 'checkbox',
										options: langauges,
									}).map(({ key, ...props }) => (
										<Toggle key={key} {...props} variant="outline">
											{languageConfigs[props.value as Language].label}
										</Toggle>
									))}
								</div>
							</fieldset>
							<Button size="icon" type="submit" className="rounded-full">
								<ArrowUp />
							</Button>
						</div>
					</div>
				</fetcher.Form>
			</div>
		</div>
	)
}
