import React, { useEffect, useRef } from 'react';
import { WebAudio } from '../../utils/WebAudio';

// million-ignore
export const Oscilloscope: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const drawWaveform = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const canvasContext = canvas.getContext('2d');
    if (!canvasContext) return;

    const dataArray = WebAudio.getWaveform();
    const bufferLength = dataArray.length;
    const width = canvas.width;
    const height = canvas.height;

    canvasContext.clearRect(0, 0, width, height);
    canvasContext.lineWidth = 1;
    canvasContext.strokeStyle = 'rgb(0, 0, 0)';
    canvasContext.beginPath();

    const sliceWidth = (width * 1.0) / bufferLength;
    let x = 0;

    for (let i = 0; i < bufferLength; i++) {
      const v = dataArray[i] / 128.0;
      const y = (v * height) / 2;

      if (i === 0) {
        canvasContext.moveTo(x, y);
      } else {
        canvasContext.lineTo(x, y);
      }

      x += sliceWidth;
    }

    canvasContext.lineTo(canvas.width, canvas.height / 2);
    canvasContext.stroke();
    
    // requestAnimationFrame(drawWaveform); // Solicitud de siguiente cuadro de animación
  
  };

  useEffect(() => {
    if (canvasRef) {
      setInterval(() => {
        requestAnimationFrame(drawWaveform);
      }, 20);
    }
  }, [canvasRef]);

  return <canvas ref={canvasRef} width={800} height={200} />;
};
