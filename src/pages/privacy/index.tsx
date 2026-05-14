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

export function PrivacyPage() {
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
          <img src="/favicon.svg" alt="Engraam" style={{ width: 28, height: 28 }} />
          <span style={{ fontFamily: T.fontSerif, fontWeight: 800, fontSize: 18, letterSpacing: -0.3 }}>Engraam</span>
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
            Privacy Policy
          </h1>
          <p style={{ fontFamily: T.fontMono, fontSize: 12, color: T.inkMute, margin: 0 }}>
            Last updated: May 14, 2026
          </p>
        </div>

        <Section title="Introduction">
          <P>
            Engraam ("we", "us", or "our") is an AI-powered study application designed for university students.
            This Privacy Policy explains how we collect, use, and protect your information when you use Engraam
            ("the Service"). By using Engraam, you agree to the practices described in this policy.
          </P>
          <P>
            Engraam is currently in beta. We are committed to handling your data responsibly and transparently.
          </P>
        </Section>

        <Section title="Information We Collect">
          <P>We collect the following categories of information:</P>
          <Ul items={[
            "Account information from Google sign-in: your name, email address, and profile picture as provided by Google OAuth.",
            "Google Calendar tokens: OAuth access and refresh tokens that allow Engraam to create and manage calendar events on your behalf. These are stored securely and used only for the calendar integration described below.",
            "Uploaded document content: the text extracted from PDF, DOCX, or other files you upload to generate flashcards.",
            "Course and topic data: the names and structure of the courses and topics you create within the app.",
            "Flashcard data: AI-generated flashcards associated with your topics, including question and answer text and spaced repetition metadata (interval, ease factor, review history).",
            "Study session history: records of completed study sessions, including timestamps and performance ratings.",
          ]} />
          <P>
            We do not collect payment information, precise location data, or any information beyond what is
            necessary to provide the Service.
          </P>
        </Section>

        <Section title="How We Use Your Information">
          <P>We use your information solely to provide and improve the Service:</P>
          <Ul items={[
            "To authenticate you and maintain your account.",
            "To store your courses, topics, and flashcards so they are accessible across devices.",
            "To process your uploaded documents and generate AI-powered flashcards from their content.",
            "To schedule and manage spaced repetition review sessions in your Google Calendar.",
            "To track your study progress and apply the spaced repetition algorithm to surface cards at the optimal time.",
            "To send you in-app and browser notifications about upcoming study sessions (only if you grant notification permission).",
          ]} />
          <P>
            We do not use your data for advertising, profiling, or any purpose unrelated to the core
            functionality of Engraam.
          </P>
        </Section>

        <Section title="Google OAuth and Calendar Access">
          <P>
            Engraam uses Google OAuth to authenticate users. When you sign in, Google provides us with your
            basic profile information (name, email, profile picture) and, if you grant it, access to your
            Google Calendar.
          </P>
          <P>
            <strong style={{ color: T.ink }}>Why we request Calendar access:</strong> Engraam's core scheduling
            feature creates study session events in your Google Calendar so that your spaced repetition reviews
            are automatically booked into your week. Without calendar access, this feature is unavailable, but
            the rest of the app remains fully functional.
          </P>
          <P>
            <strong style={{ color: T.ink }}>How Calendar access is used:</strong> We use your Google Calendar
            access exclusively to create, update, and delete Engraam study session events on your behalf. We do
            not read your existing calendar events, access calendars other than the primary calendar, or use
            your calendar data for any other purpose.
          </P>
          <P>
            You can revoke Engraam's access to your Google Calendar at any time through your{" "}
            <a
              href="https://myaccount.google.com/permissions"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: T.accent, textDecoration: "underline" }}
            >
              Google Account permissions
            </a>
            . Revoking access will disable the calendar scheduling feature but will not affect your flashcard
            data or study history.
          </P>
          <P>
            Engraam's use and transfer of information received from Google APIs adheres to the{" "}
            <a
              href="https://developers.google.com/terms/api-services-user-data-policy"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: T.accent, textDecoration: "underline" }}
            >
              Google API Services User Data Policy
            </a>
            , including the Limited Use requirements.
          </P>
        </Section>

        <Section title="Uploaded Document Content">
          <P>
            When you upload a document (such as a lecture PDF or DOCX file), Engraam extracts the text content
            and sends it to our AI inference provider (OpenRouter) to generate flashcards. The extracted text
            content is stored in our database (Convex) associated with your account and topic.
          </P>
          <P>
            This content is used only to generate and improve your flashcards within the Service. We do not
            use the content of your uploaded documents to train AI models, share it with other users, or use
            it for any purpose other than providing the Service to you.
          </P>
          <P>
            You retain full ownership of any documents you upload. You can delete your uploaded content and
            the associated flashcards at any time from within the app.
          </P>
        </Section>

        <Section title="Data Sharing">
          <P>
            <strong style={{ color: T.ink }}>We do not sell your personal data.</strong> We do not share your
            data with advertisers, data brokers, or any third party for commercial purposes.
          </P>
          <P>
            We share data only with the following third-party services that are necessary to operate Engraam:
          </P>
          <Ul items={[
            "Google (Google OAuth, Google Calendar API): for authentication and calendar integration. Subject to Google's Privacy Policy.",
            "Convex: our backend database and serverless infrastructure provider, where your account data, flashcards, and study history are stored.",
            "OpenRouter: our AI model inference router, which processes your uploaded document content to generate flashcards. OpenRouter routes requests to underlying AI model providers.",
          ]} />
          <P>
            All third-party service providers are contractually required to handle your data securely and only
            for the purposes for which it was shared.
          </P>
        </Section>

        <Section title="Data Retention">
          <P>
            We retain your account data, flashcards, and study history for as long as your account is active.
            If you delete your account through the Settings page, all of your data — including your account
            information, courses, topics, flashcards, uploaded document content, and study history — is
            permanently deleted from our systems.
          </P>
          <P>
            To request deletion of your data, use the "Delete account" option in the Engraam Settings page,
            or contact us at{" "}
            <a href="mailto:privacy@engraam.app" style={{ color: T.accent }}>privacy@engraam.app</a>.
            We will process deletion requests within 30 days.
          </P>
        </Section>

        <Section title="Security">
          <P>
            Your data is stored on Convex's infrastructure, which uses industry-standard encryption at rest
            and in transit. OAuth tokens are stored securely and are never exposed to the client beyond what
            is needed to perform API calls. We apply the principle of least privilege: each component of the
            system only has access to the data it needs to function.
          </P>
          <P>
            No system can guarantee absolute security. If you believe your account has been compromised,
            please contact us immediately at{" "}
            <a href="mailto:privacy@engraam.app" style={{ color: T.accent }}>privacy@engraam.app</a>.
          </P>
        </Section>

        <Section title="Children's Privacy">
          <P>
            Engraam is intended for university students aged 18 and above. We do not knowingly collect
            personal information from anyone under the age of 18. If you believe a minor has created an
            account, please contact us at{" "}
            <a href="mailto:privacy@engraam.app" style={{ color: T.accent }}>privacy@engraam.app</a>{" "}
            and we will promptly delete the account and associated data.
          </P>
        </Section>

        <Section title="Changes to This Policy">
          <P>
            We may update this Privacy Policy from time to time. When we make material changes, we will
            update the "Last updated" date at the top of this page and, where appropriate, notify you
            within the app. Your continued use of Engraam after changes are posted constitutes your acceptance
            of the revised policy.
          </P>
        </Section>

        <Section title="Contact">
          <P>
            If you have any questions, concerns, or requests regarding this Privacy Policy or how we handle
            your data, please contact us at:
          </P>
          <P>
            <a href="mailto:privacy@engraam.app" style={{ color: T.accent, fontWeight: 700 }}>privacy@engraam.app</a>
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
          <Link to="/terms" style={{ color: T.inkMute, textDecoration: "none" }}>Terms of Service</Link>
          <Link to="/privacy" style={{ color: T.ink, textDecoration: "none", fontWeight: 700 }}>Privacy Policy</Link>
          <Link to="/auth" style={{ color: T.inkMute, textDecoration: "none" }}>Back to Engraam</Link>
        </div>
      </main>
    </div>
  );
}
