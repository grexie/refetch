# Grexie Refetch

A simple refetch manager for React.

Grexie Refetch allows you to install a refetch manager with an interval wrapped around your root app component. Child components can subscribe to the refetch manager and the subscribe handler will be called on the interval.

## Installing

```bash
yarn add @grexie/refetch
```

## Usage

Wrap your root app component with RefetchProvider, passing in an optional interval in milliseconds. If the interval is specified then `RefetchController#setInterval` will be called in a `useEffect` hook to set up refetch events on the interval.

```typescript
import { RefetchProvider, useRefetch } from '@grexie/refetch';

const WrappedApp = (
  <RefetchProvider interval={15_000}>
    <App />
  </RefetchProvider>
);

const SubComponent = () => {
  ...
  const refetchController = useRefetch();

  useEffect(() => {
    return refetchController.subscribe(() => {
      ... perform refetch ...
    });
  }, []);
  ...
};
```

A composable is provided which can be used with `@grexie/compose`:

```typescript
import { withRefetchProvider } from '@grexie/refetch';

const ComposeApp = compose(withRefetchProvider({ interval: 15_000 }), App);
```

If you'd prefer to control the interval in a child component of your App then you can do so by calling `RefetchController#setInterval`:

```typescript
const SubComponent = () => {
  ...
  const refetchController = useRefetch();

  useEffect(() => {
    return refetchController.setInterval(15_000);
  }, []);
  ...
};
```

Both `RefetchController#setInterval` and `RefetchController#subscribe` return hook cleanup handlers to return from the hook so that state updates don't happen once the component is unmounted.

`RefetchController` is an `EventEmitter`, so you can subscribe to events manually by calling `refetchController.on('refetch', handler)` and removing an installed handler by doing `refetchController.removeListener('refetch', handler)`. This is what `RefetchController#subscribe` does internally.
