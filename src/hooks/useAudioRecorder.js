import { useState, useEffect, useRef, useCallback } from 'react'

export default function useAudioRecorder() {
    const [isRecording, setIsRecording] = useState(false)
    const [recordingTime, setRecordingTime] = useState(0)
    const [audioBlob, setAudioBlob] = useState(null)
    const [audioUrl, setAudioUrl] = useState(null)
    const [error, setError] = useState(null)

    const mediaRecorderRef = useRef(null)
    const audioChunksRef = useRef([])
    const timerRef = useRef(null)

    const startRecording = useCallback(async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true })

            mediaRecorderRef.current = new MediaRecorder(stream)
            audioChunksRef.current = []

            mediaRecorderRef.current.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    audioChunksRef.current.push(event.data)
                }
            }

            mediaRecorderRef.current.onstop = () => {
                const blob = new Blob(audioChunksRef.current, { type: 'audio/webm' })
                setAudioBlob(blob)
                setAudioUrl(URL.createObjectURL(blob))

                // Stop all tracks
                stream.getTracks().forEach(track => track.stop())
            }

            mediaRecorderRef.current.start()
            setIsRecording(true)
            setRecordingTime(0)
            setError(null)

            // Start timer
            timerRef.current = setInterval(() => {
                setRecordingTime(prev => prev + 1)
            }, 1000)

        } catch (err) {
            setError('Microphone access denied. Please allow microphone access.')
            console.error('Error accessing microphone:', err)
        }
    }, [])

    const stopRecording = useCallback(() => {
        if (mediaRecorderRef.current && isRecording) {
            mediaRecorderRef.current.stop()
            setIsRecording(false)

            if (timerRef.current) {
                clearInterval(timerRef.current)
            }
        }
    }, [isRecording])

    const resetRecording = useCallback(() => {
        setAudioBlob(null)
        setAudioUrl(null)
        setRecordingTime(0)
        setError(null)
    }, [])

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (timerRef.current) {
                clearInterval(timerRef.current)
            }
            if (audioUrl) {
                URL.revokeObjectURL(audioUrl)
            }
        }
    }, [audioUrl])

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60)
        const secs = seconds % 60
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
    }

    return {
        isRecording,
        recordingTime,
        formattedTime: formatTime(recordingTime),
        audioBlob,
        audioUrl,
        error,
        startRecording,
        stopRecording,
        resetRecording
    }
}
