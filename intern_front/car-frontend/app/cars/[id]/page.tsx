import { CarDetailContainer } from './CarDetailContainer';

export default function Page({ params }: { params: { id: string } }) {
  return <CarDetailContainer id={params.id} />;
}
