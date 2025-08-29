import { TrackSvg } from '@/components/features/track/track-svg';
import { CONSTANTS } from '@/lib/constants';
import { getSessionDriverData } from '@/server-functions/api/get-session-driver-data';
import { getSessionLapData } from '@/server-functions/api/get-session-lap-data';
import { getSessionData } from '@/server-functions/api/get-session-data';

const Home = async () => {
  const sessionData = await getSessionData(CONSTANTS.sessionKey);
  const sessionDriverData = await getSessionDriverData(CONSTANTS.sessionKey);
  const sessionLapData = await getSessionLapData(CONSTANTS.sessionKey, 3);
  console.log('sessionData: ', sessionData);
  console.log('sessionDriverData: ', sessionDriverData);
  console.log('sessionLapData: ', sessionLapData);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-16 p-8 pb-20 sm:p-20">
      <TrackSvg />
    </div>
  );
};

export default Home;
