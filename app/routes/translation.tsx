export default function Page() {
	return (
		<form method="get" className="flex flex-col gap-y-4">
			<textarea
				name="expression"
				className="rounded border p-4"
				aria-label="Expression to be translated"
			/>

			<button className="rounded border p-1" type="submit">
				Teach me
			</button>
		</form>
	)
}
