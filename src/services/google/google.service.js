import { gapi } from "gapi-script";
import { CLIENT_ID, SCOPES, API_KEY } from "./google.config";

export const initGoogleAPI = async (setAccessToken) => {
  return new Promise((resolve, reject) => {
    gapi.load("client", async () => {
      try {
        await gapi.client.init({
          apiKey: API_KEY,
          discoveryDocs: [
            "https://www.googleapis.com/discovery/v1/apis/youtube/v3/rest",
          ],
        });

        const tokenClient = window.google.accounts.oauth2.initTokenClient({
          client_id: CLIENT_ID,
          scope: SCOPES,
          callback: (tokenResponse) => {
            gapi.client.setToken(tokenResponse);
            setAccessToken(tokenResponse.access_token);
          },
        });

        resolve(tokenClient);
      } catch (err) {
        console.error("GAPI Init Error:", err);
        reject(err);
      }
    });
  });
};
