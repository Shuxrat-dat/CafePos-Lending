import { Table } from '@/types/restaurant';

export const initialTables: Table[] = [
  {
    id: 'table-1',
    number: 1,
    status: 'free',
    position: { x: 20, y: 20 },
    capacity: 2,
  },
  {
    id: 'table-2',
    number: 2,
    status: 'free',
    position: { x: 50, y: 20 },
    capacity: 4,
  },
  {
    id: 'table-3',
    number: 3,
    status: 'free',
    position: { x: 80, y: 20 },
    capacity: 2,
  },
  {
    id: 'table-4',
    number: 4,
    status: 'free',
    position: { x: 20, y: 60 },
    capacity: 4,
  },
  {
    id: 'table-5',
    number: 5,
    status: 'free',
    position: { x: 50, y: 60 },
    capacity: 6,
  },
  {
    id: 'table-6',
    number: 6,
    status: 'free',
    position: { x: 80, y: 60 },
    capacity: 4,
  },
];
