'use server';

export const loadSessionData = async (sessionKey: number) => {
  try {
    const sessionData = await fetch(`https://api.f1.com/v3/sessions/${sessionKey}`);
    const sessionDataJson = await sessionData.json();

    console.log(sessionDataJson);

    if (!sessionDataJson) {
      throw new Error('No session data found');
    }

    return sessionDataJson;
  } catch (error) {
    console.error(error);
    return null;
  }
};
