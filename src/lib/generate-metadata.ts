export const generateDynamicMetadata = async (
  title: string,
  link: string,
  description: string = "",
  og: string = "",
) => {
  const metadata: any = {
    title,
    openGraph: {
      title: title,
      description,
      type: "article",
      url: link,
      images: [
        {
          url:
            og ||
            "https://res.cloudinary.com/dyo0ezwgs/image/upload/v1754999441/vumail/New_Project_1_astbro.png",
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: title,
      description,
      images: [
        og ||
          "https://res.cloudinary.com/dyo0ezwgs/image/upload/v1754999441/vumail/New_Project_1_astbro.png",
      ],
    },
  };

  if (description) metadata.description = description;
  return metadata;
};
