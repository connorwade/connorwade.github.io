export function useState<T>(
  initialValue: T,
  afterUpdate: () => void = () => {},
  beforeUpdate: () => void = () => {},
) {
  let hook = {
    value: initialValue,
    set(newValue: T) {
      beforeUpdate();
      hook.value = newValue;
      afterUpdate();
    },
  };

  queueMicrotask(() => {
    hook.set(hook.value);
  });

  return hook;
}

function useSubscription(): {
  notify: () => void;
  subscribe: (callback: () => void) => () => void;
  unsubscribe: (callback: () => void) => void;
} {
  const eventName = "state-changed";
  const eventTarget = new EventTarget();

  function notify() {
    eventTarget.dispatchEvent(new CustomEvent(eventName));
  }

  function subscribe(callback: () => void) {
    eventTarget.addEventListener(eventName, callback);
    return () => unsubscribe(callback);
  }

  function unsubscribe(callback: () => void) {
    return eventTarget.removeEventListener(eventName, callback);
  }

  return { notify, subscribe, unsubscribe };
}

export function useStore<T, U>(
  {
    initialState,
    reducer,
  }: {
    initialState: T;
    reducer: (state: T, action: U) => T;
  },
  {
    useLocalStorage = false,
    key = "state",
  }: { useLocalStorage?: boolean; key?: string } = {
    useLocalStorage: false,
    key: "state",
  },
) {
  let state = initialState;

  const { notify, subscribe, unsubscribe } = useSubscription();

  const dispatch = (action: U) => {
    state = reducer(state, action);
    notify();
  };

  if (useLocalStorage) {
    if (localStorage.getItem(key) === null) {
      localStorage.setItem(key, JSON.stringify(initialState));
    } else {
      state = JSON.parse(localStorage.getItem(key)!);
    }
    subscribe(() => {
      localStorage.setItem(key, JSON.stringify(state));
    });
  }

  return { getState: () => state, dispatch, subscribe, unsubscribe };
}

export function useStore2<U>(
  {
    initialState,
    reducer,
  }: {
    initialState: Record<string, unknown>;
    reducer: (
      state: Record<string, unknown>,
      action: U,
    ) => Record<string, unknown>;
  },
  {
    useLocalStorage = false,
    key = "state",
  }: { useLocalStorage?: boolean; key?: string } = {
    useLocalStorage: false,
    key: "state",
  },
) {
  let state = initialState;
  let storageKeys = Object.keys(initialState).map(
    (stateKey) => `${key}:${stateKey}`,
  );

  const { notify, subscribe, unsubscribe } = useSubscription();

  const dispatch = (action: U) => {
    state = reducer(state, action);
    notify();
  };

  if (useLocalStorage) {
    for (let storageKey of storageKeys) {
      let stateKey = storageKey.split(":")[1];
      if (localStorage.getItem(storageKey) === null) {
        localStorage.setItem(
          storageKey,
          String(initialState[stateKey]), // might still need a JSON parse if you're storing objects
        );
      } else {
        // you will have to resolve the type of the state value here to have proper conversion
        let stateType = typeof state[stateKey];
        if (stateType === "number") {
          state[stateKey] = Number(localStorage.getItem(storageKey));
        } else if (stateType === "boolean") {
          state[stateKey] = Boolean(localStorage.getItem(storageKey));
        } else {
          state[stateKey] = localStorage.getItem(storageKey);
        }
      }
      subscribe(() => {
        // check if state is dirty, if so, update local storage
        if (state[stateKey] !== localStorage.getItem(storageKey)) {
          requestIdleCallback(() => {
            localStorage.setItem(storageKey, String(state[stateKey]));
          });
        }
      });
    }
  }

  return { getState: () => state, dispatch, subscribe, unsubscribe };
}

export function useSignal<T>(initialState: T) {
  const initialNode: {
    value: T;
  } = {
    value: initialState,
  };

  const sideEffects: {
    effect: () => void;
    dependencies: any[];
  }[] = [];

  function set(newState: T) {
    if (initialNode.value === newState) return;
    initialNode.value = newState;

    for (let { effect, dependencies } of sideEffects) {
      if (
        dependencies.length === 0 ||
        dependencies.some((d) => {
          d.__node.update();
          return d.__node.dirty;
        })
      ) {
        effect();
      }
    }
  }

  function get() {
    return initialNode.value;
  }

  function derive(deriveCallback: () => any) {
    const derivedNode = {
      value: deriveCallback(),
      derivedFrom: initialNode.value,
      dirty: false,
      update: () => {
        if (initialNode.value !== derivedNode.derivedFrom) {
          derivedNode.derivedFrom = initialNode.value;
          const nextVal = deriveCallback();
          if (derivedNode.value !== nextVal) {
            derivedNode.value = nextVal;
            derivedNode.dirty = true;
          }
        }
      },
    };

    function get() {
      derivedNode.update();
      derivedNode.dirty = false;
      return derivedNode.value;
    }

    return { get, __node: derivedNode };
  }

  function useEffect(effect: () => void, dependencies: any[]) {
    sideEffects.push({ effect, dependencies });
  }

  return { set, get, derive, useEffect };
}
