"use client"

import { useState } from "react"
import NumberFlow from '@number-flow/react'

export default function TestNumberFlow() {
  const [value, setValue] = useState(0)

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">NumberFlow Test</h1>
      
      <div className="mb-4">
        <button 
          onClick={() => setValue(prev => prev + 1)}
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          Increment
        </button>
      </div>
      
      <div className="text-4xl font-bold">
        <NumberFlow 
          value={value}
          transformTiming={{ duration: 500, easing: 'ease-out' }}
          spinTiming={{ duration: 500, easing: 'ease-out' }}
          opacityTiming={{ duration: 250, easing: 'ease-out' }}
          className="tabular-nums"
        />
      </div>
      
      <div className="mt-4 text-sm text-gray-600">
        Current value: {value}
      </div>
    </div>
  )
} 