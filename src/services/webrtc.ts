// WebRTC Service
// Integração com servidor WebRTC para teleconsultas

const WEBRTC_URL = process.env.NEXT_PUBLIC_WEBRTC_URL || 'https://webrtc-ymiv.onrender.com';
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

export interface VideoCallConfig {
  iceServers: RTCIceServer[];
  iceCandidatePoolSize: number;
}

export interface ConsultaVideoCallData {
  success: boolean;
  linkVideoCall: string;
  roomId: string;
  sala: {
    id: string;
    status: {
      medicoOnline: boolean;
      pacienteOnline: boolean;
    };
  };
  webrtcConfig: VideoCallConfig;
  consulta: {
    id: number;
    pacienteNome: string;
    medicoNome: string;
    dataHora: string;
  };
}

export interface SalaEsperaData {
  success: boolean;
  sala: {
    id: string;
    status: string;
    medicoOnline: boolean;
  };
  medico: {
    nome: string;
    especialidade: string;
  };
  linkVideoCall: string;
}

export interface SalaStatus {
  salaAtiva: boolean;
  salaId: string;
  status: string;
  participantes: {
    medicoOnline: boolean;
    pacienteOnline: boolean;
  };
  podeIniciar: boolean;
}

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const webrtcService = {
  /**
   * Obter configuração WebRTC (STUN/TURN servers)
   */
  getConfig: async (): Promise<VideoCallConfig> => {
    try {
      const response = await fetch(`${WEBRTC_URL}/api/teleconsulta/config`);
      return await response.json();
    } catch (error) {
      console.error('Erro ao obter config WebRTC:', error);
      // Fallback com servidores públicos do Google
      return {
        iceServers: [
          { urls: 'stun:stun.l.google.com:19302' },
          { urls: 'stun:stun1.l.google.com:19302' },
        ],
        iceCandidatePoolSize: 10,
      };
    }
  },

  /**
   * Iniciar videochamada (médico ou paciente)
   */
  iniciarConsulta: async (
    consultaId: number,
    userType: 'medico' | 'paciente',
    token: string
  ): Promise<ConsultaVideoCallData> => {
    await delay(1000);

    // Em produção, fazer requisição real:
    // const response = await fetch(`${API_URL}/teleconsulta/${consultaId}/iniciar`, {
    //   method: 'POST',
    //   headers: {
    //     'Authorization': `Bearer ${token}`,
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify({ userType }),
    // });
    // return await response.json();

    // Mock para desenvolvimento
    const roomId = `consulta-${consultaId}`;
    const linkVideoCall = `${WEBRTC_URL}/video?consultaId=${consultaId}&token=${token}`;

    return {
      success: true,
      linkVideoCall,
      roomId,
      sala: {
        id: roomId,
        status: {
          medicoOnline: userType === 'medico',
          pacienteOnline: userType === 'paciente',
        },
      },
      webrtcConfig: await webrtcService.getConfig(),
      consulta: {
        id: consultaId,
        pacienteNome: 'João Silva',
        medicoNome: 'Dra. Maria Santos',
        dataHora: new Date().toISOString(),
      },
    };
  },

  /**
   * Entrar na sala de espera (antes da consulta começar)
   */
  entrarSalaEspera: async (
    consultaId: number,
    token: string
  ): Promise<SalaEsperaData> => {
    await delay(500);

    // Em produção:
    // const response = await fetch(`${API_URL}/teleconsulta/${consultaId}/sala-espera`, {
    //   method: 'POST',
    //   headers: { 'Authorization': `Bearer ${token}` },
    // });
    // return await response.json();

    const linkVideoCall = `${WEBRTC_URL}/video?consultaId=${consultaId}&token=${token}`;

    return {
      success: true,
      sala: {
        id: `consulta-${consultaId}`,
        status: 'aguardando_medico',
        medicoOnline: false,
      },
      medico: {
        nome: 'Dra. Maria Santos',
        especialidade: 'Clínica Geral',
      },
      linkVideoCall,
    };
  },

  /**
   * Verificar status da sala
   */
  verificarStatus: async (
    consultaId: number,
    token: string
  ): Promise<SalaStatus> => {
    await delay(300);

    // Em produção:
    // const response = await fetch(`${API_URL}/teleconsulta/${consultaId}/status`, {
    //   headers: { 'Authorization': `Bearer ${token}` },
    // });
    // return await response.json();

    return {
      salaAtiva: true,
      salaId: `consulta-${consultaId}`,
      status: 'aguardando',
      participantes: {
        medicoOnline: false,
        pacienteOnline: true,
      },
      podeIniciar: true,
    };
  },

  /**
   * Finalizar consulta
   */
  finalizarConsulta: async (
    consultaId: number,
    duracao: number,
    token: string,
    observacoes?: string
  ): Promise<{ success: boolean; message: string }> => {
    await delay(500);

    // Em produção:
    // const response = await fetch(`${API_URL}/teleconsulta/${consultaId}/finalizar`, {
    //   method: 'POST',
    //   headers: {
    //     'Authorization': `Bearer ${token}`,
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify({ duracao, observacoes }),
    // });
    // return await response.json();

    return {
      success: true,
      message: 'Consulta finalizada com sucesso',
    };
  },

  /**
   * Gerar link de videochamada para abrir em nova aba ou WebView
   */
  gerarLinkVideoCall: (consultaId: number, token: string): string => {
    return `${WEBRTC_URL}/video?consultaId=${consultaId}&token=${token}`;
  },

  /**
   * Verificar saúde do servidor WebRTC
   */
  healthCheck: async (): Promise<boolean> => {
    try {
      const response = await fetch(`${WEBRTC_URL}/health`);
      const data = await response.json();
      return data.status === 'ok';
    } catch (error) {
      console.error('Servidor WebRTC indisponível:', error);
      return false;
    }
  },
};
