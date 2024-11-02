"use client"
import { VideoPreview, useCall } from '@stream-io/video-react-sdk';
import React, { useEffect, useState } from 'react'

const MeetingSetup = () => {
  const [isMicCamToggle, setIsMicCamToggle] = useState(false);
  const call = useCall();

  useEffect(() => {
    if (isMicCamToggle) {
      call?.camera?.enable();
      call?.microphone?.enable();
    } else {
      call?.camera?.disable();
      call?.microphone?.disable();
    }
  }, [isMicCamToggle, call?.camera, call?.microphone]);
  return (
    <div className=" flex-h h-screen w-full flex-col
    items-center justify-center gap-3 text-white">
      <h1 className="text-2xl font-bold">
        SetUp
      </h1>
      <VideoPreview />
    </div>
  )
}

export default MeetingSetup