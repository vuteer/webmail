
// generating metadata on a page to page basis such as title, and description
export const generateStaticMetadata = (title: string, description: string = "") => {
    if (description) return {title, description}
    else return {title}
}; 
