import { CarDetailContainer } from './CarDetailContainer';

export default async function Page({ params }: any) {
  const { id } = await Promise.resolve(params);
  return <CarDetailContainer id={id} />;
}
