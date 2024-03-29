import React, { useState } from 'react'
import Dropzone from 'react-dropzone';

import Axios from 'axios';
import { border } from '@mui/system';
function FileUpload(props) {

    const [Images, setImages] = useState()

    const onDrop = (files) => {

        let formData = new FormData();
        const config = {
            header: { 'content-type': 'multipart/form-data' }
        }
        formData.append("file", files)
        console.log(files);
        console.log(formData);
        //save the Image we chose inside the Node Server 
        Axios.post('http://54.219.66.85:5000/uploadImage', files, config)
            .then(response => {
                if (response.data.success) {

                    setImages(Images, response.data.image)
                    props.refreshFunction(Images, response.data.image)

                } else {
                    alert('Failed to save the Image in Server')
                }
            })
    }
    const onDelete = (image) => {
        

        let newImages = image
        

        setImages(newImages)
        props.refreshFunction(newImages)
    }

    return (
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <Dropzone
                onDrop={onDrop}
                multiple={false}
                maxSize={800000000}
            >
                {({ getRootProps, getInputProps }) => (
                    <div style={{
                        width: '300px', height: '240px', border: '1px solid lightgray',
                        display: 'flex', alignItems: 'center', justifyContent: 'center'
                    }}
                        {...getRootProps()}
                    >
                        {console.log('getRootProps', { ...getRootProps() })}
                        {console.log('getInputProps', {...getInputProps() })}
                        <input {...getInputProps()} />
                       

                    </div>
                )}
            </Dropzone>

            <div style={{ display: 'flex', width: '350px', height: '240px', overflowX: 'scroll' }}>

                
                    <div onClick={() => onDelete(Images)}>
                        <img style={{ minWidth: '300px', width: '300px', height: '240px'}} src={`http://54.219.66.85:5000/uploads/${Images}`} />
                    </div>
                


            </div>

        </div>
    )
}

export default FileUpload