// html mail template
export const generateHTMLStr = (subject: string, reply: string) =>
    `
        <!DOCTYPE html>
        <html lang="en" xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width">
          <meta http-equiv="X-UA-Compatible" content="IE=edge">
          <meta name="x-apple-disable-message-reformatting">
          <title>${subject}</title>
          <style>
              html,
              body {
                  margin: 0 auto !important;
                  padding: 0 !important;
                  height: 100% !important;
                  width: 100% !important;
                  font-family: "Amazon Ember", "Helvetica Neue", Roboto, Arial, sans-serif;
  
                  font-size: 13px;
              }
              * {
                  -ms-text-size-adjust: 100%;
                  -webkit-text-size-adjust: 100%;
              }
              div[style*="margin: 16px 0"] {
                  margin: 0 !important;
              }
  
              h1 {
                font-size: 1.3rem;
              }
              h2 {
                font-size: 1.2rem;
              }
              h3, p, ul li, ol li, h4, h5, h6 {
                font-size: 1.1rem
              }
              .email-container {
                padding: .4rem 0rem; 
              }
  
              img {
                  -ms-interpolation-mode:bicubic;
              }
              *[x-apple-data-detectors],  /* iOS */
              .x-gmail-data-detectors,    /* Gmail */
              .x-gmail-data-detectors *,
              .aBn {
                  border-bottom: 0 !important;
                  cursor: default !important;
                  color: inherit !important;
                  text-decoration: none !important;
                  font-size: inherit !important;
                  font-family: inherit !important;
                  font-weight: inherit !important;
                  line-height: inherit !important;
              }
              /* iPhone 4, 4S, 5, 5S, 5C, and 5SE */
              @media only screen and (min-device-width: 320px) and (max-device-width: 374px) {
                  .email-container {
                      min-width: 320px !important;
                  }
              }
              /* iPhone 6, 6S, 7, 8, and X */
              @media only screen and (min-device-width: 375px) and (max-device-width: 413px) {
                  .email-container {
                      min-width: 375px !important;
  
                  }
              }
              /* iPhone 6+, 7+, and 8+ */
              @media only screen and (min-device-width: 414px) {
                  .email-container {
                      min-width: 414px !important;
                  }
              }
              /* Media Queries */
              @media screen and (max-width: 600px) {
                  .email-container {
                      padding-top: 0 !important;
                  }
  
                  body,
                  center {
                      /* background: #FFF !important; */
                  }
  
              }
          </style>
          <!--[if gte mso 9]>
          <xml>
              <o:OfficeDocumentSettings>
                  <o:AllowPNG/>
                  <o:PixelsPerInch>96</o:PixelsPerInch>
              </o:OfficeDocumentSettings>
          </xml>
          <![endif]-->
      </head>
      <body width="100%" style="margin: 0; mso-line-height-rule: exactly;">
        <main class="email-container">
            <div style="width: 100%">
              ${reply}
            </div>
        </main>
      </body>
      </html>
    `;
  
  export const removeHtmlTags = (
    htmlString: string,
    addSpace: boolean = true
  ) => {
    // Replace block-level tags with a newline character followed by a space
    htmlString = htmlString.replace(
      /<(div|p|h[1-6]|blockquote|pre|ul|ol|li|table|tr|td)[^>]*>/g,
      addSpace ? "\n" : ""
    );
    // Remove all other tags
    return htmlString.replace(/<[^>]+>/g, "");
  };