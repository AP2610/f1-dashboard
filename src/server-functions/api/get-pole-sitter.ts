import { BaseReturnType } from '@/lib/types/api-types';
import { z } from 'zod';
import { getApiData } from './get-api-data';

const poleSitterSchema = z.object({
  driver_number: z.number(),
});

export type PoleSitter = z.infer<typeof poleSitterSchema>;

export const getPoleSitter = async (qualifyingSessionKey: number): Promise<BaseReturnType<PoleSitter>> => {
  const path = `/session_result?session_key=${qualifyingSessionKey}&position=1`;

  const schema = z.array(poleSitterSchema);

  const { hasError, errorMessage, data: poleSitter } = await getApiData<PoleSitter[]>(path, schema);

  if (hasError || poleSitter === null) {
    return { hasError, errorMessage, data: null };
  }

  return { hasError, errorMessage, data: poleSitter[0] };
};
