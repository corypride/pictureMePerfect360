import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import HeroSection from '@/components/sections/hero-section';
import GallerySection from '@/components/sections/gallery-section';
import PackagesSection from '@/components/sections/packages-section';
import BookingSection from '@/components/sections/booking-section';

export default function Home() {
  return (
    <div className="flex flex-col min-h-dvh bg-black">
      <Header />
      <main className="m-auto justify-items-center text-center text-white">
        <HeroSection />
        <GallerySection />
        <PackagesSection />
        <BookingSection />
      </main>
      <Footer />
    </div>
  );
}
