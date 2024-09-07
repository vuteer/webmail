export const getFileName = (fileName: string) => {
    // Find the last occurrence of the period in the file name
    const lastDotIndex = fileName.lastIndexOf('.');

    // If there's no period, return the original file name (no extension)
    if (lastDotIndex === -1) {
        return fileName;
    }

    // Extract and return the file name without the extension
    return fileName.substring(0, lastDotIndex);
}