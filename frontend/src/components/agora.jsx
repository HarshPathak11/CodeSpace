
import React from 'react'
import {AgoraRTCProvider, useJoin, LocalVideoTrack, RemoteUser, useLocalCameraTrack, useLocalMicrophoneTrack, usePublish, useRTCClient, useRemoteAudioTracks, useRemoteUsers} from 'agora-rtc-react'
import AgoraRTC from 'agora-rtc-sdk-ng'

export function Call(props) {
  const client = useRTCClient(AgoraRTC.createClient({ mode: 'rtc', codec: 'vp8' }))

  return (
    <AgoraRTCProvider client={client}>
      <AudioCall room={props.room} appId={props.appId} />
    </AgoraRTCProvider>
  )
}

function AudioCall(props) {
  const { room, appId } = props
  const { isLoadingMic, localMicrophoneTrack } = useLocalMicrophoneTrack();
  const { isLoading, isJoined } = useJoin(
    {
      appid: appId,
      channel: room,
      token: null,
    }
  )
  const [remoteAudioPlayers, setRemoteAudioPlayers] = React.useState([]); // Stores remote audio players

  usePublish([localMicrophoneTrack])

  const loadingDevice = isLoadingMic

  React.useEffect(() => {
    // Cleanup function to remove existing players when unmounting
    return () => {
      remoteAudioPlayers.forEach((player) => player.destroy());
    }
  }, [remoteAudioPlayers]);

  React.useEffect(() => {
    if (isJoined) {
      const client = useRTCClient(); // Get the client instance

      // Function to create and manage audio players for remote users
      const handleRemoteUserJoined = (user) => {
        const audioTrack = user.audioTrack;
        if (audioTrack) {
          const player = AgoraRTC.createMediaPlayer({ containerId: 'none' }); // Create player without container
          player.on('player-state-changed', (state) => {
            if (state === 'PLAYING') {
              console.log('Remote audio playing for user:', user.uid);
            }
          });
          player.setAudioTrack(audioTrack);
          player.play();
          setRemoteAudioPlayers((prevPlayers) => [...prevPlayers, player]);
        }
      };

      // Subscribe to remote audio tracks and user joined events
      client.on('user-published', handleRemoteUserJoined);
      client.on('user-joined', (user) => {
        // Check if user already has published audio before triggering handleRemoteUserJoined
        client.getRemoteAudioTrack(user.uid).then((track) => {
          if (track) {
            handleRemoteUserJoined(user);
          }
        });
      });

      // Unsubscribe from events on component unmount
      return () => {
        client.off('user-published', handleRemoteUserJoined);
        client.off('user-joined');
      };
    }
  }, [isJoined]);

  if (loadingDevice) {
    return <div className='flex flex-col items-center pt-40'>Loading Microphone...</div>
  }

  return (
    <div className='flex flex-col justify-between w-auto h-auto p-1'>
      {isJoined && <p>You are connected!</p>}
    </div>
  )
}