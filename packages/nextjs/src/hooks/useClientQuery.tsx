'use client'
import { cache } from 'react';
import useSWR from 'swr';
import type { SWRResponse } from 'swr';

/**
 * A custom hook that uses SWR (Stale-While-Revalidate) to fetch data from a given URL.
 * The URL can either be a string or a function that returns a string, null, or undefined.
 * If the URL is a function and it returns null or undefined, no request will be made.
 *
 * @template T The expected return type of the fetch request.
 * @param {(() => string | null | undefined) | string} url The URL to fetch data from, or a function that returns the URL.
 *
 * @example
 * const { data, error } = useClientQuery<string>('https://api.example.com/data');
 */
export function useClientQuery<T>(
  url: (() => string | null | undefined) | string,
): SWRResponse<T> {
  return useSWR<T>(
    url,
    cache((url: string) => fetch(url).then(r => r.json())),
  );
}
