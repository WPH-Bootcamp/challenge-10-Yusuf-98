// --- Server Component: Resto Detail Page ---
import { getRestaurantByIdServer } from '@/lib/api/server';
import RestoDetailClient from '@/components/features/resto/RestoDetailClient';

type Props = { params: Promise<{ id: string }> };

export default async function RestoDetailPage({ params }: Props) {
  // --- Fetch Data on Server ---
  const { id } = await params;
  const resto = await getRestaurantByIdServer(id);

  // --- Render Client Component with Server Data ---
  return <RestoDetailClient resto={resto} id={id} />;
}
