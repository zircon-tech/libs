'use client';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';

/**
 * A custom React hook to handle query parameters.
 *
 * This hook provides two functions: `getParam` and `setParams`.
 * - `getParam` retrieves the value of a query parameter by its key.
 * - `setParams` sets the value of one or more query parameters.
 */
export default function useQueryParam() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  /**
   * `setParams` is a function that takes an object as a parameter, where each key-value pair represents a query parameter to set.
   * If the value for a key is `undefined`, the query parameter with that key will be removed.
   * This function does not return anything.
   */
  function setParams(params: { [key: string]: string | undefined }) {
    const newParams = new URLSearchParams(searchParams?.toString());
    Object.entries(params).forEach(([key, value]) => {
      value !== undefined ? newParams.set(key, value) : newParams.delete(key);
    });
    router.replace(`${pathname}?${newParams}`, { scroll: false });
  }

  /**
   * `getParam` is a function that takes a string as a parameter, which represents the key of the query parameter you want to retrieve.
   * It returns the value of the query parameter as a string if it exists, or `null` if it does not.
   */
  function getParam(key: string) {
    const params = new URLSearchParams(searchParams?.toString());
    return params.get(key);
  }

  return { getParam, setParams };
}
