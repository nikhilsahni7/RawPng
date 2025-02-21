import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import * as React from "react";

interface VerificationEmailProps {
  verificationUrl: string;
  userName: string;
}

export const VerificationEmail = ({
  verificationUrl,
  userName,
}: VerificationEmailProps) => (
  <Html>
    <Head />
    <Preview>Verify your email address for RawPng</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>Welcome to RawPng! 🎉</Heading>
        <Text style={text}>Hi {userName},</Text>
        <Text style={text}>
          Thanks for signing up! Please verify your email address by clicking
          the button below:
        </Text>
        <Section style={buttonContainer}>
          <Button
            style={{ ...button, padding: "12px 20px" }}
            href={verificationUrl}
          >
            Verify my email
          </Button>
        </Section>
        <Text style={text}>
          If you didn&apos;t sign up for RawPng, you can safely ignore this
          email.
        </Text>

        <Text style={footer}>
        © {new Date().getFullYear()} RawPng. All rights reserved.
        </Text>
      </Container>
    </Body>
  </Html>
);

const main = {
  backgroundColor: "#ffffff",
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
};

const container = {
  margin: "0 auto",
  padding: "20px 0 48px",
  maxWidth: "560px",
};

const h1 = {
  color: "#333",
  fontSize: "24px",
  fontWeight: "600",
  lineHeight: "1.25",
  padding: "16px 0",
  textAlign: "center" as const,
};

const text = {
  color: "#444",
  fontSize: "16px",
  lineHeight: "24px",
  textAlign: "left" as const,
};

const buttonContainer = {
  padding: "24px 0",
  textAlign: "center" as const,
};

const button = {
  backgroundColor: "#007bff",
  borderRadius: "4px",
  color: "#fff",
  fontSize: "16px",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "inline-block",
};

const footer = {
  color: "#898989",
  fontSize: "14px",
  lineHeight: "22px",
  textAlign: "center" as const,
  marginTop: "32px",
};

export default VerificationEmail;
