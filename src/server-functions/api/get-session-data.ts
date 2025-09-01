'use server';

import { z } from 'zod';
import { BaseReturnType } from '@/lib/types/api-types';
import { getApiData } from './get-api-data';
import path from 'path';
import { promises as fs } from 'fs';

const sessionApiDataSchema = z.object({
  session_name: z.string(),
  date_start: z.string().transform((val) => (val ? Date.parse(val) : null)),
  date_end: z.string().transform((val) => (val ? Date.parse(val) : null)),
  location: z.string(),
});

export type SessionData = z.infer<typeof sessionApiDataSchema>;

export const getSessionData = async (raceSessionKey: number): Promise<BaseReturnType<SessionData>> => {
  if (process.env.NEXT_PUBLIC_USE_BACKUP_DATA === 'true') {
    try {
      const filePath = path.join(process.cwd(), 'src/lib/backup-json/session-data.json');
      const raw = await fs.readFile(filePath, 'utf-8');
      const arr = JSON.parse(raw) as Array<{
        session_key: number;
        session_name: string;
        date_start: string;
        date_end: string;
        location: string;
      }>;
      const item = arr[0];

      if (!item) {
        return { hasError: true, errorMessage: 'No backup session data found', data: null };
      }

      const data: SessionData = {
        session_name: item.session_name,
        date_start: item.date_start ? Date.parse(item.date_start) : null,
        date_end: item.date_end ? Date.parse(item.date_end) : null,
        location: item.location,
      };
      return { hasError: false, errorMessage: null, data };
    } catch (e: unknown) {
      return { hasError: true, errorMessage: e instanceof Error ? e.message : 'Failed to read backup session data', data: null };
    }
  }

  const endpoint = `/sessions?session_key=${raceSessionKey}`;

  // Validated the data is an array of session data
  const schema = z.array(sessionApiDataSchema);

  const { hasError, errorMessage, data: sessionData } = await getApiData<SessionData[]>(endpoint, schema);

  if (hasError || sessionData === null) {
    return { hasError, errorMessage, data: null };
  }

  // Return the first session data because we only have one final race session
  return { hasError, errorMessage, data: sessionData[0] };
};
