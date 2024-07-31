import audio from "./audio-file.png";
import CSV from "./csv.png";
import document from "./doc.png";
import other from "./document.png"; 
import PDF from "./pdf.png";
import image from "./photo.png"; 
import video from "./video-camera.png";
import excel from "./xls.png";
import zip from "./zip.png"; 
import folder from "./folder.png"; 

import {FileType} from "@/types"; 

let icons: { [key in FileType]: string }  = {
    audio: audio.src, 
    CSV: CSV.src, 
    document: document.src, 
    other: other.src, 
    PDF: PDF.src, 
    image: image.src, 
    video: video.src, 
    excel: excel.src, 
    zip: zip.src,
    folder: folder.src
};

export default icons; 