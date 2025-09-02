import { SessionInitialiser } from '@/components/features/session-initialiser';
import { Standings } from '@/components/features/standings';
import { TrackMap } from '@/components/features/track-map';
import { PlaybackControls } from '@/components/features/track-map/playback-controls';
import { Section } from '@/components/layout/section';
import { CONSTANTS } from '@/lib/constants';
import { getSessionData } from '@/server-functions/api/get-session-data';
import { getLapsForDriverData } from '@/server-functions/api/get-laps-for-driver-data';
import { getSessionResult } from '@/server-functions/api/get-session-result';
import { getSessionDriverDataWithQualifying } from '@/server-functions/api/get-session-driver-data-with-qualifying';
import { Scrubber } from '@/components/features/scrubber';

const Home = async () => {
  const sessionData = await getSessionData(CONSTANTS.raceSessionKey);
  const sessionDriverDataWithQualifying = await getSessionDriverDataWithQualifying(
    CONSTANTS.raceSessionKey,
    CONSTANTS.quallifyingSessionKey,
  );
  const sessionLapData = await getLapsForDriverData(CONSTANTS.raceSessionKey, 3);
  const qualifyingSessionResultData = await getSessionResult(CONSTANTS.quallifyingSessionKey);

  if (
    sessionData.hasError ||
    sessionDriverDataWithQualifying.hasError ||
    sessionLapData.hasError ||
    qualifyingSessionResultData.hasError
  ) {
    return (
      <div className="p-6">
        <h1>Couldn’t load data</h1>

        <p>{sessionData.errorMessage ?? sessionDriverDataWithQualifying.errorMessage ?? sessionLapData.errorMessage}</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-16 p-8">
      {/* Component returns nothing, just inits the session, driver data and laps in the stores */}
      <SessionInitialiser
        sessionStartTimeMs={sessionData.data!.date_start!}
        initialCurrentTime={sessionData.data!.date_start!}
        sessionEndTime={sessionData.data!.date_end!}
        sessionDriverDataWithQualifying={sessionDriverDataWithQualifying.data!}
        initialLapsByDriver={sessionLapData.data!}
        qualifyingPositionData={qualifyingSessionResultData.data!}
      />

      <Section isFullWidth className="grid grid-cols-12 gap-8">
        {/* Standings */}
        <div className="col-span-3 flex flex-col gap-4 space-y-8">
          <PlaybackControls />

          <Scrubber />
        </div>

        <div className="col-span-3 max-h-[calc(100vh-100px)] space-y-8 overflow-y-auto">
          <Standings />
        </div>

        <div className="col-span-6 mb-auto space-y-8 rounded-md bg-black/90 p-6 shadow-lg">
          <TrackMap />
        </div>
      </Section>
    </div>
  );
};

export default Home;
