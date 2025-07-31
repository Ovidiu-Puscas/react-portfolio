import React from 'react'
import SignatureCanvas from 'react-signature-canvas'

export default function DrawSignature() {
  return (
    <SignatureCanvas penColor='black'
      canvasProps={{width: 500, height: 200, className: 'sigCanvas border-2 border-gray-300 rounded-md mx-auto'}} />
  )
}