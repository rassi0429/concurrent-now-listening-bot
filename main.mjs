global.window = {
    btoa: function (str) {
        return Buffer.from(str, 'binary').toString('base64');
    },
    atob: function (b64Encoded) {
        return Buffer.from(b64Encoded, 'base64').toString('binary');
    }
};

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

/*
const user = await client.readCharacter(userAddress, Schemas.userstreams);
const homeStream = user.payload.body.homeStream;
*/

let lastTrack = null;

const checkLastFM = async () => {
    const response = await axios.get('http://ws.audioscrobbler.com/2.0/', {
        params: {
            method: 'user.getrecenttracks',
            user: lastFMUser,
            api_key: lastFMAPIKey,
            format: 'json'
        }
    });

    const track = response.data.recenttracks.track[0];

    if (lastTrack === null) {
        lastTrack = track;
    } else if (lastTrack['@attr'] && !track['@attr']) {
        console.log(`You just finished listening to ${lastTrack.name} by ${lastTrack.artist['#text']}`);
        lastTrack = track;
    } else if (track['@attr'] && track.name !== lastTrack.name) {
        console.log(`You are now listening to ${track.name} by ${track.artist['#text']}`);
        lastTrack = track;

        const messageBody = {
            body: `I'm listening to ${track.name} by ${track.artist['#text']} \n ![](${track.image[3]['#text']})`,
        };
        await client.createMessage(Schemas.simpleNote, messageBody, postStreams);
    }
}

setInterval(checkLastFM, 10000);
checkLastFM()
