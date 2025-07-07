import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import HeroSection from '@/components/sections/hero-section';
import GallerySection from '@/components/sections/gallery-section';
import PackagesSection from '@/components/sections/packages-section';
import BookingSection from '@/components/sections/booking-section';

export default function Home() {
  return (
    <div className="flex flex-col min-h-dvh bg-background">
      <Header />
      <main className="flex-1">
        <HeroSection />
        <GallerySection />
        <PackagesSection />
        <BookingSection />
      </main>
      <Footer />
    </div>
  );
}
