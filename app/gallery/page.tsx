import Link from "next/link";

export const metadata = {
  title: "Photo Gallery | LocksmithPro Express",
  description: "See real locksmith work photos from LocksmithPro Express.",
};

export default function GalleryPage() {
  const photos = [
    "/gallery/lock-change.jpg",
    "/gallery/house-lockout.jpg",
    "/gallery/car-lockout.jpg",
    "/gallery/tools-van.jpg",
  ];

  return (
    <main className="text-white">
      {/* Title */}
      <section className="py-10 text-center">
        <h1 className="text-3xl sm:text-4xl font-bold">
          Photo Gallery
        </h1>
        <p className="mt-3 text-white/70 max-w-xl mx-auto">
          Real photos of our locksmith services — lockouts, lock changes,
          emergency work, and mobile response.
        </p>
      </section>

      {/* Gallery Grid */}
      <section className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
        {photos.map((src, i) => (
          <div
            key={i}
            className="rounded-2xl overflow-hidden shadow-lg bg-white/5 border border-white/10"
          >
            <img
              src={src}
              alt="Locksmith service photo"
              className="w-full h-64 object-cover hover:scale-105 transition"
            />
          </div>
        ))}
      </section>

      {/* Back button */}
      <div className="text-center mt-10">
        <Link
          href="/"
          className="inline-block px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 transition"
        >
          ← Back to Home
        </Link>
      </div>
    </main>
  );
}
