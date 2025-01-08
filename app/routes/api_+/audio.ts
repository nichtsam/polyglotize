import { type LoaderFunctionArgs } from '@remix-run/node'
import { textToSpeech } from '#app/utils/text-to-speech.server.ts'

export async function loader({ request }: LoaderFunctionArgs) {
	const searchParams = new URL(request.url).searchParams
	const text = searchParams.get('text')
	const lang = searchParams.get('lang')
	if (!text) {
		throw new Response('text is required', { status: 400 })
	}
	if (!lang) {
		throw new Response('lang is required', { status: 400 })
	}

	const audio = await textToSpeech.generate(text, lang)
	if (!audio) {
		throw new Response('Failed to generate audio', {
			status: 500,
		})
	}

	return new Response(audio, {
		headers: {
			'Content-Type': 'audio/mpeg',
			'Content-Length': audio.length.toString(),
		},
	})
}
