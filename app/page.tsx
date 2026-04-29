import CategoryNav from '@/components/CategoryNav';
import Categories from '@/components/home/Categories';
import HeroBanner from '@/components/home/HeroBanner';
import Features from '@/components/home/Features';
import TrendingProducts from '@/components/home/TrendingProducts';
import StoreMapSection from '@/components/home/StoreMapSection';
import SubscriptionCTA from '@/components/home/SubscriptionCTA';

export default function HomePage() {
  return (
    <div className="w-full font-sans bg-gray-50 pb-16">
      
      {/* Top sticky scrollable pills */}
      <CategoryNav />
      
      {/* Zepto style square cards auto-carousel */}
      <Categories />

      {/* Main Promo Banner */}
      <HeroBanner />

      {/* 10-Min Delivery Features */}
      <Features />

      {/* Product Grid */}
      <TrendingProducts />

      {/* Local Store Map */}
      <StoreMapSection />

      {/* Subscription Banner */}
      <SubscriptionCTA />
      
    </div>
  );
}