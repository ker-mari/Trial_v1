import React, { useRef, useState } from 'react';
import Webcam from 'react-webcam';
import { validateBase64ImageSync, compressBase64Image } from '../utils/imageValidation';

const CameraCapture = ({ onCapture, onClose }) => {
  const webcamRef = useRef(null);
  const [capturedImage, setCapturedImage] = useState(null);
  const [error, setError] = useState(null);
  const [isCompressing, setIsCompressing] = useState(false);

  const capture = () => {
    const imageSrc = webcamRef.current.getScreenshot();

    // Quick validation
    const validation = validateBase64ImageSync(imageSrc);
    if (!validation.valid) {
      setError(validation.error);
      return;
    }

    setCapturedImage(imageSrc);
    setError(null);
  };

  const handleSave = async () => {
    if (!capturedImage) return;

    setIsCompressing(true);
    setError(null);

    try {
      // Validate image
      const validation = validateBase64ImageSync(capturedImage);
      if (!validation.valid) {
        setError(validation.error);
        setIsCompressing(false);
        return;
      }

      // Check if compression is needed
      const base64Data = capturedImage.replace(/^data:image\/\w+;base64,/, '');
      const fileSize = (base64Data.length * 0.75) / (1024 * 1024);

      let finalImage = capturedImage;

      // Compress if larger than 3MB
      if (fileSize > 3) {
        try {
          finalImage = await compressBase64Image(capturedImage, 5, 0.8);
        } catch (compressionError) {
          setError('Image is too large and could not be compressed. Please try again.');
          setIsCompressing(false);
          return;
        }
      }

      onCapture(finalImage);
      onClose();
    } catch (err) {
      setError('Failed to process image. Please try again.');
      setIsCompressing(false);
    }
  };

  const handleRetake = () => {
    setCapturedImage(null);
  };

  return (
    <div className="camera-modal-overlay">
      <div className="camera-modal">
        <button className="modal-close-btn" onClick={onClose}>
          ×
        </button>
        <h3>Take Photo</h3>
        
        {!capturedImage ? (
          <div className="camera-container">
            <Webcam
              audio={false}
              ref={webcamRef}
              screenshotFormat="image/jpeg"
              width={400}
              height={300}
              style={{objectFit: 'contain'}}
            />
            <button className="capture-btn" onClick={capture}>
              📷 Capture
            </button>
          </div>
        ) : (
          <div className="preview-container">
            <img src={capturedImage} alt="Captured" width={400} height={300} style={{objectFit: 'contain'}} />
            <div className="preview-actions">
              <button className="retake-btn" onClick={handleRetake}>
                Retake
              </button>
              <button className="save-btn" onClick={handleSave}>
                Save
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CameraCapture;