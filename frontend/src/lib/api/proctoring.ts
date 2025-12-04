/**
 * Proctoring API Module
 * Endpoints: /proctoring/*
 */

// import { apiRequest, API_BASE_URL, getAuthHeaders } from './index';

// Types
export interface ProctorEvent {
  id: string;
  event_type: string;
  severity: 'info' | 'low' | 'medium' | 'high' | 'critical';
  details: Record<string, unknown>;
  screenshot_url?: string;
  video_timestamp?: number;
  timestamp: string;
  reviewed: boolean;
  dismissed: boolean;
}

export interface ReportEventPayload {
  submission_id: string;
  event_type: string;
  details?: Record<string, unknown>;
  video_timestamp?: number;
  screenshot_url?: string;
}

export interface ProctoringTimeline {
  event_type: string;
  severity: string;
  timestamp: string;
  video_timestamp: number;
  details: Record<string, unknown>;
}

export interface ProctoringSummary {
  total_violations: number;
  by_type: Record<string, number>;
  by_severity: Record<string, number>;
  trust_score: number;
  flagged: boolean;
  violation_summary: {
    tab_switches: number;
    fullscreen_exits: number;
    copy_paste_attempts: number;
    suspicious_behavior: number;
    face_not_detected: number;
    multiple_faces: number;
  };
}

export interface FaceCheckResult {
  success: boolean;
  face_detected: boolean;
  face_count: number;
  confidence: number;
  looking_at_screen: boolean;
}

export interface AudioCheckResult {
  success: boolean;
  speech_detected: boolean;
  noise_level: number;
}

export const proctoringApi = {
  /**
   * Report a proctoring event
   * POST /proctoring/event
   */
  reportEvent: async (payload: ReportEventPayload): Promise<{ success: boolean; event_id?: string }> => {
    // const token = localStorage.getItem('bearer_token');
    // return await axios.post(`${API_BASE_URL}/proctoring/event`, payload, {
    //   headers: { Authorization: `Bearer ${token}` }
    // });
    // return await fetch('/proctoring/event', {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //     Authorization: `Bearer ${token}`,
    //   },
    //   body: JSON.stringify(payload),
    // }).then(res => res.json());
    
    console.log('API: reportEvent called with:', payload);
    return { success: true, event_id: 'event-' + Date.now() };
  },

  /**
   * Get all proctoring events for a submission
   * GET /proctoring/events/<submission_id>
   */
  getEvents: async (submissionId: string, eventType?: string, severity?: string): Promise<{ success: boolean; events: ProctorEvent[] }> => {
    // const token = localStorage.getItem('bearer_token');
    // const params = new URLSearchParams();
    // if (eventType) params.append('event_type', eventType);
    // if (severity) params.append('severity', severity);
    // const query = params.toString() ? `?${params.toString()}` : '';
    // return await axios.get(`${API_BASE_URL}/proctoring/events/${submissionId}${query}`, {
    //   headers: { Authorization: `Bearer ${token}` }
    // });
    
    console.log('API: getEvents called with:', submissionId, eventType, severity);
    return { success: true, events: [] };
  },

  /**
   * Get event timeline
   * GET /proctoring/timeline/<submission_id>
   */
  getTimeline: async (submissionId: string): Promise<{ success: boolean; timeline: ProctoringTimeline[] }> => {
    // const token = localStorage.getItem('bearer_token');
    // return await axios.get(`${API_BASE_URL}/proctoring/timeline/${submissionId}`, {
    //   headers: { Authorization: `Bearer ${token}` }
    // });
    
    console.log('API: getTimeline called with:', submissionId);
    return { success: true, timeline: [] };
  },

  /**
   * Get proctoring summary
   * GET /proctoring/summary/<submission_id>
   */
  getSummary: async (submissionId: string): Promise<{ success: boolean; summary: ProctoringSummary }> => {
    // const token = localStorage.getItem('bearer_token');
    // return await axios.get(`${API_BASE_URL}/proctoring/summary/${submissionId}`, {
    //   headers: { Authorization: `Bearer ${token}` }
    // });
    
    console.log('API: getSummary called with:', submissionId);
    return {
      success: true,
      summary: {
        total_violations: 0,
        by_type: {},
        by_severity: {},
        trust_score: 100,
        flagged: false,
        violation_summary: {
          tab_switches: 0,
          fullscreen_exits: 0,
          copy_paste_attempts: 0,
          suspicious_behavior: 0,
          face_not_detected: 0,
          multiple_faces: 0,
        },
      },
    };
  },

  /**
   * Review a proctoring event
   * POST /proctoring/event/<event_id>/review
   */
  reviewEvent: async (eventId: string, data: { dismissed: boolean; notes: string }): Promise<{ success: boolean }> => {
    // const token = localStorage.getItem('bearer_token');
    // return await axios.post(`${API_BASE_URL}/proctoring/event/${eventId}/review`, data, {
    //   headers: { Authorization: `Bearer ${token}` }
    // });
    
    console.log('API: reviewEvent called with:', eventId, data);
    return { success: true };
  },

  /**
   * Upload recording
   * POST /proctoring/upload-recording
   */
  uploadRecording: async (submissionId: string, recordingType: 'camera' | 'screen' | 'combined', file: Blob): Promise<{ success: boolean; url?: string }> => {
    // const token = localStorage.getItem('bearer_token');
    // const formData = new FormData();
    // formData.append('submission_id', submissionId);
    // formData.append('recording_type', recordingType);
    // formData.append('file', file);
    // return await axios.post(`${API_BASE_URL}/proctoring/upload-recording`, formData, {
    //   headers: {
    //     Authorization: `Bearer ${token}`,
    //     'Content-Type': 'multipart/form-data',
    //   }
    // });
    
    console.log('API: uploadRecording called with:', submissionId, recordingType, file.size);
    return { success: true, url: 'https://placeholder.com/recording.webm' };
  },

  /**
   * Get recording URL
   * GET /proctoring/recording/<submission_id>/<recording_type>
   */
  getRecording: async (submissionId: string, recordingType: 'camera' | 'screen' | 'combined'): Promise<{ success: boolean; url?: string }> => {
    // const token = localStorage.getItem('bearer_token');
    // return await axios.get(`${API_BASE_URL}/proctoring/recording/${submissionId}/${recordingType}`, {
    //   headers: { Authorization: `Bearer ${token}` }
    // });
    
    console.log('API: getRecording called with:', submissionId, recordingType);
    return { success: true, url: '' };
  },

  /**
   * Capture screenshot
   * POST /proctoring/screenshot
   */
  captureScreenshot: async (submissionId: string, file: Blob, eventId?: string): Promise<{ success: boolean; url?: string }> => {
    // const token = localStorage.getItem('bearer_token');
    // const formData = new FormData();
    // formData.append('submission_id', submissionId);
    // formData.append('file', file);
    // if (eventId) formData.append('event_id', eventId);
    // return await axios.post(`${API_BASE_URL}/proctoring/screenshot`, formData, {
    //   headers: {
    //     Authorization: `Bearer ${token}`,
    //     'Content-Type': 'multipart/form-data',
    //   }
    // });
    
    console.log('API: captureScreenshot called with:', submissionId, eventId);
    return { success: true, url: 'https://placeholder.com/screenshot.png' };
  },

  /**
   * AI face check
   * POST /proctoring/face-check
   */
  faceCheck: async (submissionId: string, imageBase64: string): Promise<FaceCheckResult> => {
    // const token = localStorage.getItem('bearer_token');
    // return await axios.post(`${API_BASE_URL}/proctoring/face-check`, {
    //   submission_id: submissionId,
    //   image_base64: imageBase64,
    // }, {
    //   headers: { Authorization: `Bearer ${token}` }
    // });
    
    console.log('API: faceCheck called with:', submissionId);
    return {
      success: true,
      face_detected: true,
      face_count: 1,
      confidence: 0.98,
      looking_at_screen: true,
    };
  },

  /**
   * AI audio check
   * POST /proctoring/audio-check
   */
  audioCheck: async (submissionId: string, audioBase64: string): Promise<AudioCheckResult> => {
    // const token = localStorage.getItem('bearer_token');
    // return await axios.post(`${API_BASE_URL}/proctoring/audio-check`, {
    //   submission_id: submissionId,
    //   audio_base64: audioBase64,
    // }, {
    //   headers: { Authorization: `Bearer ${token}` }
    // });
    
    console.log('API: audioCheck called with:', submissionId);
    return {
      success: true,
      speech_detected: false,
      noise_level: 0.2,
    };
  },
};
