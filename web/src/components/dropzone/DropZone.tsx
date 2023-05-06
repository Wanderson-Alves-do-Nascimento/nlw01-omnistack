import React, { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { FiUpload } from 'react-icons/fi'

import './styles.css'

interface DropzoneProps {
  onFileUploaded: (file: File) => void;
}

const Dropzone: React.FC<DropzoneProps> = ({ onFileUploaded }) => {
  const [selectFileUrl, setSelectedFileUrl] = useState('');

  const onDrop = useCallback((acceptedFiles: File[]) => {
    // Do something with the files
    const file = acceptedFiles[0];
    const fileUrl = URL.createObjectURL(file);
    setSelectedFileUrl(fileUrl);
    onFileUploaded(file);
  }, [onFileUploaded])

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
  })

  return (
    <div {...getRootProps()} className='dropzone'>
      <input {...getInputProps()} accept='image/*' />
      {selectFileUrl ?
        <img src={selectFileUrl} alt='Point thumbnail' />
        : (
          <p>
            <FiUpload />
            Imagem do estabelecimento.
          </p>
        )
      }


    </div>
  )
}
export default Dropzone;