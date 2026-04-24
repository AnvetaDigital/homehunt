import Link from "next/link";

export default function Home() {
  return (
    <main className="w-full">
      
      <section className="relative h-[90vh] flex items-center justify-center text-center text-white">
        
        {/* Background Image */}
        <img
          src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c"
          className="absolute inset-0 w-full h-full object-cover"
          alt="home"
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-linear-to-b from-black/60 to-black/70" />

        {/* Content */}
        <div className="relative z-10 px-6 max-w-3xl">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 leading-tight">
            Find Your Perfect Home
          </h1>

          <p className="text-lg md:text-xl mb-6 text-gray-200">
            Discover the best properties across India with smart filters,
          map view, and real-time listings.
          </p>

          <div className="flex justify-center gap-4 mb-8">
            <Link href="/properties">
              <button className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg">
                Browse Properties
              </button>
            </Link>
          </div>

        </div>
      </section>

      {/* FEATURES SECTION */}
      <section className="py-16 px-6 bg-cyan-50">
        <h2 className="text-3xl font-bold text-center mb-10">
          Why Choose HomeHunt?
        </h2>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto text-center">
          <div className="p-6 bg-white shadow rounded-lg">
            <h3 className="font-semibold text-lg mb-2">Smart Filters</h3>
            <p className="text-gray-600">
              Find properties based on your budget, location and type.
            </p>
          </div>

          <div className="p-6 bg-white shadow rounded-lg">
            <h3 className="font-semibold text-lg mb-2">Map Integration</h3>
            <p className="text-gray-600">
              Visualize listings on map and explore nearby areas easily.
            </p>
          </div>

          <div className="p-6 bg-white shadow rounded-lg">
            <h3 className="font-semibold text-lg mb-2">Real Listings</h3>
            <p className="text-gray-600">
              Browse real-time properties with images and details.
            </p>
          </div>
        </div>
      </section>

      <section className="py-16 text-center bg-emerald-100">
        <h2 className="text-3xl font-bold mb-4">
          Start Your Property Journey Today
        </h2>

        <p className="text-gray-600 mb-6">
          Explore thousands of listings and find your dream home.
        </p>

        <Link href="/properties">
          <button className="bg-blue-600 text-white px-8 py-3 rounded-lg">
            Explore Now
          </button>
        </Link>
      </section>

    </main>
  );
}
