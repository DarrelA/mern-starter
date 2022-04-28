import { useEffect, useRef, useState } from 'react';

const ImageUpload = ({ id, onImageInput }) => {
  const [file, setFile] = useState();
  const [previewUrl, setPreviewUrl] = useState();

  const filePickerRef = useRef();

  useEffect(() => {
    if (!file) return;
    const fileReader = new FileReader();
    fileReader.onload = () => setPreviewUrl(fileReader.result);
    fileReader.readAsDataURL(file);
  }, [file]);

  const pickHandler = (e) => {
    let pickedFile;

    if (e.target.files.length === 1) {
      pickedFile = e.target.files[0];
      setFile(pickedFile);
    }
    onImageInput(pickedFile);
  };

  const pickImageHandler = () => filePickerRef.current.click();

  return (
    <div className="form-control">
      <input
        id={id}
        ref={filePickerRef}
        style={{ display: 'none' }}
        type="file"
        accept=".jpg, .png, .jpeg, .avif"
        onChange={pickHandler}
      />

      <div className={`image-upload center`}>
        <div className="image-upload__preview">
          {previewUrl && <img src={previewUrl} alt="preview" />}
          {!previewUrl && <p>Please pick an image.</p>}
        </div>
        <button type="button" onClick={pickImageHandler}>
          Upload an image
        </button>
      </div>
    </div>
  );
};
export default ImageUpload;
