import { CarDetailContainer } from './CarDetailContainer';

type PageProps = {
  params: {
    id: string;
  };
};

export default async function Page({ params }: PageProps) {
  const { id } = await Promise.resolve(params);
  return <CarDetailContainer id={id} />;
}
