import React, {
  useRef,
  createContext,
  useContext,
  FC,
  PropsWithChildren,
  useEffect,
} from 'react';
import { EventEmitter } from 'events';
import { createComposableWithProps } from '@grexie/compose';

class RefetchController extends EventEmitter {
  constructor() {
    super();
    this.setMaxListeners(1000);
  }

  refetch = () => {
    this.emit('refetch');
  };

  subscribe(listener: () => void) {
    this.on('refetch', listener);
    return () => {
      this.removeListener('refetch', listener);
    };
  }

  setInterval = (ms: number) => {
    const interval = setInterval(() => {
      this.emit('refetch');
    }, ms);

    return () => clearInterval(interval);
  };
}

const RefetchContext = createContext<RefetchController | null>(null);

interface RefetchProviderProps {
  interval?: number;
}

const RefetchProvider: FC<PropsWithChildren<RefetchProviderProps>> = ({
  children,
  interval,
}) => {
  const controller = useRef(new RefetchController());

  useEffect(() => {
    if (interval) {
      return controller.current.setInterval(interval);
    } else {
      return;
    }
  }, [interval]);

  return (
    <RefetchContext.Provider value={controller.current}>
      {children}
    </RefetchContext.Provider>
  );
};

const withRefetchProvider =
  createComposableWithProps<RefetchProviderProps>(RefetchProvider);

const useRefetch = () => useContext(RefetchContext);

export { RefetchProvider, withRefetchProvider, useRefetch };
