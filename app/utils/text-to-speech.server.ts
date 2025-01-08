import { ElevenLabsClient } from 'elevenlabs'

class TextToSpeech {
	private textToSpeech: ElevenLabsClient

	constructor(apiKey: string) {
		this.textToSpeech = new ElevenLabsClient({
			apiKey,
		})
	}

	async generate(
		text: string,
		language_code: string,
		voice: string = 'Sarah',
	): Promise<Buffer> {
		const audio = await this.textToSpeech.generate({
			voice,
			text,
			model_id: 'eleven_flash_v2_5',
			language_code: language_code.slice(0, 2),
		})

		const chunks: Buffer[] = []
		for await (const chunk of audio) {
			chunks.push(chunk)
		}

		const content = Buffer.concat(chunks)
		return content
	}
}

export const textToSpeech = new TextToSpeech(process.env.ELEVENLABS_API_KEY!)
