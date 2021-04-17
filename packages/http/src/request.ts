import type { IncomingMessage } from 'http';
import { useInject } from './hooks';

export function useRequest() {
  const req = useInject<IncomingMessage>('req');
}
