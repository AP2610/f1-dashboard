import { SessionInitialiser } from '@/components/features/session-initialiser';
import { Standings } from '@/components/features/standings';
import { TrackMap } from '@/components/features/track-map';
import { PlaybackControls } from '@/components/features/track-map/playback-controls';
import { Section } from '@/components/layout/section';
import { CONSTANTS } from '@/lib/constants';
import { getSessionData } from '@/server-functions/api/get-session-data';
import { getSessionDriverData } from '@/server-functions/api/get-session-driver-data';
import { getSessionLapData } from '@/server-functions/api/get-session-lap-data';
import { getSessionResult } from '@/server-functions/api/get-session-result';

const Home = async () => {
  const sessionData = await getSessionData(CONSTANTS.raceSessionKey);
  const sessionDriverData = await getSessionDriverData(CONSTANTS.raceSessionKey);
  const sessionLapData = await getSessionLapData(CONSTANTS.raceSessionKey, 25);
  const qualifyingSessionResultData = await getSessionResult(CONSTANTS.quallifyingSessionKey);
  console.log('driverData-page: ', sessionDriverData);

  if (sessionData.hasError || sessionDriverData.hasError || sessionLapData.hasError || qualifyingSessionResultData.hasError) {
    return (
      <div className="p-6">
        <h1>Couldn’t load data</h1>
        <pre>{sessionData.errorMessage ?? sessionDriverData.errorMessage ?? sessionLapData.errorMessage}</pre>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-16 p-8">
      {/* Component returns nothing, just inits the session, driver data and laps in the stores */}
      <SessionInitialiser
        sessionStartTime={sessionData.data!.date_start!}
        initialCurrentTime={sessionData.data!.date_start!}
        sessionEndTime={sessionData.data!.date_end!}
        sessionDriverData={sessionDriverData.data!}
        initialLapsByDriver={sessionLapData.data!}
        qualifyingPositionData={qualifyingSessionResultData.data!}
      />

      <Section isFullWidth className="grid grid-cols-12 gap-8">
        {/* Standings */}
        <div className="col-span-3 space-y-8">
          <Standings />
        </div>

        <div className="col-span-9 space-y-8">
          {/* Replace with heading component */}
          <h2>Track Map</h2>

          <div className="grid grid-cols-12 gap-8">
            {/* Replace with button component */}
            <div className="col-span-3">
              <div className="flex flex-col gap-4">
                <PlaybackControls />
              </div>
            </div>

            <div className="col-span-9 mx-auto">
              <TrackMap />
            </div>
          </div>
        </div>
      </Section>
    </div>
  );
};

export default Home;
