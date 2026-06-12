import Link from 'next/link';
import Image from 'next/image';
import LogoColor from '@/assets/images/logo-text-white.png';
import Facebook from '@/assets/icons/facebook.png';
import Instagram from '@/assets/icons/instagram.png';
import LinkedIn from '@/assets/icons/linkedin.png';
import Tiktok from '@/assets/icons/tiktok.png';

const exploreLinks = [
  { label: 'All Food', href: '/category' },
  { label: 'Nearby', href: '/category?filter=nearby' },
  { label: 'Discount', href: '/category?filter=discount' },
  { label: 'Best Seller', href: '/category?filter=best-seller' },
  { label: 'Delivery', href: '/category?filter=delivery' },
  { label: 'Lunch', href: '/category?category=lunch' },
];

const helpLinks = [
  { label: 'How to Order', href: '#' },
  { label: 'Payment Methods', href: '#' },
  { label: 'Track My Order', href: '/orders' },
  { label: 'FAQ', href: '#' },
  { label: 'Contact Us', href: '#' },
];

const socialLinks = [
  { name: 'Facebook', href: '#', icon: Facebook },
  { name: 'Instagram', href: '#', icon: Instagram },
  { name: 'LinkedIn', href: '#', icon: LinkedIn },
  { name: 'TikTok', href: '#', icon: Tiktok },
];

export function Footer() {
  return (
    <footer className='w-full border-t bg-neutral-950 border-neutral-300'>
      <div className='mx-auto flex w-full max-w-360 flex-col items-start gap-6 md:gap-0 md:flex-row md:justify-between py-10 md:py-20 px-4 md:px-30'>
        {/* Brand — Content Container */}
        <div className='flex flex-col gap-4 md:gap-10 w-full md:w-95 md:min-w-60'>
          <div className='flex flex-col gap-5.5'>
            {/* Logo */}
            <Link href='/'>
              <Image src={LogoColor} alt='Foody' className='w-37.25 h-10.5' />
            </Link>

            {/* Description + Social */}
            <p className='text-sm md:text-md text-neutral-25 tracking-tight-2'>
              Enjoy homemade flavors &amp; chef&apos;s signature dishes, freshly
              prepared every day. Order online or visit our nearest branch.
            </p>
          </div>
          <div className='flex flex-col items-start gap-5'>
            <p className='font-bold md:font-extrabold text-sm md:text-md tracking-tight-2 md:tracking-none text-center text-neutral-25'>
              Follow on Social Media
            </p>
            <div className='flex items-center gap-3'>
              {socialLinks.map((s) => (
                <a
                  key={s.name}
                  href={s.href}
                  aria-label={s.name}
                  className='w-10 h-10 border border-bs-neutral-800 flex items-center justify-center rounded-full transition-colors hover-dim'
                >
                  <Image src={s.icon} alt={s.name} className='w-full h-full' />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className='md:flex-1 flex flex-row w-full md:justify-end'>
          {/* Explore — E-Commerce Menu */}
          <div className='flex flex-col items-start gap-4 w-full md:ml-[clamp(24px,27.7vw-188.57px,210px)] md:gap-5 md:w-50'>
            <h3 className='font-extrabold text-sm md:text-md text-center text-neutral-25'>
              Explore
            </h3>
            <ul className='flex flex-col gap-4 md:gap-5'>
              {exploreLinks.map((l) => (
                <li key={l.label}>
                  <Link
                    href={l.href}
                    className='text-sm md:text-md tracking-tight-2 text-center text-neutral-25 transition-colors hover-dim'
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Help */}
          <div className='flex flex-col items-start gap-4 w-full md:ml-[clamp(24px,27.7vw-188.57px,210px)] md:gap-5 md:max-w-50'>
            <h3 className='font-extrabold text-sm md:text-md text-center text-neutral-25'>
              Help
            </h3>
            <ul className='flex flex-col gap-4 md:gap-5'>
              {helpLinks.map((l) => (
                <li key={l.label}>
                  <Link
                    href={l.href}
                    className='text-sm md:text-md tracking-tight-2 text-center text-neutral-25 transition-colors hover-dim'
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}
