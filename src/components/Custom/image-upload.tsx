import { cn } from '@/lib/utils';
import React, { useState } from 'react';


interface ImageUploadProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?:string,
    defaultImage?:string,
    id?:string
}

const ImageUpload: React.FC<ImageUploadProps> = ({
    className = '',
    label='',
    defaultImage = null,
    id,
    ...inputProps
}) => {
    const [imageSrc, setImageSrc] = useState<string | null>(defaultImage);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]; // Get the first file
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImageSrc(reader.result as string); // Set the image source to the result
            };
            reader.readAsDataURL(file); // Read the file as a data URL
        }
    };

    return (
        <div>
            {/* Hidden input for file selection */}
            <input
                type="file"
                id={id ?? 'image_upload_file_input'}
                accept="image/*"
                className={`hidden rounded`} 
                onChange={handleFileChange}
                {...inputProps}
            />
            <label 
                htmlFor={id ?? 'image_upload_file_input'} 
                className={cn("block size-20 border border-primary border-dashed rounded-full overflow-hidden bg-muted", className)}>
                {imageSrc ? (
                    <img src={imageSrc} alt="Selected" className="object-cover w-full h-full" />
                ) : (
                    <span>{label}</span>
                )}
            </label>
        </div>
    );
};

export default ImageUpload;
