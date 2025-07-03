import { ImapFlow } from "imapflow";

export async function createIMAPClient() {
  const response = await fetch("/api/oauth-token");
  const { token } = await response.json();

  return new ImapFlow({
    host: "mailu-imap",
    port: 993,
    secure: true,
    auth: {
      user: "user@domain.com",
      accessToken: token,
      // mechanism: 'XOAUTH2'
    },
  });
}
