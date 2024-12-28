import {
	type FieldMetadata,
	getFormProps,
	getSelectProps,
	useForm,
	useInputControl,
} from '@conform-to/react'
import { getZodConstraint, parseWithZod } from '@conform-to/zod'
import {
	type LoaderFunctionArgs,
	type ActionFunctionArgs,
	data,
	HeadersFunction,
	redirect,
} from '@remix-run/node'
import {
	Form,
	useActionData,
	useFetcher,
	useLoaderData,
} from '@remix-run/react'
import { Check, ChevronsUpDown } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { z } from 'zod'
import { ErrorList } from '#app/components/form.tsx'
import { Button } from '#app/components/ui/button.tsx'
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from '#app/components/ui/command.tsx'
import { Label } from '#app/components/ui/label.tsx'
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '#app/components/ui/popover.tsx'
import {
	SourceLangCode,
	sourceLangConfig,
	TargetLangCode,
	targetLangConfig,
} from '#app/utils/translation.ts'
import {
	getSettingsSession,
	settingsSessionStorage,
} from '#app/utils/translator.server.ts'
import { cn } from '#app/utils/ui.ts'

const schema = z.object({
	sourceLanguage: SourceLangCode.default('detect'),
	targetLanguages: z
		.array(TargetLangCode)
		.min(1, 'Target Languages must contain at least 1 language'),
})

export const loader = async ({ request }: LoaderFunctionArgs) => {
	const settingsSession = await getSettingsSession(request)
	const settings = settingsSession.data

	return {
		settings,
	}
}

export const action = async ({ request }: ActionFunctionArgs) => {
	const formData = await request.formData()
	const submission = parseWithZod(formData, { schema })
	if (submission.status !== 'success') {
		return data(
			{ result: submission.reply() },
			{ status: submission.status === 'error' ? 400 : 200 },
		)
	}

	const { sourceLanguage, targetLanguages } = submission.value
	const settingsSession = await getSettingsSession(request)
	settingsSession.set('sourceLanguage', sourceLanguage)
	settingsSession.set('targetLanguages', targetLanguages)

	return redirect('/translate', {
		headers: {
			'Set-Cookie': await settingsSessionStorage.commitSession(settingsSession),
		},
	})
}

export default function Setting() {
	const data = useLoaderData<typeof loader>()
	const actionData = useActionData<typeof action>()
	const [form, fields] = useForm({
		defaultValue: data.settings,
		lastResult: actionData?.result,
		constraint: getZodConstraint(schema),
		onValidate: ({ formData }) => parseWithZod(formData, { schema }),
	})

	console.log({
		data,
		actionData,
		formValue: form.value,
		dirty: form.dirty,
	})

	return (
		<div className="prose mx-auto flex w-full flex-grow flex-col p-4 dark:prose-invert">
			<h2>Translation Configuration</h2>

			<Form
				replace
				method="post"
				{...getFormProps(form)}
				className="not-prose flex w-full flex-grow flex-col gap-y-4"
			>
				<SourceLanguageField field={fields.sourceLanguage} />
				<TargetLanguagesField field={fields.targetLanguages} />

				<Button
					type="submit"
					className="mb-8 ml-auto mt-auto w-20"
					disabled={!form.dirty}
				>
					Save
				</Button>
			</Form>
		</div>
	)
}

function SourceLanguageField({
	field,
}: {
	field: FieldMetadata<z.infer<typeof schema>['sourceLanguage']>
}) {
	const [open, setOpen] = useState(false)
	const inputRef = useRef<HTMLInputElement>(null)
	const control = useInputControl(field)
	const value = control.value
	const labelId = `label-${field.id}`

	return (
		<div className="flex flex-col items-start gap-y-2">
			<Label id={labelId} htmlFor={field.id}>
				Source Language
			</Label>
			<select
				{...getSelectProps(field)}
				aria-hidden
				tabIndex={-1}
				className="sr-only"
				onFocus={() => {
					setOpen(true)
					inputRef.current?.focus()
				}}
			>
				{SourceLangCode.options.map((code) => (
					<option key={code} value={code} />
				))}
			</select>
			<ErrorList errorId={field.errorId} errors={field.errors} />
			<Popover open={open} onOpenChange={setOpen}>
				<PopoverTrigger asChild>
					<Button
						type="button"
						variant="outline"
						role="combobox"
						aria-labelledby={labelId}
						className={cn(
							'w-[200px] justify-between',
							!value && 'text-muted-foreground',
						)}
					>
						{value && value in sourceLangConfig
							? sourceLangConfig[value as keyof typeof sourceLangConfig].label
							: 'Choose language'}
						<ChevronsUpDown className="opacity-50" />
					</Button>
				</PopoverTrigger>
				<PopoverContent className="h-[200px] w-[200px] p-0">
					<Command defaultValue="detect">
						<CommandInput
							ref={inputRef}
							placeholder="Search a language"
							className="h-9"
						/>
						<CommandList>
							<CommandEmpty>No language found.</CommandEmpty>
							<CommandGroup>
								{SourceLangCode.options
									.sort((a, b) => {
										if (a === SourceLangCode.enum.detect) {
											return -1
										} else if (b === SourceLangCode.enum.detect) {
											return 1
										}
										const A = sourceLangConfig[a].label
										const B = sourceLangConfig[b].label
										return A > B ? 1 : -1
									})
									.map((code) => (
										<CommandItem
											value={sourceLangConfig[code].label}
											key={code}
											onSelect={() => {
												control.change(code)
												setOpen(false)
											}}
										>
											{sourceLangConfig[code].label}
											<Check
												className={cn(
													'ml-auto',
													value === code ? 'opacity-100' : 'opacity-0',
												)}
											/>
										</CommandItem>
									))}
							</CommandGroup>
						</CommandList>
					</Command>
				</PopoverContent>
			</Popover>
		</div>
	)
}

function TargetLanguagesField({
	field,
}: {
	field: FieldMetadata<z.infer<typeof schema>['targetLanguages']>
}) {
	const [open, setOpen] = useState(false)
	const inputRef = useRef<HTMLInputElement>(null)
	const control = useInputControl(field)
	const value =
		typeof control.value === 'string' ? [control.value] : control.value
	const labelId = `label-${field.id}`

	return (
		<div className="flex flex-col items-start gap-y-2">
			<Label id={labelId} htmlFor={field.id}>
				Target Languages
			</Label>
			<select
				{...getSelectProps(field)}
				aria-hidden
				tabIndex={-1}
				className="sr-only"
				onFocus={() => {
					setOpen(true)
					inputRef.current?.focus()
				}}
			>
				{TargetLangCode.options.map((code) => (
					<option key={code} value={code} />
				))}
			</select>
			<ErrorList
				className="mt-0"
				errorId={field.errorId}
				errors={field.errors}
			/>

			<Popover open={open} onOpenChange={setOpen}>
				<PopoverTrigger asChild>
					<Button
						type="button"
						variant="outline"
						role="combobox"
						aria-labelledby={labelId}
						className={cn(
							'h-auto min-h-12 w-full',
							!value && 'text-muted-foreground',
						)}
					>
						<span className="flex flex-wrap gap-2">
							{value && value.length > 0
								? value.map((code) => (
										<span
											key={code}
											className="rounded-md bg-primary px-2 py-1 text-sm text-primary-foreground"
										>
											{
												targetLangConfig[code as keyof typeof targetLangConfig]
													.label
											}
										</span>
									))
								: 'Add language'}
						</span>
						<ChevronsUpDown className="ml-auto opacity-50" />
					</Button>
				</PopoverTrigger>
				<PopoverContent className="h-[200px] w-[--radix-popover-trigger-width] p-0">
					<Command>
						<CommandInput ref={inputRef} placeholder="Search a language" />
						<CommandList>
							<CommandEmpty>No results found.</CommandEmpty>
							<CommandGroup>
								{TargetLangCode.options
									.sort((a, b) => {
										const A = targetLangConfig[a].label
										const B = targetLangConfig[b].label
										return A > B ? 1 : -1
									})
									.map((code) => (
										<CommandItem
											key={code}
											onSelect={() => {
												if (!value) {
													control.change([code])
													return
												}
												if (value.includes(code)) {
													control.change(value.filter((v) => v !== code))
												} else {
													control.change([...value, code])
												}
											}}
										>
											<span>{targetLangConfig[code].label}</span>
											<Check
												className={cn(
													'ml-auto',
													value?.includes(code) ? 'opacity-100' : 'opacity-0',
												)}
											/>
										</CommandItem>
									))}
							</CommandGroup>
						</CommandList>
					</Command>
				</PopoverContent>
			</Popover>
		</div>
	)
}
