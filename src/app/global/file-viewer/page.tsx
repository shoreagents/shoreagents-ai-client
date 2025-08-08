"use client"

import * as React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { IconX, IconPhoto, IconDeviceFloppy, IconArrowsMaximize, IconZoomIn, IconZoomOut, IconMaximize } from "@tabler/icons-react"

interface FileViewerPageProps {
  searchParams: {
    url?: string
    filename?: string
  }
}

export default function FileViewerPage({ searchParams }: FileViewerPageProps) {
  const [fileUrl, setFileUrl] = useState<string>("")
  const [fileName, setFileName] = useState<string>("")
  const [fileType, setFileType] = useState<string>("")
  const [loading, setLoading] = useState(true)
  const [zoom, setZoom] = useState(1)
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const [pan, setPan] = useState({ x: 0, y: 0 })
  const [imageDimensions, setImageDimensions] = useState({ width: 0, height: 0 })
  const [fileSize, setFileSize] = useState<string>("")

  useEffect(() => {
    // Get file URL and filename from search params
    const url = searchParams.url || ""
    const filename = searchParams.filename || "Unknown File"
    
    setFileUrl(url)
    setFileName(filename)
    
    // Determine file type
    const extension = filename.split('.').pop()?.toLowerCase() || ""
    setFileType(extension)
    setLoading(false)

    // Get file size
    if (url) {
      fetch(url, { method: 'HEAD' })
        .then(response => {
          const size = response.headers.get('content-length')
          if (size) {
            const bytes = parseInt(size)
            const kb = (bytes / 1024).toFixed(1)
            setFileSize(`${kb} KB`)
          }
        })
        .catch(() => {
          setFileSize("Unknown")
        })
    }
  }, [searchParams])

  const handleImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const img = e.currentTarget
    setImageDimensions({ width: img.naturalWidth, height: img.naturalHeight })
  }

  const handleCloseWindow = () => {
    if (typeof window !== 'undefined' && (window as any).electronAPI) {
      (window as any).electronAPI.closeCurrentWindow()
        .then((result: any) => {
          if (result.success) {
            console.log('File window closed successfully')
          } else {
            console.error('Failed to close file window:', result.error)
            // Fallback to window.close()
            window.close()
          }
        })
        .catch((error: any) => {
          console.error('Error closing file window:', error)
          // Fallback to window.close()
          window.close()
        })
    } else {
      window.close()
    }
  }

  const handleMaximizeWindow = () => {
    if (typeof window !== 'undefined' && (window as any).electronAPI) {
      (window as any).electronAPI.maximizeWindow()
        .then((result: any) => {
          if (result.success) {
            console.log('Window maximized successfully')
          } else {
            console.error('Failed to maximize window:', result.error)
          }
        })
        .catch((error: any) => {
          console.error('Error maximizing window:', error)
        })
    } else {
      // Fallback to browser fullscreen API
      if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(err => {
          console.error('Error attempting to enable fullscreen:', err)
        })
      } else {
        document.exitFullscreen().catch(err => {
          console.error('Error attempting to exit fullscreen:', err)
        })
      }
    }
  }

  const handleSaveFile = () => {
    if (fileUrl) {
      // Create a temporary anchor element to trigger download
      const link = document.createElement('a')
      link.href = fileUrl
      link.download = fileName
      link.target = '_blank'
      
      // Append to body, click, and remove
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }

  const isImage = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp', 'svg'].includes(fileType)
  const isPdf = fileType === 'pdf'
  const isVideo = ['mp4', 'webm', 'ogg', 'mov', 'avi'].includes(fileType)
  const isAudio = ['mp3', 'wav', 'ogg', 'aac'].includes(fileType)

  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev * 1.2, 5))
  }

  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev / 1.2, 0.1))
  }

  const handleResetZoom = () => {
    setZoom(1)
    setPan({ x: 0, y: 0 })
  }

  const handleFitToContainer = () => {
    if (imageDimensions.width > 0 && imageDimensions.height > 0) {
      const containerWidth = window.innerWidth
      const containerHeight = window.innerHeight - 120 // Account for header and footer
      
      const scaleX = containerWidth / imageDimensions.width
      const scaleY = containerHeight / imageDimensions.height
      const scale = Math.min(scaleX, scaleY, 1) // Don't zoom in beyond 100%
      
      setZoom(scale)
      setPan({ x: 0, y: 0 })
    }
  }

  const handleMouseDown = (e: React.MouseEvent) => {
    if (isImage) {
      e.preventDefault()
      e.stopPropagation()
      setIsDragging(true)
      setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y })
    }
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging && isImage) {
      e.preventDefault()
      e.stopPropagation()
      const newX = e.clientX - dragStart.x
      const newY = e.clientY - dragStart.y
      
      // Calculate boundaries based on zoom level
      const containerWidth = window.innerWidth
      const containerHeight = window.innerHeight - 60 // Account for header height
      
      // Get image dimensions (you might need to adjust this based on actual image size)
      const imageWidth = 800 // Approximate, you can make this dynamic
      const imageHeight = 600 // Approximate, you can make this dynamic
      
      const scaledWidth = imageWidth * zoom
      const scaledHeight = imageHeight * zoom
      
      // Calculate boundaries
      const maxX = Math.max(0, (scaledWidth - containerWidth) / 2)
      const minX = -Math.max(0, (scaledWidth - containerWidth) / 2)
      const maxY = Math.max(0, (scaledHeight - containerHeight) / 2)
      const minY = -Math.max(0, (scaledHeight - containerHeight) / 2)
      
      setPan({
        x: Math.max(minX, Math.min(maxX, newX)),
        y: Math.max(minY, Math.min(maxY, newY))
      })
    }
  }

  const handleMouseUp = (e: React.MouseEvent) => {
    if (isImage) {
      e.preventDefault()
      e.stopPropagation()
    }
    setIsDragging(false)
  }

  const handleWheel = (e: React.WheelEvent) => {
    if (isImage) {
      e.preventDefault()
      const delta = e.deltaY > 0 ? 0.9 : 1.1
      setZoom(prev => Math.min(Math.max(prev * delta, 0.1), 5))
    }
  }

  const handleSliderMouseDown = (e: React.MouseEvent) => {
    e.preventDefault()
    const slider = e.currentTarget as HTMLElement
    
    const handleSliderMouseMove = (e: MouseEvent) => {
      const rect = slider.getBoundingClientRect()
      const x = e.clientX - rect.left
      const percentage = Math.max(0, Math.min(1, x / rect.width))
      const newZoom = 0.1 + (percentage * (5 - 0.1))
      setZoom(newZoom)
    }

    const handleSliderMouseUp = () => {
      document.removeEventListener('mousemove', handleSliderMouseMove)
      document.removeEventListener('mouseup', handleSliderMouseUp)
    }

    document.addEventListener('mousemove', handleSliderMouseMove)
    document.addEventListener('mouseup', handleSliderMouseUp)
  }

  // Prevent default drag behavior on the entire document when dragging image
  useEffect(() => {
    const preventDefaultDrag = (e: DragEvent) => {
      if (isDragging) {
        e.preventDefault()
      }
    }

    document.addEventListener('dragstart', preventDefaultDrag)
    document.addEventListener('drag', preventDefaultDrag)

    return () => {
      document.removeEventListener('dragstart', preventDefaultDrag)
      document.removeEventListener('drag', preventDefaultDrag)
    }
  }, [isDragging])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading file...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-screen bg-background w-full">
      {/* Draggable Header */}
             <div 
         className="flex items-center justify-between p-3 border-b border-border bg-sidebar cursor-move"
         style={{ WebkitAppRegion: 'drag' }}
       >
         <div className="flex items-center gap-2 flex-1 min-w-0">
           <div className="min-w-0 flex-1">
             <h1 className="text-base font-semibold truncate">
               {fileName}
             </h1>
           </div>
         </div>
         <Button
           variant="ghost"
           size="sm"
           onClick={handleCloseWindow}
           className="h-6 w-6 p-0 rounded-sm opacity-70 hover:opacity-100 transition-opacity flex-shrink-0"
           style={{ WebkitAppRegion: 'no-drag' } as React.CSSProperties}
         >
           <IconX className="h-6 w-6" />
         </Button>
       </div>

             {/* File Content */}
       <div className="flex-1 overflow-hidden">
                  {isImage ? (
                        <div 
               className="h-full flex items-center justify-center bg-black overflow-hidden cursor-grab active:cursor-grabbing select-none"
               onMouseDown={handleMouseDown}
               onMouseMove={handleMouseMove}
               onMouseUp={handleMouseUp}
               onMouseLeave={handleMouseUp}
               onWheel={handleWheel}
               style={{ WebkitAppRegion: 'no-drag' } as React.CSSProperties}
               draggable={false}
             >
                           <img 
                src={fileUrl} 
                alt={fileName}
                className={`select-none ${!isDragging ? 'transition-transform duration-200' : ''}`}
                style={{
                  transform: `scale(${zoom}) translate(${pan.x / zoom}px, ${pan.y / zoom}px)`,
                  cursor: isDragging ? 'grabbing' : 'grab',
                  userSelect: 'none',
                  WebkitUserSelect: 'none',
                  MozUserSelect: 'none',
                  msUserSelect: 'none'
                }}
                draggable={false}
                onLoad={handleImageLoad}
               onError={(e) => {
                 const target = e.currentTarget as HTMLImageElement;
                 target.style.display = 'none';
                 const errorDiv = document.createElement('div');
                 errorDiv.className = 'text-center text-muted-foreground p-4';
                 errorDiv.innerHTML = `
                   <div class="mb-2">⚠️</div>
                   <p>Failed to load image</p>
                   <p class="text-sm">${fileName}</p>
                 `;
                 target.parentNode?.appendChild(errorDiv);
               }}
             />
           </div>
        ) : isPdf ? (
          <div className="h-full">
            <iframe 
              src={fileUrl}
              className="w-full h-full border-0"
              title={fileName}
            />
          </div>
        ) : isVideo ? (
          <div className="h-full flex items-center justify-center bg-black">
            <video 
              src={fileUrl}
              controls
              className="max-w-full max-h-full"
              onError={(e) => {
                const target = e.currentTarget as HTMLVideoElement;
                target.style.display = 'none';
                const errorDiv = document.createElement('div');
                errorDiv.className = 'text-center text-muted-foreground p-4';
                errorDiv.innerHTML = `
                  <div class="mb-2">⚠️</div>
                  <p>Failed to load video</p>
                  <p class="text-sm">${fileName}</p>
                `;
                target.parentNode?.appendChild(errorDiv);
              }}
            />
          </div>
        ) : isAudio ? (
          <div className="h-full flex items-center justify-center bg-muted/20">
            <div className="text-center p-6">
              <div className="mb-4 text-4xl">🎵</div>
              <audio 
                src={fileUrl}
                controls
                className="mb-4"
                onError={(e) => {
                  const target = e.currentTarget as HTMLAudioElement;
                  target.style.display = 'none';
                  const errorDiv = document.createElement('div');
                  errorDiv.className = 'text-center text-muted-foreground';
                  errorDiv.innerHTML = `
                    <div class="mb-2">⚠️</div>
                    <p>Failed to load audio</p>
                    <p class="text-sm">${fileName}</p>
                  `;
                  target.parentNode?.appendChild(errorDiv);
                }}
              />
              <p className="text-sm text-muted-foreground">{fileName}</p>
            </div>
          </div>
        ) : (
          <div className="h-full flex items-center justify-center bg-muted/20">
            <div className="text-center p-6">
              <div className="mb-4 text-4xl">📄</div>
              <p className="text-lg font-medium mb-2">{fileName}</p>
              <p className="text-sm text-muted-foreground mb-4">
                This file type cannot be previewed
              </p>
              <Button 
                onClick={() => window.open(fileUrl, '_blank')}
                variant="outline"
                size="sm"
              >
                Open in Browser
              </Button>
            </div>
          </div>
        )}
       </div>

       {/* Footer Bar */}
       <div className="flex items-center justify-between px-6 py-3 bg-sidebar border-t border-border">
         {/* Left side - File info and actions */}
         <div className="flex items-center gap-4">
           <IconPhoto className="h-4 w-4 text-muted-foreground" />
           {isImage && (
             <>
               <span className="text-xs text-muted-foreground">
                 {imageDimensions.width > 0 ? `${imageDimensions.width} x ${imageDimensions.height}` : 'Loading...'}
               </span>
               <IconDeviceFloppy 
                 className="h-4 w-4 text-muted-foreground hover:text-primary cursor-pointer transition-colors" 
                 onClick={handleSaveFile}
               />
               <span className="text-xs text-muted-foreground">{fileSize || 'Loading...'}</span>
             </>
           )}
         </div>

         {/* Right side - Zoom controls */}
         <div className="flex items-center gap-3">
           <div className="flex items-center gap-1">
             <IconMaximize 
               className="h-4 w-4 text-muted-foreground hover:text-primary cursor-pointer transition-colors" 
               onClick={handleFitToContainer}
             />
             <div className="flex items-center gap-1 bg-muted/50 rounded px-3 py-1.5">
               <span className="text-xs text-muted-foreground">{Math.round(zoom * 100)}%</span>
             </div>
           </div>
           <IconZoomOut 
             className="h-4 w-4 text-muted-foreground hover:text-primary cursor-pointer transition-colors" 
             onClick={handleZoomOut}
           />
           <div 
             className="w-20 h-1.5 bg-muted rounded-full relative cursor-pointer"
             onMouseDown={handleSliderMouseDown}
           >
             <div 
               className="absolute top-0 left-0 h-full bg-teal-500 rounded-full"
               style={{ width: `${(zoom - 0.1) / (5 - 0.1) * 100}%` }}
             ></div>
             <div 
               className="absolute top-1/2 left-0 w-3.5 h-3.5 bg-teal-500 rounded-full transform -translate-y-1/2 cursor-pointer hover:bg-teal-400 transition-colors"
               style={{ left: `${(zoom - 0.1) / (5 - 0.1) * 100}%` }}
             ></div>
           </div>
           <IconZoomIn 
             className="h-4 w-4 text-muted-foreground hover:text-primary cursor-pointer transition-colors" 
             onClick={handleZoomIn}
           />
           <div className="w-px h-4 bg-border mx-2"></div>
           <IconArrowsMaximize 
             className="h-4 w-4 text-muted-foreground hover:text-primary cursor-pointer transition-colors" 
             onClick={handleMaximizeWindow}
           />
         </div>
       </div>
     </div>
   )
} 