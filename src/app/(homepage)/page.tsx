import { CONSTANTS } from '@/lib/constants';
import { getSessionDriverData } from '@/server-functions/api/get-session-driver-data';
import { getSessionLapData } from '@/server-functions/api/get-session-lap-data';
import { getSessionData } from '@/server-functions/api/get-session-data';
import { RaceDashboard } from '@/components/features/race-dashboard';

const Home = async () => {
  const sessionData = await getSessionData(CONSTANTS.raceSessionKey);
  const sessionDriverData = await getSessionDriverData(CONSTANTS.raceSessionKey);
  const sessionLapData = await getSessionLapData(CONSTANTS.raceSessionKey, 25);
  console.log('sessionData: ', sessionData);
  console.log('sessionDriverData: ', sessionDriverData);
  console.log('sessionLapData: ', sessionLapData);

  if (sessionData.hasError || sessionDriverData.hasError || sessionLapData.hasError) {
    return (
      <div className="p-6">
        <h1>Couldn’t load data</h1>
        <pre>{sessionData.errorMessage ?? sessionDriverData.errorMessage ?? sessionLapData.errorMessage}</pre>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-16 p-8">
      <RaceDashboard
        // Safe non-null assertion because we know the data is not null due to error checking above
        sessionStartTime={sessionData.data!.date_start!}
        sessionEndTime={sessionData.data!.date_end!}
        sessionDriverData={sessionDriverData.data!}
        initialLapsByDriver={sessionLapData.data!}
      />
    </div>
  );
};

export default Home;
