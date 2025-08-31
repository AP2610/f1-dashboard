'use server';

import { z } from 'zod';
import { type BaseReturnType } from '@/lib/types/api-types';
import { getApiData } from './get-api-data';

const sessionResultSchema = z.object({
  position: z.number().nullable(),
  driver_number: z.number(),
});

export type SessionResult = z.infer<typeof sessionResultSchema>;

export const getSessionResult = async (sessionKey: number): Promise<BaseReturnType<SessionResult[]>> => {
  const path = `/session_result?session_key=${sessionKey}`;
  const schema = z.array(sessionResultSchema);

  const { hasError, errorMessage, data: sessionResult } = await getApiData<SessionResult[]>(path, schema);

  if (hasError || sessionResult === null) {
    return { hasError, errorMessage, data: null };
  }

  return { hasError, errorMessage, data: sessionResult };
};
