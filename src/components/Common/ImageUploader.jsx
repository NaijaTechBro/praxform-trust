import React, { useState, useRef } from 'react';
import axios from 'axios';
import { useUpload } from '../../context/UploadContext';
import { FiUploadCloud, FiTrash2, FiLoader } from 'react-icons/fi';
import { toast } from 'react-toastify';

const ImageUploader = ({ currentImageUrl, folder, onUploadSuccess, placeholderText = "Upload Image", uniqueId }) => {
    const { getCloudinarySignature } = useUpload();
    const [preview, setPreview] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const fileInputRef = useRef(null);

    const handleFileChange = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        if (!file.type.startsWith('image/')) {
            toast.error("Please select an image file.");
            return;
        }

        const reader = new FileReader();
        reader.onloadend = () => setPreview(reader.result);
        reader.readAsDataURL(file);

        setIsLoading(true);

        const signatureData = await getCloudinarySignature(folder);
        if (!signatureData) {
            setIsLoading(false);
            return;
        }

        const formData = new FormData();
        formData.append('file', file);
        formData.append('api_key', signatureData.apiKey);
        formData.append('timestamp', signatureData.timestamp);
        formData.append('signature', signatureData.signature);
        formData.append('folder', signatureData.folder);

        try {
            const cloudinaryAxios = axios.create();
            delete cloudinaryAxios.defaults.headers.common['Authorization'];

            const cloudinaryUrl = `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`;
            
            const { data } = await cloudinaryAxios.post(cloudinaryUrl, formData);

            toast.success("Image uploaded successfully!");
            
            onUploadSuccess({
                public_id: data.public_id,
                url: data.secure_url,
            });

        } catch (error) {
            toast.error("Upload failed. Please try again.");
            console.error("Cloudinary upload error:", error);
            setPreview(null);
        } finally {
            setIsLoading(false);
        }
    };

    const handleRemoveImage = () => {
        setPreview(null);
        onUploadSuccess({ public_id: null, url: null });
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const imageUrl = preview || currentImageUrl;
    // This line will now work correctly because 'uniqueId' is defined
    const inputId = `image-upload-${uniqueId}`;

    return (
        <div className="w-full">
            <div className="w-32 h-32 mx-auto border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-full flex items-center justify-center relative group bg-gray-50 dark:bg-gray-700">
                {isLoading ? (
                    <FiLoader className="animate-spin text-blue-500" size={32} />
                ) : imageUrl ? (
                    <>
                        <img src={imageUrl} alt="Preview" className="w-full h-full rounded-full object-cover" />
                        <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                                type="button"
                                onClick={handleRemoveImage}
                                className="text-white p-2 bg-red-500 rounded-full hover:bg-red-600"
                                aria-label="Remove image"
                            >
                                <FiTrash2 size={20} />
                            </button>
                        </div>
                    </>
                ) : (
                    <div className="text-center text-gray-500 dark:text-gray-400">
                        <FiUploadCloud size={32} />
                        <p className="text-xs mt-1">{placeholderText}</p>
                    </div>
                )}
            </div>
            <div className="text-center mt-4">
                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept="image/*"
                    className="hidden"
                    id={inputId}
                />
                <label
                    htmlFor={inputId}
                    className="cursor-pointer px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                    {imageUrl ? 'Change' : 'Select Image'}
                </label>
            </div>
        </div>
    );
};

export default ImageUploader;