import React, { useState, useEffect, useRef } from 'react';
import './TextReader.css';

const TextReader = () => {
  const [file, setFile] = useState(null);
  const [speaking, setSpeaking] = useState(false);
  const utteranceRef = useRef(null);

  useEffect(() => {
    return () => {
      if (utteranceRef.current && speaking) {
        window.speechSynthesis.cancel();
      }
    };
  }, [speaking]);

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    setFile(selectedFile);
    utteranceRef.current = null;
    setSpeaking(false);
  };

  const handleReadFile = () => {
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target.result;
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 0.9;
        utteranceRef.current = utterance;
        setSpeaking(true);
        window.speechSynthesis.speak(utterance);
      };
      reader.readAsText(file);
    }
  };

  const handleStop = () => {
    if (utteranceRef.current && speaking) {
      window.speechSynthesis.cancel();
      utteranceRef.current = null;
      setSpeaking(false);
    }
  };

  return (
    <div className="text-reader-container">
      <h1>Text Reader</h1>
      <input type="file" onChange={handleFileChange} accept=".txt" />
      <button className="read-btn" onClick={handleReadFile} disabled={!file || speaking}>
        {speaking ? 'Reading...' : 'Read Text'}
      </button>
      {speaking && (
        <button className="stop-btn" onClick={handleStop}>
          Stop
        </button>
      )}
    </div>
  );
};

export default TextReader;
