import Image from 'next/image';
import StarIcon from '@/assets/icons/star.png';
import CheckboxTicked from '@/assets/icons/checkbox-ticked.png';
import CheckboxUnticked from '@/assets/icons/checkbox-unticked.png';

interface FilterPanelProps {
  selectedRange: string;
  setSelectedRange: (value: string) => void;
  priceMin: string;
  setPriceMin: (value: string) => void;
  priceMax: string;
  setPriceMax: (value: string) => void;
  selectedRatings: number[];
  toggleRating: (r: number) => void;
}

const distances = [
  { label: 'Nearby', value: 'nearby' },
  { label: 'Within 1 km', value: '1' },
  { label: 'Within 3 km', value: '3' },
  { label: 'Within 5 km', value: '5' },
];

export function FilterPanel({
  selectedRange,
  setSelectedRange,
  priceMin,
  setPriceMin,
  priceMax,
  setPriceMax,
  selectedRatings,
  toggleRating,
}: FilterPanelProps) {
  return (
    <div className='flex flex-col py-4 gap-3 md:gap-6'>
      <div className='flex flex-col px-4 gap-2.5'>
        <p className='h-7.5 text-md font-bold tracking-tight-2 md:font-extrabold text-neutral-950'>
          FILTER
        </p>

        {/* Distance */}
        <div className='flex flex-col gap-2.5'>
          <p className='h-7.5 md:h-8 text-md md:text-lg md:tracking-tight-2 font-extrabold text-neutral-950'>
            Distance
          </p>
          <div className='flex flex-col gap-2.5'>
            {distances.map((d) => {
              const checked = selectedRange === d.value;
              return (
                <label
                  key={d.value}
                  className='h-7 md:h-7.5 flex cursor-pointer items-center gap-2'
                >
                  <input
                    type='checkbox'
                    checked={checked}
                    onChange={() => setSelectedRange(checked ? '' : d.value)}
                    className='sr-only'
                  />
                  <Image
                    src={checked ? CheckboxTicked : CheckboxUnticked}
                    alt=''
                    width={20}
                    height={20}
                  />
                  <span className='text-sm md:text-md tracking-tight-2 text-neutral-950'>
                    {d.label}
                  </span>
                </label>
              );
            })}
          </div>
        </div>
      </div>

      <hr className='border-neutral-300 mx-4 md:mx-0' />

      {/* Price */}
      <div className='flex flex-col px-4 gap-2.5'>
        <p className='h-7.5 md:h-8 text-md md:text-lg md:tracking-tight-2 font-extrabold text-neutral-950'>
          Price
        </p>
        <div className='flex flex-col gap-2.5'>
          <div className='h-12 md:h-13.5 flex items-center gap-2 rounded-md border border-neutral-300 p-2'>
            <span className='flex h-9.5 w-9.5 shrink-0 p-2 items-center justify-center rounded-xs bg-neutral-100 text-sm md:text-md font-semibold md:font-bold tracking-tight-2 text-neutral-950'>
              Rp
            </span>
            <input
              type='number'
              placeholder='Minimum Price'
              value={priceMin}
              onChange={(e) => setPriceMin(e.target.value)}
              className='w-full text-sm md:text-md text-neutral-950 placeholder:text-neutral-500 placeholder:text-sm md:placeholder:text-md placeholder:tracking-tight-2 focus:outline-none'
            />
          </div>
          <div className='h-12 md:h-13.5 flex items-center gap-2 rounded-md border border-neutral-300 p-2'>
            <span className='flex h-9.5 w-9.5 shrink-0 p-2 items-center justify-center rounded-xs bg-neutral-100 text-sm md:text-md font-semibold md:font-bold tracking-tight-2 text-neutral-950'>
              Rp
            </span>
            <input
              type='number'
              placeholder='Maximum Price'
              value={priceMax}
              onChange={(e) => setPriceMax(e.target.value)}
              className='w-full text-sm md:text-md text-neutral-950 placeholder:text-neutral-500 placeholder:text-sm md:placeholder:text-md placeholder:tracking-tight-2 focus:outline-none'
            />
          </div>
        </div>
      </div>

      <hr className='border-neutral-300 mx-4 md:mx-0' />

      {/* Rating */}
      <div className='flex flex-col px-4 gap-2.5'>
        <p className='h-7.5 md:h-8 text-md md:text-lg md:tracking-tight-2 font-extrabold text-neutral-950'>
          Rating
        </p>
        <div className='flex flex-col '>
          {[5, 4, 3, 2, 1].map((r) => {
            const checked = selectedRatings.includes(r);
            return (
              <label
                key={r}
                className='h-11 md:h-11.5 flex cursor-pointer items-center p-2 gap-1 md:gap-2'
              >
                <input
                  type='checkbox'
                  checked={checked}
                  onChange={() => toggleRating(r)}
                  className='sr-only'
                />
                <Image
                  src={checked ? CheckboxTicked : CheckboxUnticked}
                  alt=''
                  width={20}
                  height={20}
                />
                <span className='flex items-center gap-0.5 text-sm md:text-md tracking-tight-2 text-neutral-950'>
                  <Image src={StarIcon} alt='Star' width={24} height={24} />
                  {r}
                </span>
              </label>
            );
          })}
        </div>
      </div>
    </div>
  );
}
