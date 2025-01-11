import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import * as React from "react";

interface NewsletterWelcomeEmailProps {
  email: string;
}

export const NewsletterWelcomeEmail = ({
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  email,
}: NewsletterWelcomeEmailProps) => (
  <Html>
    <Head />
    <Preview>Welcome to the RawPng Newsletter!</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>Welcome to RawPng Newsletter! 🎨</Heading>
        <Text style={text}>
          Thank you for subscribing to our newsletter. We&lsquo;re excited to
          have you join our community!
        </Text>
        <Section style={featuresContainer}>
          <Text style={featureText}>What you&apos;ll receive:</Text>
          <ul style={list}>
            <li style={listItem}>Latest design resources and tools</li>
            <li style={listItem}>Exclusive PNG optimization tips</li>
            <li style={listItem}>Community highlights and success stories</li>
            <li style={listItem}>Early access to new features</li>
          </ul>
        </Section>
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

const featuresContainer = {
  padding: "24px",
  backgroundColor: "#f9f9f9",
  borderRadius: "4px",
};

const featureText = {
  fontSize: "18px",
  fontWeight: "600",
  color: "#333",
  marginBottom: "12px",
};

const list = {
  margin: "0",
  padding: "0",
  listStyle: "none",
};

const listItem = {
  margin: "10px 0",
  paddingLeft: "24px",
  position: "relative" as const,
  color: "#555",
};

const footer = {
  color: "#898989",
  fontSize: "14px",
  lineHeight: "22px",
  textAlign: "center" as const,
  marginTop: "32px",
};

export default NewsletterWelcomeEmail;
