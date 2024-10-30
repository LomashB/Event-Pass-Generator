'use client'

import { useState, useRef, useEffect } from 'react'
import { X, Camera, Upload } from 'lucide-react'

interface RegisterPopupProps {
  onClose: () => void
  onRegister: (data: RegisterData) => void
}

interface RegisterData {
  name: string
  photo: string
}

export function RegisterPopup({ onClose, onRegister }: RegisterPopupProps) {
  const [step, setStep] = useState(1)
  const [showCamera, setShowCamera] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isCameraLoading, setIsCameraLoading] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const streamRef = useRef<MediaStream | null>(null)

  const [formData, setFormData] = useState<RegisterData>({
    name: '',
    photo: ''
  })

  useEffect(() => {
    return () => {
      if (streamRef.current) {
        stopCamera()
      }
    }
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prevData => ({ ...prevData, [name]: value }))
  }

  const startCamera = async () => {
    try {
      setIsCameraLoading(true)
      setError(null)
      setShowCamera(true) // Set this to true before accessing video element
      
      // Wait for the next render cycle to ensure video element exists
      await new Promise(resolve => setTimeout(resolve, 0))
      
      if (!videoRef.current) {
        throw new Error('Video element not found')
      }

      // Stop any existing stream first
      if (streamRef.current) {
        stopCamera()
      }

      console.log('Requesting camera access...')
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'user',
          width: { ideal: 1280 },
          height: { ideal: 720 }
        },
        audio: false
      })
      
      console.log('Camera access granted, setting up video stream...')
      
      // Store the stream reference
      streamRef.current = stream
      
      // Set the stream to video element
      videoRef.current.srcObject = stream
      
      // Wait for video to be ready
      await new Promise<void>((resolve) => {
        if (!videoRef.current) return
        
        videoRef.current.onloadedmetadata = () => {
          console.log('Video metadata loaded')
          if (!videoRef.current) return
          
          videoRef.current.play()
            .then(() => {
              console.log('Video playback started')
              setIsCameraLoading(false)
              resolve()
            })
            .catch(error => {
              console.error('Error playing video:', error)
              setError('Failed to start video stream')
              stopCamera()
            })
        }
      })
    } catch (err) {
      console.error('Camera setup error:', err)
      setError(
        err instanceof Error 
          ? err.message 
          : "Unable to access camera. Please ensure you've granted camera permissions."
      )
      setIsCameraLoading(false)
      stopCamera()
    }
  }

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => {
        track.stop()
      })
      streamRef.current = null
    }
    
    if (videoRef.current) {
      videoRef.current.srcObject = null
    }
    
    setShowCamera(false)
    setIsCameraLoading(false)
  }

  const capturePhoto = () => {
    if (!videoRef.current || !streamRef.current) {
      setError('Camera not ready')
      return
    }

    try {
      const video = videoRef.current
      const canvas = document.createElement('canvas')
      
      // Use the actual video dimensions
      canvas.width = video.videoWidth
      canvas.height = video.videoHeight

      const ctx = canvas.getContext('2d')
      if (!ctx) {
        throw new Error('Could not get canvas context')
      }

      // Flip horizontally if using front camera
      ctx.translate(canvas.width, 0)
      ctx.scale(-1, 1)
      
      ctx.drawImage(video, 0, 0)
      
      const photoData = canvas.toDataURL('image/jpeg', 0.8)
      setFormData(prevData => ({ ...prevData, photo: photoData }))
      stopCamera()
    } catch (err) {
      console.error('Photo capture error:', err)
      setError('Failed to capture photo. Please try again.')
    }
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError("Image size should be less than 5MB")
        return
      }

      const reader = new FileReader()
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, photo: reader.result as string }))
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (step === 1) {
      setStep(2)
    } else {
      if (!formData.photo) {
        setError("Please add a photo before submitting")
        return
      }
      onRegister(formData)
      onClose()
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-orange-600">Data for Photo</h2>
          <button 
            onClick={onClose}
            type="button" 
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <div className="mb-4 flex justify-between">
          <div className={`w-1/2 h-1 ${step === 1 ? 'bg-orange-500' : 'bg-gray-300'}`}></div>
          <div className={`w-1/2 h-1 ${step === 2 ? 'bg-orange-500' : 'bg-gray-300'}`}></div>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">{error}</div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {step === 1 ? (
            <>
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="mt-1 p-2 border border-gray-300 block w-full rounded-md shadow-sm focus:border-orange-500 focus:ring-orange-500"
                />
              </div>
            </>
          ) : (
            <div className="space-y-4">
              <div className="flex justify-center">
                {formData.photo ? (
                  <div className="relative w-64 h-64">
                    <img 
                      src={formData.photo} 
                      alt="User" 
                      className="w-64 h-64 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, photo: '' }))}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div className="relative w-64 h-64">
                    {showCamera ? (
                      <video
                        ref={videoRef}
                        autoPlay
                        playsInline
                        muted
                        className="w-64 h-64 object-cover rounded-lg transform -scale-x-100"
                      />
                    ) : (
                      <div className="w-64 h-64 bg-gray-200 rounded-lg flex items-center justify-center">
                        <Camera className="w-12 h-12 text-gray-400" />
                      </div>
                    )}
                  </div>
                )}
              </div>

              {showCamera ? (
                <div className="flex justify-center space-x-4">
                  <button
                    type="button"
                    onClick={capturePhoto}
                    className="bg-orange-500 text-white px-4 py-2 rounded-md hover:bg-orange-600 flex items-center gap-2"
                  >
                    <Camera className="w-5 h-5" />
                    Capture Photo
                  </button>
                  <button
                    type="button"
                    onClick={stopCamera}
                    className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
                  >
                    Cancel
                  </button>
                </div>
              ) : !formData.photo && (
                <div className="flex justify-center space-x-4">
                  <button
                    type="button"
                    onClick={startCamera}
                    disabled={isCameraLoading}
                    className={`bg-orange-500 text-white px-4 py-2 rounded-md hover:bg-orange-600 transition duration-300 flex items-center gap-2 ${
                      isCameraLoading ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                  >
                    <Camera className="w-5 h-5" />
                    {isCameraLoading ? 'Starting Camera...' : 'Take Photo'}
                  </button>
                  <label className="cursor-pointer bg-orange-500 text-white px-4 py-2 rounded-md hover:bg-orange-600 transition duration-300 flex items-center gap-2">
                    <Upload className="w-5 h-5" />
                    Upload Photo
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>
                </div>
              )}
            </div>
          )}

          <button
            type="submit"
            className="w-full px-4 py-2 bg-orange-500 text-white font-semibold rounded-lg shadow-md hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-opacity-75"
          >
            {step === 1 ? 'Next' : 'Submit Registration'}
          </button>
        </form>
      </div>
    </div>
  )
}