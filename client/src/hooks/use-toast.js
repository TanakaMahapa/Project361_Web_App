import * as React from "react";
import { toast } from "sonner";

const TOAST_LIMIT = 1;
const TOAST_REMOVE_DELAY = 1000000;

export const ACTION_TYPES = {
    ADD_TOAST: "ADD_TOAST",
    UPDATE_TOAST: "UPDATE_TOAST",
    DISMISS_TOAST: "DISMISS_TOAST",
    REMOVE_TOAST: "REMOVE_TOAST",
  };
  
  let count = 0;
  
  export function genId() {
    count = (count + 1) % Number.MAX_SAFE_INTEGER;
    return count.toString();
  }
  
  const toastTimeouts = new Map();
  
  export const addToRemoveQueue = (toastId, dispatch, TOAST_REMOVE_DELAY) => {
    if (toastTimeouts.has(toastId)) return;
  
    const timeout = setTimeout(() => {
      toastTimeouts.delete(toastId);
      dispatch({
        type: ACTION_TYPES.REMOVE_TOAST,
        toastId,
      });
    }, TOAST_REMOVE_DELAY);
  
    toastTimeouts.set(toastId, timeout);
  };
  
  export const reducer = (state, action) => {
    switch (action.type) {
      case ACTION_TYPES.ADD_TOAST:
        return {
          ...state,
          toasts: [action.toast, ...state.toasts].slice(0, TOAST_LIMIT),
        };
  
      case ACTION_TYPES.UPDATE_TOAST:
        return {
          ...state,
          toasts: state.toasts.map((t) =>
            t.id === action.toast.id ? { ...t, ...action.toast } : t
          ),
        };
  
      case ACTION_TYPES.DISMISS_TOAST: {
        const { toastId } = action;
  
        if (toastId) {
          addToRemoveQueue(toastId, action.dispatch, TOAST_REMOVE_DELAY);
        } else {
          state.toasts.forEach((toast) => {
            addToRemoveQueue(toast.id, action.dispatch, TOAST_REMOVE_DELAY);
          });
        }
  
        return {
          ...state,
          toasts: state.toasts.map((t) =>
            t.id === toastId || toastId === undefined
              ? { ...t, open: false }
              : t
          ),
        };
      }
  
      case ACTION_TYPES.REMOVE_TOAST:
        if (action.toastId === undefined) {
          return { ...state, toasts: [] };
        }
        return {
          ...state,
          toasts: state.toasts.filter((t) => t.id !== action.toastId),
        };
  
      default:
        return state;
    }
  };
  
const listeners = [];
let memoryState = { toasts: [] };

function dispatch(action) {
  memoryState = reducer(memoryState, action);
  listeners.forEach((listener) => {
    listener(memoryState);
  });
}

function toasts(props) {
  const id = genId();

  const update = (props) =>
    dispatch({
      type: "UPDATE_TOAST",
      toast: { ...props, id },
    });

  const dismiss = () => dispatch({ type: "DISMISS_TOAST", toastId: id });

  dispatch({
    type: "ADD_TOAST",
    toast: {
      ...props,
      id,
      open: true,
      onOpenChange: (open) => {
        if (!open) dismiss();
      },
    },
  });

  return {
    id,
    dismiss,
    update,
  };
}

function useToast() {
  const [state, setState] = React.useState(memoryState);

  React.useEffect(() => {
    listeners.push(setState);
    return () => {
      const index = listeners.indexOf(setState);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    };
  }, [state]);

  return {
    ...state,
    toast,
    dismiss: (toastId) => dispatch({ type: "DISMISS_TOAST", toastId }),
  };
}

export { useToast, toasts };
