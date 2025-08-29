'use server';

import { z } from 'zod';
import { BaseReturnType } from '@/lib/types/api-types';
import { getApiData } from './get-api-data';

const sessionApiDataSchema = z.object({
  session_name: z.string(),
  date_start: z.string().transform((val) => (val ? Date.parse(val) : null)),
  date_end: z.string().transform((val) => (val ? Date.parse(val) : null)),
  location: z.string(),
});

type SessionData = z.infer<typeof sessionApiDataSchema>;

export const getSessionData = async (sessionKey: number): Promise<BaseReturnType<SessionData>> => {
  const path = `/sessions?session_key=${sessionKey}`;

  // Validated the data is an array of session data
  const schema = z.array(sessionApiDataSchema);

  // Pass SessionData[] as the type of the data to be returned
  const { hasError, errorMessage, data: sessionData } = await getApiData<SessionData[]>(path, schema);

  if (hasError || sessionData === null) {
    return { hasError, errorMessage, data: null };
  }

  // Return the first session data because we only have one final race session
  return { hasError, errorMessage, data: sessionData[0] };
};
