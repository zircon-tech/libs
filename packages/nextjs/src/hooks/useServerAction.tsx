'use client';
import { useTransition } from 'react';

type Props = {
  cb: (body?: any) => Promise<unknown>;
  onSuccess?: (result: unknown) => void;
  onError?: () => void;
};

/**
 * A custom React hook to handle server actions.
 *
 * @param {Object} props - The properties for the hook.
 * @param {Function} props.cb - The callback function to be executed. It should return a Promise.
 * @param {Function} [props.onSuccess] - The function to be executed when the callback is successful. It receives the result of the callback as a parameter.
 * @param {Function} [props.onError] - The function to be executed when an error occurs.
 *
 * @returns {Object} An object containing the loading state and the transition function.
 *
 * @example
 * const { loading, transition } = useServerAction({
 *   cb: async () => { ... },
 *   onSuccess: result => { ... },
 *   onError: () => { ... },
 * });
 *
 * @note This hook requires the `experimental.serverActions` property to be set to `true` in your `next.config.js` file.
 */
export default function useServerAction(props: Props) {
  let [loading, startTransition] = useTransition();

  const transition = (body?: any) => {
    try {
      startTransition(async () => {
        try {
          const result = await props.cb(body);
          props.onSuccess?.(result);
        } catch (err) {
          props.onError?.();
        }
      });
    } catch (err) {
      props.onError?.();
    }
  };

  return { loading, transition };
}
