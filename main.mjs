import {Client, Schemas} from "@concurrent-world/client";
import axios from "axios";

// concurrent settings
const userAddress = process.env.CCID;
const privateKey = process.env.PRIVATE_KEY;
const host = process.env.CONCURRENT_HOST;
const clientSig = "lastfm-nau-listening";
const postStreams = process.env.CONCURENT_POST_STREAMS.split(',');

// last.fm settings
const lastFMUser = process.env.LASTFM_API_USER;
const lastFMAPIKey = process.env.LASTFM_API_KEY;

const client = new Client(userAddress, privateKey, host, clientSig);


const getRecentTrack = async () => {
    const response = await axios.get('http://ws.audioscrobbler.com/2.0/', {
        params: {
            method: 'user.getrecenttracks',
            user: lastFMUser,
            api_key: lastFMAPIKey,
            format: 'json'
        }
    });

    return response.data.recenttracks.track[0];
}


let lastTrack = null;
const main = async () => {
    const track = await getRecentTrack();

    if ((track['@attr'] && track.name !== lastTrack?.name)) {
        if (track['@attr']) {
            console.log(`You are now listening to ${track.name} by ${track.artist['#text']}`);
            const messageBody = {
                body: `I'm listening to ${track.name} by ${track.artist['#text']} \n ![](${track.image[3]['#text']})`,
            };
            await client.createMessage(Schemas.simpleNote, messageBody, postStreams);
        }
        lastTrack = track;
    }
}

setInterval(main, 10000);
main()
