import { getFormProps, getTextareaProps, useForm } from '@conform-to/react'
import { getZodConstraint, parseWithZod } from '@conform-to/zod'
import {
	type LoaderFunctionArgs,
	type ActionFunctionArgs,
	data,
} from '@remix-run/node'
import { Form, Link, useActionData, useLoaderData } from '@remix-run/react'
import {
	AlertCircle,
	ArrowUp,
	CircleStop,
	LoaderCircle,
	Settings2,
	Speech,
} from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { z } from 'zod'
import {
	Alert,
	AlertDescription,
	AlertTitle,
} from '#app/components/ui/alert.tsx'
import { Button } from '#app/components/ui/button.tsx'
import { Card, CardContent } from '#app/components/ui/card.tsx'
import { ScrollArea } from '#app/components/ui/scroll-area.tsx'
import { type ScreenSizeHandle } from '#app/utils/screen-size.ts'
import { targetLangConfig } from '#app/utils/translation.ts'
import { getSettingsSession, Translator } from '#app/utils/translator.server.ts'
import { useIsPending } from '#app/utils/ui.ts'

export const schema = z.object({
	expression: z
		.string({
			required_error: 'Expression is required for an polyglotization!',
		})
		.max(120, 'Expression is limited to 120 characters.'),
})

export const handle: ScreenSizeHandle = {
	screenSize: true,
}

export const loader = async ({ request }: LoaderFunctionArgs) => {
	const settings = await getSettingsSession(request)

	return {
		valid: !!settings.data.targetLanguages,
	}
}

export const action = async ({ request }: ActionFunctionArgs) => {
	const translationSession = await getSettingsSession(request)
	const sourceLanguage = translationSession.get('sourceLanguage')
	const targetLanguages = translationSession.get('targetLanguages')

	if (!targetLanguages) {
		throw new Response('targetLanguages is required', { status: 400 })
	}

	const formData = await request.formData()
	const submission = parseWithZod(formData, { schema })

	if (submission.status !== 'success') {
		return data(
			{ result: submission.reply(), data: null },
			{ status: submission.status === 'error' ? 400 : 200 },
		)
	}

	const { expression } = submission.value
	const translator = new Translator(process.env.DEEPL_KEY!)
	const translation = await translator.translate(
		expression,
		sourceLanguage,
		targetLanguages,
	)

	if (!translation) {
		return data({ result: submission.reply(), data: null }, { status: 400 })
	}

	return data({
		result: submission.reply({ resetForm: true }),
		data: {
			expression,
			translation,
		},
	})
}

export default function Page() {
	const data = useLoaderData<typeof loader>()
	const actionData = useActionData<typeof action>()
	const isPending = useIsPending()

	const [form, fields] = useForm({
		lastResult: actionData?.result,
		constraint: getZodConstraint(schema),
		onValidate: ({ formData }) => parseWithZod(formData, { schema }),
	})

	const allErrors = Object.values(form.allErrors).flat()

	return (
		<div className="mx-auto flex min-h-0 w-full max-w-[85ch] flex-grow flex-col font-serif">
			<ScrollArea className="flex-grow px-4">
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
											({ language, expression: { formal, informal } }) => (
												<div key={language}>
													<h2>{targetLangConfig[language].label}</h2>
													<div className="flex items-center gap-x-2">
														<SpeechButton lang={language} text={formal} />
														<p>{formal} (formal)</p>
													</div>
													<div className="flex items-center gap-x-2">
														<SpeechButton lang={language} text={informal} />
														<p>{informal} (informal)</p>
													</div>
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
				{!data.valid && (
					<Alert
						variant="destructive"
						className="absolute inset-x-4 bottom-full mb-2 w-auto bg-background"
					>
						<AlertCircle className="h-4 w-4" />
						<AlertTitle>Missing Settings</AlertTitle>
						<AlertDescription>
							You're missing something in your{' '}
							<Link
								className="text-foreground underline"
								to="/settings"
								prefetch="intent"
							>
								settings
							</Link>
							!
						</AlertDescription>
					</Alert>
				)}
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
							<div>
								<Button type="button" variant="ghost" size="icon" asChild>
									<Link to="/settings">
										<Settings2 />
									</Link>
								</Button>
							</div>

							<Button
								size="icon"
								type="submit"
								className="ml-auto shrink-0 rounded-full"
								disabled={isPending || !data.valid || !fields.expression.value}
							>
								{isPending ? (
									<LoaderCircle className="animate-spin" />
								) : (
									<ArrowUp />
								)}
							</Button>
						</div>
					</div>
				</Form>
			</div>
		</div>
	)
}

function SpeechButton({ text, lang }: { text: string; lang: string }) {
	const [, triggerRender] = useState({})
	const [enabled, setEnabled] = useState(false)
	const audioRef = useRef<HTMLAudioElement>(null)

	const play = () => {
		if (!audioRef.current) {
			return
		}

		void audioRef.current.play()

		triggerRender({})
	}
	const pause = () => {
		if (!audioRef.current) {
			return
		}

		audioRef.current.pause()
		audioRef.current.currentTime = 0

		triggerRender({})
	}

	useEffect(() => {
		setEnabled(false)
		audioRef.current?.load()
	}, [text])

	return (
		<button
			className="flex h-4 w-4 items-center justify-center hover:text-muted-foreground"
			onClick={() => {
				if (!enabled) {
					setEnabled(true)
				}

				if (!audioRef.current) {
					return
				}

				if (audioRef.current.paused) {
					play()
				} else {
					pause()
				}
			}}
		>
			{audioRef.current?.paused ? <Speech /> : <CircleStop />}
			<audio ref={audioRef} onPause={() => pause()}>
				{enabled && <source src={`/api/audio?lang=${lang}&text=${text}`} />}
			</audio>
		</button>
	)
}
