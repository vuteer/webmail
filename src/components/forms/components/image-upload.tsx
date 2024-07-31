"use client"; 

import React, { Dispatch, SetStateAction } from 'react';

import { ImagePlus, Trash, X } from 'lucide-react';
import { CldUploadWidget } from 'next-cloudinary';

import { Button } from '@/components/ui/button';
import {AppImage} from "@/components"

import {cn} from "@/lib/utils";

interface ImageUploadProps {
    disabled?: boolean; 
    onChange: (value: string) => void; 
    onRemove?: (value: string) => void; 
    path?: string;
    images: string[]; 
    avatar?: boolean; 
    outer?: boolean;  // whether it is used within the formcontainer or not
    text?: string; 
}

const ImageUpload: React.FC<ImageUploadProps> = ({
    disabled, onChange, onRemove, path, 
    images, avatar = false, outer = false, text
}) => {
    const [isMounted, setIsMounted] = React.useState(false); 

    React.useEffect(() => {setIsMounted(true)}, []); 

    const onUpload = (result: any) => {
         
        if (result.event === 'success') {
            onChange(result.info.secure_url); 
        }
    }

    if (!isMounted) return null; 
    return (
        <div className={avatar ? "my-4": ""}>
            {
                !outer && (
                    <div className="mb-4 flex items-center gap-4">
                        {
                            images?.map((url: string, index: number) => (
                                <div key={index} className={cn(`${avatar ? "w-[60px] h-[60px] rounded-full": "w-[100px] h-[100px] lg:w-[200px] lg:h-[200px] rounded-md overflow-hidden"}`, "relative bg-secondary")}>
                                    {
                                        onRemove && (
                                            <div className={avatar ? "absolute z-10 -right-2 -top-2": "z-10 absolute top-2 right-2"}>
                                                <Button 
                                                    type="button" 
                                                    onClick={onRemove ? () => onRemove(url): () => {}} 
                                                    variant='destructive' size="icon"
                                                    className={avatar ? "rounded-full w-6 h-6":""}
                                                >
                                                    {avatar ? <X className="h-4 w-4" />: <Trash className='h-4 w-4'/>}
                                                </Button>
                                            </div>
                                        )
                                    }
                                    <AppImage 
                                        fill={true}
                                        cls={`${avatar ? "rounded-full": "rounded-lg"}`}
                                        alt='upload image'
                                        title="upload image"
                                        src={url}
                                        objectFit={`${avatar ? "contain": "cover"}`}
                                        nonBlur={true}
                                    />
                                </div>
                            ))
                        }
                    </div>
                )
            }
         
            <CldUploadWidget
                onUpload={onUpload}
                uploadPreset="yprhbndg"
                // 'dicydanz'
                options={{
                    cropping: false,
                    folder: path || 'test'
                }}
            >
                {({ open}) => {
                    const onClick = (e: any) => {
                        if (open) open()
                    }
                    return (
                        <Button 
                            type={"button"}
                            disabled={disabled}
                            onClick={onClick}
                        >
                            <ImagePlus className='h-4 w-4 mr-2'/>
                            {text ? text: avatar ? "Change profile picture": "Upload an Image"}
                        </Button>
                    )
                }}
            </CldUploadWidget>
        </div>
    );
}

export default ImageUpload;