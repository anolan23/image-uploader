import React, { useState } from 'react';
import axios from 'axios';

import Container from './components/Container';
import './sass/global.scss';
import Preview from './components/Preview';

function App() {
  // 'http://localhost:3000/api/uploads/1641505894781.png';
  const [progress, setProgress] = useState(0);
  const [imageUrl, setImageUrl] = useState('');
  const [uploaded, setUploaded] = useState(false);

  const upload = async (file) => {
    try {
      const data = new FormData();
      data.append('image', file);
      const res = await axios.post(`/api/uploads`, data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress(p) {
          setProgress(p.loaded / p.total);
        },
      });
      console.log(res);
      setImageUrl(`${window.location.href}api/uploads/${res.data.fileName}`);
      setUploaded(true);
    } catch (error) {
      console.error(new Error(error.response.data.error));
    }
  };

  const onChange = (e) => {
    upload(e.target.files[0]);
  };

  const renderStep = () => {
    if (progress === 0) {
      return (
        <div className="upload">
          <h1 className="upload__heading">Upload your image</h1>
          <span className="upload__message">File should be jpg, png...</span>
          <Preview>
            <div className="upload__preview">
              <img
                src="image.svg"
                alt="upload icon"
                className="upload__preview__image"
              />
              <span className="upload__preview__text">
                Drag & Drop your image here
              </span>
            </div>
          </Preview>
          <span className="upload__or">Or</span>
          <label htmlFor="file-upload" className="upload__button">
            Choose a file
          </label>
          <input
            id="file-upload"
            type="file"
            onChange={onChange}
            accept="image/*"
          />
        </div>
      );
    }
    if (progress < 1) {
      return (
        <div className="loading">
          <h1 className="loading__title">Uploading...</h1>
          <div className="loading__bar-holder">
            <div
              className="loading__bar-holder__bar"
              style={{ width: `${progress * 100}%` }}
            ></div>
          </div>
        </div>
      );
    }
    if (uploaded) {
      return (
        <div className="uploaded">
          <h1 className="loading__title">Uploaded successfully!</h1>
          <Preview>
            <img className="uploaded__image" src={imageUrl} alt="upload" />
          </Preview>
          <div className="uploaded__input">
            <span className="uploaded__input__link">{imageUrl}</span>
            <button
              className="uploaded__input__button"
              onClick={() => {
                const range = document.createRange();
                range.selectNode(
                  document.querySelector('.uploaded__input__link')
                );
                window.getSelection().removeAllRanges(); // clear current selection
                window.getSelection().addRange(range); // to select text
                document.execCommand('copy');
                window.getSelection().removeAllRanges(); // to deselect
              }}
            >
              Copy link
            </button>
          </div>
        </div>
      );
    }
  };

  return (
    <div className="App">
      <Container>{renderStep()}</Container>
      <footer className="footer">
        Created by Aaron Nolan - devChallenges.io
      </footer>
    </div>
  );
}

export default App;
