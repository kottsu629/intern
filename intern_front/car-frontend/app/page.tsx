import { HomeContainer } from './home/HomeContainer';

export default function Page({ searchParams }: { searchParams: { id?: string } }) {
  const id = searchParams.id;
  if (!id) return <div className="p-20 text-center text-red-500 font-bold">Error: ID parameter is required.</div>;
  return <HomeContainer id={id} />;
}