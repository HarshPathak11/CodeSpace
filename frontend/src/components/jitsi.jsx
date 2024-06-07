import React from "react";

import { JitsiMeeting} from '@jitsi/react-sdk'

export const JitsiMeetingComponent=()=>{
    const roomname="dummyroom"
    const domain="meet.jit.si"

    return(
        <div className="h-[100vh] grid flex-col">
            <JitsiMeeting
            roomName={roomname}
            diplayName={"Harsh"}
            domain={domain}
            >
            </JitsiMeeting>
        </div>
    )
}