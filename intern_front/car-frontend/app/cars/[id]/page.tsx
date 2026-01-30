'use client';

import { useParams } from 'next/navigation';
import { CarDetailContainer } from './CarDetailContainer';

export default function Page() {
  const params = useParams<{ id: string }>();
  return <CarDetailContainer id={params?.id ?? ''} />;
}
