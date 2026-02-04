export default function AboutPage() {
  return (
    <main
      style={{
        padding: "60px",
        maxWidth: "800px",
        margin: "0 auto",
        lineHeight: 1.6,
      }}
    >
      <h1>About LocksmithPro Express</h1>

      <p>
        LocksmithPro Express is a local locksmith service based in New York,
        providing residential, commercial, and emergency locksmith solutions.
      </p>

      <p>
        This business is owned and operated by <strong>Levani Ebelashvili</strong>.
      </p>

      {/* ✅ Twilio-სთვის მთავარი ნაწილი (EIN-ის გარეშე) */}
      <p>
        <strong>Legal Business Name:</strong> Levani Ebelashvili LLC <br />
        LocksmithPro Express is a brand operated by Levani Ebelashvili LLC.
      </p>

      <p>For customer inquiries, please contact:</p>

      <ul>
        <li>
          Email: <strong>info@locksmith-pro.org</strong>
        </li>
        <li>
          Website: <strong>https://www.locksmith-pro.org</strong>
        </li>
      </ul>
    </main>
  );
}
