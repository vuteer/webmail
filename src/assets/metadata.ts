const keywords = [
  "VuMail email client",
  "Self-hosted email platform",
  "Mailu webmail interface",
  "Custom email hosting",
  "Secure email service",
  "Business email Kenya",
  "Encrypted email communication",
  "Mail management platform",
  "Custom domain email hosting",
  "Private email server",
  "Email automation tools",
  "Bulk email sending",
  "Newsletter management",
  "IMAP and SMTP email client",
  "Open-source email solution",
];

const description =
  "VuMail is a secure, self-hosted email client designed for businesses and individuals. Manage your emails, custom domains, newsletters, and more — all from one powerful, privacy-focused platform.";

const title = "VuMail: Secure Business Email Client & Domain Hosting";

const url = `${
  process.env.NODE_ENV === "development"
    ? "http://localhost:3000"
    : "https://mail.vuteer.com"
}`;

const siteName = "VuMail";

const baseMetadata = {
  keywords,
  description,
  title,
  url,
  siteName,
};

export default baseMetadata;
