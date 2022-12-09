import { createClient } from "@liveblocks/client";
import { createRoomContext } from "@liveblocks/react";


const LIVEBLOCKS_API_KEY = process.env.REACT_APP_LIVEBLOCKS_PUBLIC_KEY;

const client = createClient({
  publicApiKey: LIVEBLOCKS_API_KEY,
});

export const {
  suspense: {
    RoomProvider,
    useMutation,
    useOthers,
    useStorage,
    useUpdateMyPresence,
  },
} = createRoomContext(client);
