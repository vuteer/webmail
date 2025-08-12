// security
"use client";
import CheckboxItem from "./checkbox";
import Container from "./container";
import { userPreferencesStore, SecurityType } from "@/stores/user-preferences";

const Security = () => {
  const { security } = userPreferencesStore();

  return (
    <Container title="Security">
      <>
        <CheckboxItem
          checked={security.TwoFA}
          text="Use Two Factor Authentication - 2FA. Coming Soon"
          disabled={true}
          // onClick={() => {}}
        />
        <CheckboxItem
          checked={security.reset}
          text={`Reset Password after every 30 days - for security reasons`}
          disabled={true}
          // onClick={() => {}}
        />
      </>
    </Container>
  );
};

export default Security;
