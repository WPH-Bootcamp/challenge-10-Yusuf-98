'use client';

import { useState } from 'react';
import Image from 'next/image';
import { X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface ChangeAddressModalProps {
  initialAddress: string;
  initialPhone: string;
  avatar?: string;
  onClose: () => void;
  onSave: (address: string, phone: string) => void;
}

export function ChangeAddressModal({
  initialAddress,
  initialPhone,
  avatar,
  onClose,
  onSave,
}: ChangeAddressModalProps) {
  const [address, setAddress] = useState(initialAddress);
  const [phone, setPhone] = useState(initialPhone);
  const [error, setError] = useState('');

  function handleOk() {
    if (address.trim().length < 10) {
      setError('Alamat minimal 10 karakter');
      return;
    }
    onSave(address.trim(), phone.trim());
    onClose();
  }

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4'>
      <div className='w-full max-w-md rounded-2xl bg-white p-6 shadow-xl'>
        <div className='mb-5 flex items-center justify-between'>
          <h2 className='text-xl font-extrabold text-neutral-950'>
            Change Address
          </h2>
          <button
            type='button'
            onClick={onClose}
            className='text-neutral-500 hover:text-neutral-900'
          >
            <X className='h-5 w-5' />
          </button>
        </div>

        <div className='mb-5 flex items-center justify-center'>
          <div className='relative h-16 w-16 overflow-hidden rounded-full bg-neutral-100'>
            {avatar ? (
              <Image
                src={avatar}
                alt='Avatar'
                fill
                className='object-cover'
                unoptimized
              />
            ) : (
              <div className='flex h-full w-full items-center justify-center text-2xl font-bold text-neutral-400'>
                ?
              </div>
            )}
          </div>
        </div>

        <div className='space-y-3'>
          <Input
            placeholder='Full delivery address (min. 10 characters)'
            value={address}
            onChange={(e) => {
              setAddress(e.target.value);
              if (error) setError('');
            }}
            error={error || undefined}
          />
          <Input
            placeholder='Phone number'
            type='tel'
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </div>

        <div className='mt-6 flex gap-3'>
          <Button
            type='button'
            variant='outline'
            className='flex-1'
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button type='button' className='flex-1' onClick={handleOk}>
            OK
          </Button>
        </div>
      </div>
    </div>
  );
}
