import { Link } from "react-router-dom";

const T = {
  bg: "#F5EFE2",
  bgSoft: "#FBF6EA",
  ink: "#1C1917",
  inkSoft: "#4A4642",
  inkMute: "#8A8278",
  accent: "#E8482C",
  fontSerif: '"Fraunces", serif',
  fontMono: '"JetBrains Mono", monospace',
  font: '"Archivo", system-ui, sans-serif',
};

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section style={{ marginBottom: 36 }}>
      <h2 style={{
        fontFamily: T.fontSerif,
        fontSize: 20,
        fontWeight: 800,
        color: T.ink,
        margin: "0 0 10px",
        letterSpacing: -0.3,
      }}>
        {title}
      </h2>
      <div style={{
        fontFamily: T.font,
        fontSize: 15,
        lineHeight: 1.75,
        color: T.inkSoft,
      }}>
        {children}
      </div>
    </section>
  );
}

function P({ children }: { children: React.ReactNode }) {
  return <p style={{ margin: "0 0 12px" }}>{children}</p>;
}

function Ul({ items }: { items: string[] }) {
  return (
    <ul style={{ margin: "0 0 12px", paddingLeft: 20 }}>
      {items.map((item, i) => (
        <li key={i} style={{ marginBottom: 6 }}>{item}</li>
      ))}
    </ul>
  );
}

export function TermsPage() {
  return (
    <div style={{ background: T.bg, minHeight: "100svh", fontFamily: T.font }}>
      {/* Header */}
      <header style={{
        borderBottom: `2px solid ${T.ink}`,
        padding: "16px 24px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        background: T.bgSoft,
      }}>
        <Link to="/auth" style={{ display: "flex", alignItems: "center", gap: 8, textDecoration: "none", color: T.ink }}>
          <img src="/favicon.svg" alt="Engram" style={{ width: 28, height: 28 }} />
          <span style={{ fontFamily: T.fontSerif, fontWeight: 800, fontSize: 18, letterSpacing: -0.3 }}>Engram</span>
        </Link>
        <Link
          to="/auth"
          style={{
            fontFamily: T.fontMono,
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: 1.5,
            color: T.inkMute,
            textDecoration: "none",
          }}
        >
          ← BACK
        </Link>
      </header>

      {/* Content */}
      <main style={{ maxWidth: 720, margin: "0 auto", padding: "48px 24px 80px" }}>
        {/* Title */}
        <div style={{ marginBottom: 40 }}>
          <div style={{
            fontFamily: T.fontMono,
            fontSize: 10,
            fontWeight: 700,
            letterSpacing: 2.5,
            color: T.inkMute,
            textTransform: "uppercase",
            marginBottom: 10,
          }}>
            Legal
          </div>
          <h1 style={{
            fontFamily: T.fontSerif,
            fontSize: "clamp(32px, 5vw, 48px)",
            fontWeight: 900,
            color: T.ink,
            letterSpacing: -1,
            margin: "0 0 12px",
          }}>
            Terms of Service
          </h1>
          <p style={{ fontFamily: T.fontMono, fontSize: 12, color: T.inkMute, margin: 0 }}>
            Last updated: May 14, 2026
          </p>
        </div>

        <Section title="Acceptance of Terms">
          <P>
            By accessing or using Engram ("the Service"), you agree to be bound by these Terms of Service
            ("Terms"). If you do not agree to these Terms, do not use the Service. These Terms constitute a
            legally binding agreement between you and Engram.
          </P>
          <P>
            We reserve the right to update these Terms at any time. Continued use of the Service after
            changes are posted constitutes acceptance of the revised Terms.
          </P>
        </Section>

        <Section title="Description of the Service">
          <P>
            Engram is an AI-powered study application that helps university students learn more efficiently.
            The Service allows you to upload lecture materials, generate flashcards using AI, and schedule
            spaced repetition review sessions. Study sessions can be automatically booked into your Google
            Calendar through an optional integration.
          </P>
          <P>
            Engram is currently in beta. Features may change, and service availability is not guaranteed.
            See the Service Availability section below.
          </P>
        </Section>

        <Section title="Account Requirements">
          <P>To use Engram, you must:</P>
          <Ul items={[
            "Have a valid Google account. Engram uses Google OAuth for authentication; there is no separate username/password account.",
            "Be at least 18 years of age. Engram is designed for university students and is not intended for use by minors.",
            "Provide accurate information during sign-in and not impersonate any person or entity.",
          ]} />
          <P>
            You are responsible for maintaining the security of your Google account. Any activity that occurs
            under your Engram account is your responsibility. If you believe your account has been
            compromised, contact us immediately at{" "}
            <a href="mailto:support@engram.app" style={{ color: T.accent }}>support@engram.app</a>.
          </P>
        </Section>

        <Section title="Acceptable Use">
          <P>You agree to use Engram only for lawful, personal study purposes. You must not:</P>
          <Ul items={[
            "Upload any content that you do not have the right to use, including copyrighted materials that you are not licensed to reproduce or process. You are solely responsible for ensuring you have the necessary rights to any materials you upload.",
            "Use the Service for any commercial purpose or on behalf of any third party without our express written permission.",
            "Attempt to reverse engineer, decompile, disassemble, or otherwise derive the source code or underlying algorithms of the Service.",
            "Attempt to gain unauthorised access to any part of the Service, its servers, or any systems connected to it.",
            "Use automated tools, bots, or scripts to access or interact with the Service in a way that places excessive load on our infrastructure.",
            "Upload malicious content, including files designed to exploit the document processing pipeline.",
            "Violate any applicable laws or regulations in your use of the Service.",
          ]} />
        </Section>

        <Section title="Uploaded Content">
          <P>
            You retain full ownership of any documents, text, or other materials you upload to Engram
            ("Your Content"). We do not claim any ownership rights over Your Content.
          </P>
          <P>
            By uploading content to Engram, you grant us a limited, non-exclusive, royalty-free licence to
            process, store, and use Your Content solely for the purpose of providing the Service to you —
            specifically, to extract text and generate flashcards. This licence terminates when you delete
            the content or your account.
          </P>
          <P>
            You represent and warrant that Your Content does not infringe the intellectual property rights
            of any third party and that you have all necessary rights to grant the above licence.
          </P>
        </Section>

        <Section title="Google Calendar Integration">
          <P>
            Engram offers an optional feature that creates and manages study session events in your Google
            Calendar. By connecting your Google Calendar and using this feature, you authorise Engram to:
          </P>
          <Ul items={[
            "Create calendar events for your scheduled spaced repetition study sessions.",
            "Update existing Engram-created events when sessions are rescheduled.",
            "Delete Engram-created events when topics or sessions are removed.",
          ]} />
          <P>
            We access only your primary Google Calendar and only interact with events created by Engram.
            We do not read, modify, or delete any events we did not create.
          </P>
          <P>
            You can disconnect the Google Calendar integration at any time by revoking Engram's access
            in your Google Account settings. This will not affect your flashcard data or study history.
          </P>
        </Section>

        <Section title="AI-Generated Content">
          <P>
            Flashcards in Engram are generated by AI models via our inference provider. While we take
            reasonable steps to produce accurate and relevant flashcards, AI-generated content may
            contain errors, inaccuracies, or omissions.
          </P>
          <P>
            <strong style={{ color: T.ink }}>
              You are responsible for verifying the accuracy of AI-generated flashcards against your
              original source materials before relying on them for study or examination preparation.
            </strong>{" "}
            Engram does not guarantee the accuracy, completeness, or fitness for purpose of any
            generated flashcard content.
          </P>
        </Section>

        <Section title="Service Availability">
          <P>
            Engram is provided "as is" and "as available." We do not guarantee that the Service will be
            available at all times or free from errors. As a beta product, the Service may be subject to
            downtime, data loss, or breaking changes without prior notice.
          </P>
          <P>
            We will make reasonable efforts to maintain availability and notify users of planned maintenance
            or significant disruptions, but we are not liable for any losses arising from unavailability
            of the Service.
          </P>
        </Section>

        <Section title="Termination">
          <P>
            You may stop using Engram and delete your account at any time from the Settings page.
          </P>
          <P>
            We reserve the right to suspend or terminate your access to the Service, with or without notice,
            if we reasonably believe you have violated these Terms, engaged in fraudulent or illegal
            activity, or are otherwise causing harm to the Service or other users.
          </P>
          <P>
            Upon termination, your right to use the Service ceases immediately. If you delete your account,
            all of your data will be permanently deleted in accordance with our{" "}
            <Link to="/privacy" style={{ color: T.accent }}>Privacy Policy</Link>.
          </P>
        </Section>

        <Section title="Limitation of Liability">
          <P>
            To the fullest extent permitted by applicable law, Engram and its developers shall not be
            liable for any indirect, incidental, special, consequential, or punitive damages — including
            but not limited to loss of data, loss of study progress, or loss of opportunities — arising
            out of or related to your use of the Service.
          </P>
          <P>
            In no event shall our total liability to you for any claim arising out of or related to these
            Terms or the Service exceed the amount you have paid us in the twelve months preceding the claim,
            or €100, whichever is greater.
          </P>
          <P>
            Some jurisdictions do not allow the exclusion or limitation of liability for certain types of
            damages, so the above limitations may not apply to you in full.
          </P>
        </Section>

        <Section title="Intellectual Property">
          <P>
            The Engram name, logo, application design, and all content created by us (excluding Your Content
            and AI-generated flashcards derived from Your Content) are the intellectual property of Engram
            and its developers. You may not use our trademarks, logos, or branding without prior written
            permission.
          </P>
        </Section>

        <Section title="Changes to These Terms">
          <P>
            We may update these Terms from time to time. When we make material changes, we will update the
            "Last updated" date at the top of this page and, where appropriate, notify you within the app.
            Your continued use of Engram after changes are posted constitutes your acceptance of the
            revised Terms.
          </P>
        </Section>

        <Section title="Contact">
          <P>
            If you have any questions about these Terms or the Service, please contact us at:
          </P>
          <P>
            <a href="mailto:support@engram.app" style={{ color: T.accent, fontWeight: 700 }}>support@engram.app</a>
          </P>
        </Section>

        {/* Footer links */}
        <div style={{
          borderTop: `1.5px solid rgba(28,25,23,0.12)`,
          paddingTop: 24,
          display: "flex",
          gap: 20,
          fontFamily: T.fontMono,
          fontSize: 11,
          color: T.inkMute,
        }}>
          <Link to="/terms" style={{ color: T.ink, textDecoration: "none", fontWeight: 700 }}>Terms of Service</Link>
          <Link to="/privacy" style={{ color: T.inkMute, textDecoration: "none" }}>Privacy Policy</Link>
          <Link to="/auth" style={{ color: T.inkMute, textDecoration: "none" }}>Back to Engram</Link>
        </div>
      </main>
    </div>
  );
}
