import Link from 'next/link';
import Image from 'next/image';
import HeroImage from '@/assets/images/hero-image.png';
import RestaurantIcon from '@/assets/icons/all-restaurants.png';
import NearbyIcon from '@/assets/icons/location.png';
import DiscountIcon from '@/assets/icons/discount.png';
import BestSellerIcon from '@/assets/icons/best-seller.png';
import DeliveryIcon from '@/assets/icons/delivery.png';
import LunchIcon from '@/assets/icons/lunch.png';
import { FadeInStagger, FadeInItem } from '@/components/shared/FadeInStagger';
import { HomeSearchProvider } from '@/components/features/home/HomeSearchProvider';
import { SearchBar } from '@/components/features/home/SearchBar';
import { RestaurantListSection } from '@/components/features/home/RestaurantListSection';

// --- Category List ---
const CATEGORIES = [
  { label: 'All Restaurant', icon: RestaurantIcon, href: '/category' },
  { label: 'Nearby', icon: NearbyIcon, href: '/category?filter=nearby' },
  { label: 'Discount', icon: DiscountIcon, href: '/category?filter=discount' },
  {
    label: 'Best Seller',
    icon: BestSellerIcon,
    href: '/category?filter=best-seller',
  },
  { label: 'Delivery', icon: DeliveryIcon, href: '/category?filter=delivery' },
  { label: 'Lunch', icon: LunchIcon, href: '/category?category=lunch' },
];

export default function HomePage() {
  return (
    <HomeSearchProvider>
      <div className='mb-13'>
        {/* --- Hero Section --- */}
        <FadeInItem index={0}>
          <section
            className='relative flex items-center justify-center'
            style={{
              height:
                'clamp(648px, 648px + (827px - 648px) * ((100vw - 393px) / (1440px - 393px)), 827px)',
              backgroundImage: `url(${HeroImage.src})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          >
            <div className='absolute inset-0 bg-black/35' />
            <div className='flex flex-col gap-6 md:gap-10 z-10 w-full md:mt-5 md:w-186 px-4 text-center'>
              {/* --- Hero Title --- */}
              <FadeInItem index={1}>
                <div className='flex flex-col gap-1 md:gap-2'>
                  <h1 className='text-display-lg-track md:text-display-2xl-track font-extrabold text-white text-center'>
                    Explore Culinary Experiences
                  </h1>
                  <p className='font-bold text-lg tracking-tight-3 md:text-display-xs md:tracking-none text-white'>
                    Search and refine your choice to discover the perfect
                    restaurant.
                  </p>
                </div>
              </FadeInItem>

              {/* --- Search Bar (Client) --- */}
              <FadeInItem index={2}>
                <SearchBar />
              </FadeInItem>
            </div>
          </section>
        </FadeInItem>

        {/* --- Categories Section (static, stays Server) --- */}
        <section className='mx-auto w-full max-w-360 px-4 py-6 md:px-30 md:py-12'>
          <FadeInStagger className='grid grid-cols-3 lg:grid-cols-6 gap-x-3 gap-y-5 md:gap-x-5'>
            {CATEGORIES.map((cat, idx) => (
              <FadeInItem key={cat.label} index={idx}>
                <Link
                  href={cat.href}
                  className='flex flex-col gap-1 md:gap-2 items-center justify-center bg-white transition-all duration-500 ease-in-out hover-scale-105'
                >
                  <div className='w-full h-25 flex justify-center items-center p-2 rounded-2xl shadow-card'>
                    <Image
                      src={cat.icon}
                      alt={cat.label}
                      className='w-12 h-12 md:w-16.25 md:h-16.25 object-contain'
                    />
                  </div>
                  <span className='w-full h-7 md:h-8 flex items-center justify-center text-sm tracking-tight-2 md:text-lg md:tracking-tight-3 font-bold text-neutral-950 text-center'>
                    {cat.label}
                  </span>
                </Link>
              </FadeInItem>
            ))}
          </FadeInStagger>
        </section>

        {/* --- Restaurant List Section (Client) --- */}
        <RestaurantListSection />
      </div>
    </HomeSearchProvider>
  );
}
