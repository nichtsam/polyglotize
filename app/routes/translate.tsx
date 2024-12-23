import {
	getCollectionProps,
	getFormProps,
	getTextareaProps,
	useForm,
} from '@conform-to/react'
import { getZodConstraint, parseWithZod } from '@conform-to/zod'
import { data, type LoaderFunctionArgs } from '@remix-run/node'
import { Form, useActionData } from '@remix-run/react'
import { AlertCircle, ArrowUp, LoaderCircle } from 'lucide-react'
import { z } from 'zod'
import { Toggle } from '#app/components/toggle.tsx'
import {
	Alert,
	AlertDescription,
	AlertTitle,
} from '#app/components/ui/alert.tsx'
import { Button } from '#app/components/ui/button.tsx'
import { Card, CardContent } from '#app/components/ui/card.tsx'
import { ScrollArea } from '#app/components/ui/scroll-area.tsx'
import { targetLangConfigs, targetLangs } from '#app/utils/translation.ts'
import { Translator } from '#app/utils/translator.server.ts'
import { useIsPending } from '#app/utils/ui.ts'

export const schema = z.object({
	expression: z
		.string({
			required_error: 'Expression is required for an polyglotization!',
		})
		.max(120, 'Expression is limited to 120 characters.'),
	languages: z
		.array(z.enum(targetLangs))
		.min(1, 'At least one of the target languages must be selected!'),
})

export const action = async ({ request }: LoaderFunctionArgs) => {
	const formData = await request.formData()
	const submission = parseWithZod(formData, { schema })

	if (submission.status !== 'success') {
		return data(
			{ result: submission.reply(), data: null },
			{ status: submission.status === 'error' ? 400 : 200 },
		)
	}

	const { expression, languages } = submission.value
	const translator = new Translator(process.env.DEEPL_KEY!)
	const translation = await translator.translate(expression, languages)

	if (!translation) {
		return data({ result: submission.reply(), data: null }, { status: 400 })
	}

	return data({
		result: submission.reply(),
		data: {
			expression,
			translation,
		},
	})
}

export default function Page() {
	const actionData = useActionData<typeof action>()
	const isPending = useIsPending()

	const [form, fields] = useForm({
		lastResult: actionData?.result,
		constraint: getZodConstraint(schema),
		shouldValidate: 'onInput',
		onValidate: ({ formData }) => parseWithZod(formData, { schema }),
	})

	const allErrors = Object.values(form.allErrors).flat()

	return (
		<div className="mx-auto flex h-full max-w-[85ch] flex-col font-serif">
			<ScrollArea className="flex-grow px-4">
				<fieldset form={form.id} className="p-2 pt-4">
					<legend className="sr-only">Target Languages</legend>
					<p className="text-center" aria-hidden="true">
						Target Languages
					</p>

					<div className="flex flex-wrap justify-center gap-2">
						{getCollectionProps(fields.languages, {
							type: 'checkbox',
							options: targetLangs,
						}).map(({ key, ...props }) => (
							<Toggle key={key} {...props} variant="outline">
								{
									targetLangConfigs[props.value as (typeof targetLangs)[number]]
										.label
								}
							</Toggle>
						))}
					</div>
				</fieldset>
				<hr className="my-2" />
				{isPending && (
					<div className="flex items-center justify-center">
						<LoaderCircle className="animate-spin" />
					</div>
				)}
				{actionData?.data && (
					<div className="flex flex-col gap-y-4 py-4">
						<div className="flex flex-col items-end">
							<Card>
								<CardContent className="px-4 py-2">
									{actionData.data.expression}
								</CardContent>
							</Card>
						</div>

						<div className="flex flex-col items-start">
							<Card className="min-w-[70%]">
								<CardContent className="px-4 py-2">
									<article className="flex flex-col gap-y-4">
										{actionData.data.translation.map(
											({ language, expressions }) => (
												<div key={language}>
													<h2>{targetLangConfigs[language].label}</h2>
													{expressions.map((expr) => (
														<p key={expr}>{expr}</p>
													))}
												</div>
											),
										)}
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
				<Form
					method="post"
					className="flex flex-col gap-y-4 pb-4"
					{...getFormProps(form)}
				>
					<div className="flex min-h-[60px] w-full flex-col gap-y-2 rounded-md border border-input bg-transparent p-3 shadow">
						<textarea
							{...getTextareaProps(fields.expression)}
							placeholder="What do you want to express today?"
							aria-label="Expression to be translated"
							className="resize-none focus-visible:outline-none"
							onInput={(e) => {
								const target = e.target as HTMLTextAreaElement
								target.style.height = 'auto'
								target.style.height = target.scrollHeight + 'px'
							}}
						/>
						<div className="flex flex-wrap justify-between gap-2">
							<Button
								size="icon"
								type="submit"
								className="ml-auto shrink-0 rounded-full"
								disabled={!form.valid}
							>
								<ArrowUp />
							</Button>
						</div>
					</div>
				</Form>
			</div>
		</div>
	)
}
