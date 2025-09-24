import SEOHead from "../../components/SEOHead";
import { BRAND, titleTemplate } from "../../lib/seo";

export default function ThanksPage() {
  return (
    <main className="card p-8 mx-auto max-w-2xl">
      <SEOHead title={titleTemplate("Request received")} />
      <h1 className="text-2xl font-bold">Thanks!</h1>
      <p className="mt-2">
        We received your request. A {BRAND} technician will call you shortly.
      </p>
      <a className="btn mt-6" href="/">← Back to Home</a>
    </main>
  );
}
