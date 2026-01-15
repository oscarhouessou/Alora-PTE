import Groq from 'groq-sdk'

// Lazy initialize Groq client only when needed
let groqClient = null

function getGroqClient() {
    if (!groqClient) {
        const apiKey = import.meta.env.VITE_GROQ_API_KEY
        if (!apiKey) {
            console.warn('VITE_GROQ_API_KEY not set. AI scoring will use mock data.')
            return null
        }
        groqClient = new Groq({
            apiKey,
            dangerouslyAllowBrowser: true
        })
    }
    return groqClient
}

export async function scoreReadAloud(originalText, transcribedText) {
    try {
        const groq = getGroqClient()
        if (!groq) {
            // Return mock data or throw an error if API key is missing
            console.warn('Groq client not initialized due to missing API key. Returning mock data for Read Aloud.')
            return {
                content: 3,
                pronunciation: 3,
                fluency: 3,
                overallScore: 3,
                feedback: "Mock feedback: API key not set. Please set VITE_GROQ_API_KEY.",
                missedWords: []
            }
        }

        const prompt = `You are a PTE (Pearson Test of English) scoring expert. Evaluate the following read aloud response.

Original Text:
"${originalText}"

Student's Response (transcribed):
"${transcribedText}"

Score the response on the following criteria (each out of 5):
1. Content: How accurately did the student read the text? Did they include all words?
2. Pronunciation: Based on the transcription, are there any mispronounced words?
3. Oral Fluency: Consider hesitations, repetitions, and false starts

Provide your response in the following JSON format only, no other text:
{
  "content": <score 0-5>,
  "pronunciation": <score 0-5>,
  "fluency": <score 0-5>,
  "overallScore": <calculated average>,
  "feedback": "<brief constructive feedback>",
  "missedWords": ["<list of any words that were missed or mispronounced>"]
}`

        const completion = await groq.chat.completions.create({
            messages: [
                {
                    role: 'user',
                    content: prompt
                }
            ],
            model: 'llama-3.3-70b-versatile',
            temperature: 0.3,
            max_tokens: 500
        })

        const responseText = completion.choices[0]?.message?.content || ''

        // Parse JSON from response
        const jsonMatch = responseText.match(/\{[\s\S]*\}/)
        if (jsonMatch) {
            return JSON.parse(jsonMatch[0])
        }

        throw new Error('Invalid response format')
    } catch (error) {
        console.error('Error scoring with Groq:', error)
        throw error
    }
}

export async function scoreRepeatSentence(originalText, transcribedText) {
    try {
        const groq = getGroqClient()
        if (!groq) {
            return {
                content: 2,
                pronunciation: 3,
                fluency: 3,
                overallScore: 2.7,
                feedback: "Mock feedback: API key not set.",
                accuracy: 80
            }
        }

        const prompt = `You are a PTE scoring expert. Evaluate this Repeat Sentence response.

Original Sentence:
"${originalText}"

Student's Response:
"${transcribedText}"

Score on:
1. Content (0-3): Word accuracy
2. Pronunciation (0-5): Pronunciation quality
3. Oral Fluency (0-5): Smoothness and rhythm

Respond in JSON format only:
{
  "content": <score>,
  "pronunciation": <score>,
  "fluency": <score>,
  "overallScore": <average>,
  "feedback": "<brief feedback>",
  "accuracy": <percentage of words correctly repeated>
}`

        const completion = await groq.chat.completions.create({
            messages: [{ role: 'user', content: prompt }],
            model: 'llama-3.3-70b-versatile',
            temperature: 0.3,
            max_tokens: 400
        })

        const responseText = completion.choices[0]?.message?.content || ''
        const jsonMatch = responseText.match(/\{[\s\S]*\}/)
        if (jsonMatch) {
            return JSON.parse(jsonMatch[0])
        }

        throw new Error('Invalid response format')
    } catch (error) {
        console.error('Error scoring repeat sentence:', error)
        throw error
    }
}

export async function transcribeAudio(audioBlob) {
    try {
        const apiKey = import.meta.env.VITE_GROQ_API_KEY
        if (!apiKey) {
            console.warn('API key not set. Returning mock transcription.')
            return 'This is a mock transcription because VITE_GROQ_API_KEY is not set.'
        }

        const formData = new FormData()
        formData.append('file', audioBlob, 'recording.webm')
        formData.append('model', 'whisper-large-v3')

        const response = await fetch('https://api.groq.com/openai/v1/audio/transcriptions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`
            },
            body: formData
        })

        if (!response.ok) {
            throw new Error('Transcription failed')
        }

        const data = await response.json()
        return data.text
    } catch (error) {
        console.error('Error transcribing audio:', error)
        throw error
    }
}

export const groqService = {
    scoreReadAloud,
    scoreRepeatSentence,
    transcribeAudio
}
