/**
 * Tests API Module
 * Endpoints: /tests/*
 */

// import { apiRequest, API_BASE_URL, getAuthHeaders } from './index';

// Types
export interface Test {
  id: string;
  title: string;
  description: string;
  duration_minutes: number;
  instructions: string;
  status: 'draft' | 'active' | 'closed' | 'archived';
  access_code: string;
  proctoring_settings: ProctoringSettings;
  allowed_languages: string[];
  passing_score: number;
  total_points: number;
  question_count: number;
  started_count: number;
  completed_count: number;
  created_at: string;
}

export interface ProctoringSettings {
  camera_required: boolean;
  screen_recording: boolean;
  fullscreen_required: boolean;
  tab_change_detection: boolean;
  copy_paste_detection: boolean;
  ai_monitoring: boolean;
}

export interface Question {
  id: string;
  title: string;
  description: string;
  type: 'coding' | 'multiple_choice' | 'short_answer';
  difficulty: 'easy' | 'medium' | 'hard';
  points: number;
  order: number;
  starter_code?: Record<string, string>;
  test_cases?: TestCase[];
  options?: string[];
  constraints?: string;
  examples?: Example[];
}

export interface TestCase {
  input: string;
  expected_output: string;
  is_hidden?: boolean;
}

export interface Example {
  input: string;
  output: string;
  explanation?: string;
}

export interface Submission {
  id: string;
  student_name: string;
  student_email: string;
  status: 'in_progress' | 'submitted' | 'graded' | 'expired' | 'terminated';
  score: number;
  percentage: number;
  duration_seconds: number;
  violation_count: number;
  ai_trust_score: number;
  flagged_for_review: boolean;
  started_at: string;
  submitted_at?: string;
}

export interface CreateTestPayload {
  title: string;
  description?: string;
  duration_minutes: number;
  instructions?: string;
  proctoring_settings?: Partial<ProctoringSettings>;
  passing_score?: number;
  allowed_languages?: string[];
}

export interface CreateQuestionPayload {
  title: string;
  description: string;
  type: 'coding' | 'multiple_choice' | 'short_answer';
  difficulty: 'easy' | 'medium' | 'hard';
  points: number;
  starter_code?: Record<string, string>;
  test_cases?: TestCase[];
  hidden_test_cases?: TestCase[];
  options?: string[];
  correct_answer?: string;
  constraints?: string;
  examples?: Example[];
}

export interface CodeExecutionResult {
  success: boolean;
  results: {
    test_case: number;
    passed: boolean;
    output: string;
    expected: string;
    execution_time_ms?: number;
  }[];
  execution_time_ms: number;
  error?: string;
}

export const testsApi = {
  /**
   * Create new test
   * POST /tests/create
   */
  createTest: async (payload: CreateTestPayload): Promise<{ success: boolean; test?: Test; access_code?: string }> => {
    // const token = localStorage.getItem('bearer_token');
    // return await axios.post(`${API_BASE_URL}/tests/create`, payload, {
    //   headers: { Authorization: `Bearer ${token}` }
    // });
    // return await fetch('/tests/create', {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //     Authorization: `Bearer ${token}`,
    //   },
    //   body: JSON.stringify(payload),
    // }).then(res => res.json());
    
    console.log('API: createTest called with:', payload);
    return { success: true, access_code: 'DEMO1234' };
  },

  /**
   * Get all tests for recruiter
   * GET /tests/
   */
  getRecruiterTests: async (status?: string): Promise<{ success: boolean; tests: Test[] }> => {
    // const token = localStorage.getItem('bearer_token');
    // const query = status ? `?status=${status}` : '';
    // return await axios.get(`${API_BASE_URL}/tests/${query}`, {
    //   headers: { Authorization: `Bearer ${token}` }
    // });
    // return await fetch(`/tests/${query}`, {
    //   headers: { Authorization: `Bearer ${token}` },
    // }).then(res => res.json());
    
    console.log('API: getRecruiterTests called with status:', status);
    return { success: true, tests: [] };
  },

  /**
   * Get test details
   * GET /tests/<test_id>
   */
  getTest: async (testId: string): Promise<{ success: boolean; test?: Test }> => {
    // const token = localStorage.getItem('bearer_token');
    // return await axios.get(`${API_BASE_URL}/tests/${testId}`, {
    //   headers: { Authorization: `Bearer ${token}` }
    // });
    // return await fetch(`/tests/${testId}`, {
    //   headers: { Authorization: `Bearer ${token}` },
    // }).then(res => res.json());
    
    console.log('API: getTest called with:', testId);
    return { success: true };
  },

  /**
   * Update test
   * PUT /tests/<test_id>
   */
  updateTest: async (testId: string, data: Partial<CreateTestPayload>): Promise<{ success: boolean; test?: Test }> => {
    // const token = localStorage.getItem('bearer_token');
    // return await axios.put(`${API_BASE_URL}/tests/${testId}`, data, {
    //   headers: { Authorization: `Bearer ${token}` }
    // });
    
    console.log('API: updateTest called with:', testId, data);
    return { success: true };
  },

  /**
   * Delete (archive) test
   * DELETE /tests/<test_id>
   */
  deleteTest: async (testId: string): Promise<{ success: boolean }> => {
    // const token = localStorage.getItem('bearer_token');
    // return await axios.delete(`${API_BASE_URL}/tests/${testId}`, {
    //   headers: { Authorization: `Bearer ${token}` }
    // });
    
    console.log('API: deleteTest called with:', testId);
    return { success: true };
  },

  /**
   * Publish test
   * POST /tests/<test_id>/publish
   */
  publishTest: async (testId: string): Promise<{ success: boolean; access_code?: string }> => {
    // const token = localStorage.getItem('bearer_token');
    // return await axios.post(`${API_BASE_URL}/tests/${testId}/publish`, null, {
    //   headers: { Authorization: `Bearer ${token}` }
    // });
    
    console.log('API: publishTest called with:', testId);
    return { success: true, access_code: 'DEMO1234' };
  },

  /**
   * Close test
   * POST /tests/<test_id>/close
   */
  closeTest: async (testId: string): Promise<{ success: boolean }> => {
    // const token = localStorage.getItem('bearer_token');
    // return await axios.post(`${API_BASE_URL}/tests/${testId}/close`, null, {
    //   headers: { Authorization: `Bearer ${token}` }
    // });
    
    console.log('API: closeTest called with:', testId);
    return { success: true };
  },

  /**
   * Add question to test
   * POST /tests/<test_id>/questions
   */
  addQuestion: async (testId: string, payload: CreateQuestionPayload): Promise<{ success: boolean; question?: Question }> => {
    // const token = localStorage.getItem('bearer_token');
    // return await axios.post(`${API_BASE_URL}/tests/${testId}/questions`, payload, {
    //   headers: { Authorization: `Bearer ${token}` }
    // });
    
    console.log('API: addQuestion called with:', testId, payload);
    return { success: true };
  },

  /**
   * Get questions for test
   * GET /tests/<test_id>/questions
   */
  getQuestions: async (testId: string): Promise<{ success: boolean; questions: Question[] }> => {
    // const token = localStorage.getItem('bearer_token');
    // return await axios.get(`${API_BASE_URL}/tests/${testId}/questions`, {
    //   headers: { Authorization: `Bearer ${token}` }
    // });
    
    console.log('API: getQuestions called with:', testId);
    return { success: true, questions: [] };
  },

  /**
   * Update question
   * PUT /tests/<test_id>/questions/<question_id>
   */
  updateQuestion: async (testId: string, questionId: string, data: Partial<CreateQuestionPayload>): Promise<{ success: boolean }> => {
    // const token = localStorage.getItem('bearer_token');
    // return await axios.put(`${API_BASE_URL}/tests/${testId}/questions/${questionId}`, data, {
    //   headers: { Authorization: `Bearer ${token}` }
    // });
    
    console.log('API: updateQuestion called with:', testId, questionId, data);
    return { success: true };
  },

  /**
   * Delete question
   * DELETE /tests/<test_id>/questions/<question_id>
   */
  deleteQuestion: async (testId: string, questionId: string): Promise<{ success: boolean }> => {
    // const token = localStorage.getItem('bearer_token');
    // return await axios.delete(`${API_BASE_URL}/tests/${testId}/questions/${questionId}`, {
    //   headers: { Authorization: `Bearer ${token}` }
    // });
    
    console.log('API: deleteQuestion called with:', testId, questionId);
    return { success: true };
  },

  /**
   * Reorder questions
   * POST /tests/<test_id>/questions/reorder
   */
  reorderQuestions: async (testId: string, orders: { question_id: string; order: number }[]): Promise<{ success: boolean }> => {
    // const token = localStorage.getItem('bearer_token');
    // return await axios.post(`${API_BASE_URL}/tests/${testId}/questions/reorder`, {
    //   question_orders: orders,
    // }, {
    //   headers: { Authorization: `Bearer ${token}` }
    // });
    
    console.log('API: reorderQuestions called with:', testId, orders);
    return { success: true };
  },

  /**
   * Get submissions for test
   * GET /tests/<test_id>/submissions
   */
  getSubmissions: async (testId: string, status?: string): Promise<{ success: boolean; submissions: Submission[] }> => {
    // const token = localStorage.getItem('bearer_token');
    // const query = status ? `?status=${status}` : '';
    // return await axios.get(`${API_BASE_URL}/tests/${testId}/submissions${query}`, {
    //   headers: { Authorization: `Bearer ${token}` }
    // });
    
    console.log('API: getSubmissions called with:', testId, status);
    return { success: true, submissions: [] };
  },

  /**
   * Get test statistics
   * GET /tests/<test_id>/statistics
   */
  getStatistics: async (testId: string): Promise<{ success: boolean; statistics: Record<string, unknown> }> => {
    // const token = localStorage.getItem('bearer_token');
    // return await axios.get(`${API_BASE_URL}/tests/${testId}/statistics`, {
    //   headers: { Authorization: `Bearer ${token}` }
    // });
    
    console.log('API: getStatistics called with:', testId);
    return { success: true, statistics: {} };
  },

  /**
   * Get test by access code (for students)
   * GET /tests/access/<access_code>
   */
  getTestByAccessCode: async (accessCode: string): Promise<{ success: boolean; test?: Test }> => {
    // return await axios.get(`${API_BASE_URL}/tests/access/${accessCode}`);
    // return await fetch(`/tests/access/${accessCode}`).then(res => res.json());
    
    console.log('API: getTestByAccessCode called with:', accessCode);
    return { success: true };
  },

  /**
   * Start test (for students)
   * POST /tests/<test_id>/start
   */
  startTest: async (testId: string, studentData: { student_email: string; student_name: string }): Promise<{
    success: boolean;
    submission_id?: string;
    questions?: Question[];
    time_limit_seconds?: number;
  }> => {
    // const token = localStorage.getItem('bearer_token');
    // return await axios.post(`${API_BASE_URL}/tests/${testId}/start`, studentData, {
    //   headers: { Authorization: `Bearer ${token}` }
    // });
    
    console.log('API: startTest called with:', testId, studentData);
    return { success: true, submission_id: 'demo-submission-id', questions: [], time_limit_seconds: 5400 };
  },

  /**
   * Save answer
   * POST /tests/submission/<submission_id>/answer
   */
  saveAnswer: async (submissionId: string, answer: { question_id: string; code: string; language: string }): Promise<{ success: boolean }> => {
    // const token = localStorage.getItem('bearer_token');
    // return await axios.post(`${API_BASE_URL}/tests/submission/${submissionId}/answer`, answer, {
    //   headers: { Authorization: `Bearer ${token}` }
    // });
    
    console.log('API: saveAnswer called with:', submissionId, answer);
    return { success: true };
  },

  /**
   * Run code
   * POST /tests/submission/<submission_id>/run
   */
  runCode: async (submissionId: string, code: { question_id: string; code: string; language: string }): Promise<CodeExecutionResult> => {
    // const token = localStorage.getItem('bearer_token');
    // return await axios.post(`${API_BASE_URL}/tests/submission/${submissionId}/run`, code, {
    //   headers: { Authorization: `Bearer ${token}` }
    // });
    
    console.log('API: runCode called with:', submissionId, code);
    return {
      success: true,
      results: [
        { test_case: 1, passed: true, output: '3', expected: '3' },
        { test_case: 2, passed: true, output: '5', expected: '5' },
      ],
      execution_time_ms: 45,
    };
  },

  /**
   * Submit test
   * POST /tests/submission/<submission_id>/submit
   */
  submitTest: async (submissionId: string): Promise<{ success: boolean; score?: number; percentage?: number }> => {
    // const token = localStorage.getItem('bearer_token');
    // return await axios.post(`${API_BASE_URL}/tests/submission/${submissionId}/submit`, null, {
    //   headers: { Authorization: `Bearer ${token}` }
    // });
    
    console.log('API: submitTest called with:', submissionId);
    return { success: true, score: 85, percentage: 85 };
  },
};
