import type { Car } from '../../types';
import { CarDetailPresentation } from './CarDetailPresentation';

export function CarDetailContainer(props: { id: string; initialCar: Car }) {
  const { id, initialCar } = props;

  const carId = Number(id);

  return <CarDetailPresentation carId={carId} car={initialCar} />;
}