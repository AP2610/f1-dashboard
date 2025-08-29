'use server';

import { CONSTANTS } from '@/lib/constants';
import { BaseReturnType } from '@/lib/types/api-types';
import { z } from 'zod';

// Generic function to fetch api data, validate it with a zod schema, handle errors and return the data
// Takes T as the type of the data to be returned
export const getApiData = async <T>(path: string, schema: z.ZodSchema<T>): Promise<BaseReturnType<T>> => {
  try {
    const response = await fetch(`${CONSTANTS.baseUrl}${path}`);

    if (!response.ok) {
      return {
        hasError: true,
        errorMessage: `Failed to fetch data from ${path}: ${response.statusText}`,
        data: null,
      };
    }

    const data = await response.json();

    // Validate the data with the zod schema
    const validatedData = schema.parse(data);

    return {
      hasError: false,
      errorMessage: null,
      data: validatedData,
    };
  } catch (error) {
    console.error(error);
    return {
      hasError: true,
      errorMessage: `An error occurred while fetching data from ${path}`,
      data: null,
    };
  }
};
