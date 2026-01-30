'use client';

import { useState, useEffect, useRef } from 'react';
import { 
  Video, 
  VideoOff, 
  Mic, 
  MicOff, 
  PhoneOff, 
  User, 
  Clock,
  Loader2,
  ArrowLeft
} from 'lucide-react';
import io, { Socket } from 'socket.io-client';

interface VideoCallRoomProps {
  consultaId: number;
  roomId: string;
  userName: string;
  userType: 'medico' | 'paciente';
  token: string;
  onBack: () => void;
  onCallEnd?: () => void;
}

interface WebRTCConfig {
  iceServers: RTCIceServer[];
}

const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || 'https://webrtc-ymiv.onrender.com';

export function VideoCallRoom({
  consultaId,
  roomId,
  userName,
  userType,
  token,
  onBack,
  onCallEnd,
}: VideoCallRoomProps) {
  // Estados de mídia
  const [isCameraOn, setIsCameraOn] = useState(true);
  const [isMicOn, setIsMicOn] = useState(true);
  const [isConnected, setIsConnected] = useState(false);
  const [isRemoteConnected, setIsRemoteConnected] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [participantsCount, setParticipantsCount] = useState(1);
  const [remoteUserName, setRemoteUserName] = useState('Participante');
  const [connectionStatus, setConnectionStatus] = useState('Conectando...');

  // Refs para WebRTC
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const socketRef = useRef<Socket | null>(null);
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  const callStartTimeRef = useRef<number | null>(null);
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Inicializar mídia local
  useEffect(() => {
    initLocalMedia();
    return () => {
      cleanup();
    };
  }, []);

  // Conectar ao Socket.io
  useEffect(() => {
    if (localStreamRef.current) {
      connectToRoom();
    }
    return () => {
      disconnectSocket();
    };
  }, [localStreamRef.current]);

  // Timer da chamada
  useEffect(() => {
    if (isRemoteConnected && !callStartTimeRef.current) {
      callStartTimeRef.current = Date.now();
      timerIntervalRef.current = setInterval(() => {
        if (callStartTimeRef.current) {
          const elapsed = Math.floor((Date.now() - callStartTimeRef.current) / 1000);
          setCallDuration(elapsed);
        }
      }, 1000);
    }
    return () => {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }
    };
  }, [isRemoteConnected]);

  const initLocalMedia = async () => {
    try {
      setConnectionStatus('Iniciando câmera...');
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { 
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: 'user'
        },
        audio: true,
      });

      localStreamRef.current = stream;
      
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }

      setConnectionStatus('Conectando à sala...');
    } catch (error) {
      console.error('Erro ao acessar mídia:', error);
      setConnectionStatus('Erro ao acessar câmera/microfone');
      alert('Não foi possível acessar câmera/microfone. Verifique as permissões.');
    }
  };

  const connectToRoom = () => {
    socketRef.current = io(SOCKET_URL, {
      transports: ['websocket', 'polling'],
    });

    socketRef.current.on('connect', () => {
      console.log('Socket conectado');
      setIsConnected(true);
      joinRoom();
    });

    socketRef.current.on('disconnect', () => {
      console.log('Socket desconectado');
      setIsConnected(false);
      setConnectionStatus('Desconectado');
    });

    // Eventos de usuários
    socketRef.current.on('user-connected', ({ socketId, userName: newUserName }) => {
      console.log('Usuário conectado:', newUserName);
      setRemoteUserName(newUserName);
      setParticipantsCount(prev => prev + 1);
    });

    socketRef.current.on('user-disconnected', () => {
      console.log('Usuário desconectou');
      setIsRemoteConnected(false);
      setParticipantsCount(prev => Math.max(1, prev - 1));
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = null;
      }
    });

    socketRef.current.on('participant-count-updated', (count: number) => {
      setParticipantsCount(count);
    });

    // Eventos WebRTC
    socketRef.current.on('offer', handleReceiveOffer);
    socketRef.current.on('answer', handleReceiveAnswer);
    socketRef.current.on('ice-candidate', handleReceiveIceCandidate);
  };

  const joinRoom = () => {
    if (!socketRef.current) return;

    socketRef.current.emit('join-room', {
      roomId,
      consultaId: consultaId.toString(),
      userName,
      userType,
      token,
    }, (response: any) => {
      if (response.error) {
        console.error('Erro ao entrar na sala:', response.error);
        setConnectionStatus('Erro ao entrar na sala');
        alert(response.error);
        return;
      }

      console.log('Entrou na sala:', response);
      setConnectionStatus('Conectado');
      setParticipantsCount(response.participantCount || 1);

      // Se há usuários existentes, criar ofertas
      if (response.existingUsers && response.existingUsers.length > 0) {
        response.existingUsers.forEach((user: any) => {
          createPeerConnection(user.socketId);
          createOffer(user.socketId);
        });
      }

      // Configurar peer connection para novos usuários
      createPeerConnection();
    });
  };

  const createPeerConnection = (targetUserId?: string) => {
    const config: RTCConfiguration = {
      iceServers: [
        { urls: 'stun:stun.l.google.com:19302' },
        { urls: 'stun:stun1.l.google.com:19302' },
      ],
    };

    const pc = new RTCPeerConnection(config);
    peerConnectionRef.current = pc;

    // Adicionar tracks locais
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach(track => {
        pc.addTrack(track, localStreamRef.current!);
      });
    }

    // Receber tracks remotos
    pc.ontrack = (event) => {
      console.log('Track remoto recebido:', event.track.kind);
      if (remoteVideoRef.current && event.streams[0]) {
        remoteVideoRef.current.srcObject = event.streams[0];
        setIsRemoteConnected(true);
        setConnectionStatus('Em chamada');
      }
    };

    // ICE candidates
    pc.onicecandidate = (event) => {
      if (event.candidate && socketRef.current && targetUserId) {
        socketRef.current.emit('ice-candidate', {
          candidate: event.candidate,
          targetUserId,
          roomId,
        });
      }
    };

    // Estado da conexão
    pc.onconnectionstatechange = () => {
      console.log('Connection state:', pc.connectionState);
      if (pc.connectionState === 'connected') {
        setIsRemoteConnected(true);
        setConnectionStatus('Em chamada');
      } else if (pc.connectionState === 'disconnected' || pc.connectionState === 'failed') {
        setIsRemoteConnected(false);
        setConnectionStatus('Desconectado');
      }
    };

    return pc;
  };

  const createOffer = async (targetUserId: string) => {
    if (!peerConnectionRef.current || !socketRef.current) return;

    try {
      const offer = await peerConnectionRef.current.createOffer();
      await peerConnectionRef.current.setLocalDescription(offer);

      socketRef.current.emit('offer', {
        sdp: offer,
        targetUserId,
        roomId,
      });
    } catch (error) {
      console.error('Erro ao criar offer:', error);
    }
  };

  const handleReceiveOffer = async ({ sdp, senderId }: any) => {
    console.log('Offer recebida de:', senderId);
    
    if (!peerConnectionRef.current) {
      createPeerConnection(senderId);
    }

    try {
      await peerConnectionRef.current!.setRemoteDescription(new RTCSessionDescription(sdp));
      const answer = await peerConnectionRef.current!.createAnswer();
      await peerConnectionRef.current!.setLocalDescription(answer);

      socketRef.current?.emit('answer', {
        sdp: answer,
        targetUserId: senderId,
        roomId,
      });
    } catch (error) {
      console.error('Erro ao processar offer:', error);
    }
  };

  const handleReceiveAnswer = async ({ sdp }: any) => {
    console.log('Answer recebida');
    try {
      await peerConnectionRef.current?.setRemoteDescription(new RTCSessionDescription(sdp));
    } catch (error) {
      console.error('Erro ao processar answer:', error);
    }
  };

  const handleReceiveIceCandidate = async ({ candidate }: any) => {
    try {
      await peerConnectionRef.current?.addIceCandidate(new RTCIceCandidate(candidate));
    } catch (error) {
      console.error('Erro ao adicionar ICE candidate:', error);
    }
  };

  const toggleCamera = () => {
    if (localStreamRef.current) {
      const videoTrack = localStreamRef.current.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setIsCameraOn(videoTrack.enabled);
        
        socketRef.current?.emit('camera-toggle', {
          enabled: videoTrack.enabled,
          roomId,
        });
      }
    }
  };

  const toggleMic = () => {
    if (localStreamRef.current) {
      const audioTrack = localStreamRef.current.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setIsMicOn(audioTrack.enabled);
        
        socketRef.current?.emit('mic-toggle', {
          enabled: audioTrack.enabled,
          roomId,
        });
      }
    }
  };

  const hangup = () => {
    const duration = callDuration;
    cleanup();
    onCallEnd?.();
    onBack();
  };

  const cleanup = () => {
    // Parar todas as tracks
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach(track => track.stop());
    }

    // Fechar peer connection
    if (peerConnectionRef.current) {
      peerConnectionRef.current.close();
    }

    // Desconectar socket
    disconnectSocket();

    // Limpar timer
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
    }
  };

  const disconnectSocket = () => {
    if (socketRef.current) {
      socketRef.current.disconnect();
      socketRef.current = null;
    }
  };

  const formatDuration = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 bg-black z-50 flex flex-col">
      {/* Header */}
      <div className="bg-gray-900/90 backdrop-blur-sm px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={hangup}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-white" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${isRemoteConnected ? 'bg-green-500 animate-pulse' : 'bg-yellow-500'}`} />
              <span className="text-white text-sm font-medium">{connectionStatus}</span>
            </div>
            {isRemoteConnected && (
              <div className="flex items-center gap-2 text-gray-400 text-xs mt-1">
                <Clock className="w-3 h-3" />
                <span>{formatDuration(callDuration)}</span>
              </div>
            )}
          </div>
        </div>
        
        <div className="flex items-center gap-2 text-white text-sm">
          <User className="w-4 h-4" />
          <span>{participantsCount}</span>
        </div>
      </div>

      {/* Área de Vídeos */}
      <div className="flex-1 relative bg-gray-950">
        {/* Vídeo Remoto (Principal) */}
        <div className="absolute inset-0">
          <video
            ref={remoteVideoRef}
            autoPlay
            playsInline
            className={`w-full h-full object-cover ${isRemoteConnected ? 'block' : 'hidden'}`}
          />
          
          {!isRemoteConnected && (
            <div className="w-full h-full flex flex-col items-center justify-center text-white">
              <div className="w-24 h-24 rounded-full bg-gray-800 flex items-center justify-center mb-4">
                <User className="w-12 h-12 text-gray-400" />
              </div>
              <p className="text-lg font-medium mb-2">Aguardando {userType === 'medico' ? 'paciente' : 'médico'}...</p>
              <p className="text-sm text-gray-400">A videochamada iniciará quando o outro participante entrar</p>
              <Loader2 className="w-6 h-6 text-primary mt-4 animate-spin" />
            </div>
          )}

          {isRemoteConnected && (
            <div className="absolute top-4 left-4 bg-black/50 backdrop-blur-sm px-3 py-2 rounded-lg">
              <div className="flex items-center gap-2 text-white text-sm">
                <User className="w-4 h-4" />
                <span>{remoteUserName}</span>
              </div>
            </div>
          )}
        </div>

        {/* Vídeo Local (Picture-in-Picture) */}
        <div className="absolute bottom-24 right-4 w-32 h-44 rounded-2xl overflow-hidden shadow-2xl border-2 border-white/20">
          <video
            ref={localVideoRef}
            autoPlay
            muted
            playsInline
            className={`w-full h-full object-cover ${isCameraOn ? 'block' : 'hidden'}`}
          />
          {!isCameraOn && (
            <div className="w-full h-full bg-gray-800 flex items-center justify-center">
              <VideoOff className="w-8 h-8 text-gray-400" />
            </div>
          )}
          <div className="absolute bottom-2 left-2 text-white text-xs bg-black/50 px-2 py-1 rounded">
            Você
          </div>
        </div>
      </div>

      {/* Controles */}
      <div className="bg-gray-900/95 backdrop-blur-sm px-6 py-6 flex items-center justify-center gap-4">
        {/* Câmera */}
        <button
          onClick={toggleCamera}
          className={`p-4 rounded-full transition-all ${
            isCameraOn
              ? 'bg-gray-700 hover:bg-gray-600 text-white'
              : 'bg-red-600 hover:bg-red-700 text-white'
          }`}
        >
          {isCameraOn ? <Video className="w-6 h-6" /> : <VideoOff className="w-6 h-6" />}
        </button>

        {/* Microfone */}
        <button
          onClick={toggleMic}
          className={`p-4 rounded-full transition-all ${
            isMicOn
              ? 'bg-gray-700 hover:bg-gray-600 text-white'
              : 'bg-red-600 hover:bg-red-700 text-white'
          }`}
        >
          {isMicOn ? <Mic className="w-6 h-6" /> : <MicOff className="w-6 h-6" />}
        </button>

        {/* Encerrar */}
        <button
          onClick={hangup}
          className="p-4 rounded-full bg-red-600 hover:bg-red-700 text-white transition-all"
        >
          <PhoneOff className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
}
