const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3005';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  access_token: string;
  admin: {
    admin_id: string;
    email: string;
    name: string;
  };
}

export interface Survey {
  survey_id: string;
  title: string;
  description: string;
  status: string;
  start_date: string;
  end_date: string;
  created_at: string;
  updated_at?: string;
  adminId: string;
  questions?: any[];
  locations?: any[];
  admin?: {
    admin_id: string;
    name: string;
    email: string;
  };
  _count?: {
    responses: number;
  };
}

export interface CreateAdminData {
  name: string;
  email: string;
  password: string;
}

export interface CreateSurveyData {
  title: string;
  description: string;
  status: string;
  start_date: string;
  end_date: string;
  questions: any[];
  locations: {
    country: string;
    district: string;
    sector: string;
  }[];
}

export interface UpdateSurveyData {
  title?: string;
  description?: string;
  status?: string;
  start_date?: string;
  end_date?: string;
  locations?: {
    country: string;
    district: string;
    sector: string;
  }[];
}

export interface Response {
  response_id: string;
  anonymous_token: string;
  country: string;
  district: string;
  sector: string;
  submitted_at: string;
  surveyId: string;
  survey?: {
    survey_id: string;
    title: string;
  };
  answers?: {
    answer_id: string;
    answer_text: string;
    responseId: string;
    questionId: string;
    question?: {
      question_id: string;
      question_text: string;
      question_type: string;
      is_required: boolean;
    };
  }[];
}

export interface LocationAnalytics {
  location: string;
  low_risk: number;
  medium_risk: number;
  high_risk: number;
}

export interface RiskComposition {
  high_risk: number;
  medium_risk: number;
  low_risk: number;
  total_signals: number;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'survey' | 'alert' | 'info' | 'reminder';
  target_audience: 'all' | 'volunteers' | 'health_officers' | 'district_managers';
  delivery_method: 'sms' | 'push' | 'email' | 'in_app';
  status: 'pending' | 'sent' | 'failed' | 'scheduled';
  delivery_rate: number | null;
  created_at: string;
  scheduled_at?: string;
  sent_at?: string;
}

export interface NotificationStats {
  total_sent: number;
  total_pending: number;
  total_failed: number;
  delivery_rate: number;
  gateway_status: 'online' | 'offline';
  credits_remaining: number;
}

export interface DashboardSummary {
  totalSurveys: number;
  totalResponses: number;
  activeSurveys: number;
  recentActivity: any[];
}

class ApiService {
  private getAuthHeaders() {
    const token = localStorage.getItem('auth_token');
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  }

  isAuthenticated(): boolean {
    const token = localStorage.getItem('auth_token');
    return !!token;
  }

  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      if (response.status === 401) {
        throw new Error('Invalid email or password');
      }
      throw new Error(errorData.message || 'Login failed');
    }

    const data = await response.json();
    localStorage.setItem('auth_token', data.access_token);
    return data;
  }

  async register(userData: CreateAdminData): Promise<AuthResponse> {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      if (response.status === 409) {
        throw new Error('Email already exists');
      }
      throw new Error(errorData.message || 'Registration failed');
    }

    const data = await response.json();
    localStorage.setItem('auth_token', data.access_token);
    return data;
  }

  logout() {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('signify_session');
  }

  getCurrentUser(): { admin_id: string; email: string; name: string } | null {
    try {
      const sessionData = localStorage.getItem('signify_session');
      if (sessionData) {
        const session = JSON.parse(sessionData);
        return session.admin || null;
      }
      
      // Fallback: try to decode JWT token (basic implementation)
      const token = localStorage.getItem('auth_token');
      if (token) {
        // For now, return a default user - in production, you'd decode the JWT
        return {
          admin_id: 'default',
          email: 'admin@signify.gov.rw',
          name: 'Admin User'
        };
      }
      
      return null;
    } catch (error) {
      console.error('Error getting current user:', error);
      return null;
    }
  }

  async getSurveys(params?: { country?: string; district?: string; sector?: string }): Promise<Survey[]> {
    const queryParams = new URLSearchParams();
    if (params?.country) queryParams.append('country', params.country);
    if (params?.district) queryParams.append('district', params.district);
    if (params?.sector) queryParams.append('sector', params.sector);

    const response = await fetch(`${API_BASE_URL}/surveys?${queryParams}`, {
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch surveys');
    }

    return response.json();
  }

  async getSurvey(id: string): Promise<Survey> {
    const response = await fetch(`${API_BASE_URL}/surveys/${id}`, {
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch survey');
    }

    return response.json();
  }

  async createSurvey(surveyData: CreateSurveyData): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/surveys`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(surveyData),
    });

    if (!response.ok) {
      throw new Error('Failed to create survey');
    }

    return response.json();
  }

  async updateSurvey(surveyId: string, surveyData: UpdateSurveyData): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/surveys/${surveyId}`, {
      method: 'PATCH',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(surveyData),
    });

    if (!response.ok) {
      throw new Error('Failed to update survey');
    }

    return response.json();
  }

  async deleteSurvey(id: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/surveys/${id}`, {
      method: 'DELETE',
      headers: this.getAuthHeaders(),
    });

    if (response.status === 401) {
      // Clear invalid token and show message before redirect
      localStorage.removeItem('auth_token');
      alert('Session expired. You will be redirected to login in 2 seconds...');
      setTimeout(() => {
        window.location.href = '/login';
      }, 2000);
      throw new Error('Session expired. Please log in again.');
    }

    if (response.status === 403) {
      throw new Error('You do not have permission to delete surveys. Contact your administrator.');
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'Failed to delete survey');
    }
  }

  async getDashboardSummary(): Promise<DashboardSummary> {
    const response = await fetch(`${API_BASE_URL}/analytics/dashboard`, {
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch dashboard summary');
    }

    return response.json();
  }

  async getSurveyAnalytics(surveyId: string): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/analytics/survey/${surveyId}`, {
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch survey analytics');
    }

    return response.json();
  }

  async getLocationAnalytics(surveyId: string): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/analytics/survey/${surveyId}/location`, {
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch location analytics');
    }

    return response.json();
  }

  async getQuestionAnalytics(questionId: string): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/analytics/question/${questionId}`, {
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch question analytics');
    }

    return response.json();
  }

  async getResponses(surveyId?: string): Promise<Response[]> {
    const url = surveyId ? `${API_BASE_URL}/responses?surveyId=${surveyId}` : `${API_BASE_URL}/responses`;
    const response = await fetch(url, {
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch responses');
    }

    return response.json();
  }

  async getLocationAnalyticsData(): Promise<LocationAnalytics[]> {
    const response = await fetch(`${API_BASE_URL}/analytics/location-stats`, {
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch location analytics');
    }

    return response.json();
  }

  async getTrendData(): Promise<any[]> {
    const response = await fetch(`${API_BASE_URL}/analytics/trend-data`, {
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch trend data');
    }

    return response.json();
  }

  async getDistrictDetails(districtName: string): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/analytics/district/${encodeURIComponent(districtName)}`, {
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch district details');
    }

    return response.json();
  }

  async getRiskComposition(): Promise<RiskComposition> {
    // This would typically come from a real analytics endpoint
    const response = await fetch(`${API_BASE_URL}/analytics/risk-composition`, {
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      // Return mock data if endpoint doesn't exist yet
      return {
        high_risk: 15,
        medium_risk: 35,
        low_risk: 50,
        total_signals: 12800
      };
    }

    return response.json();
  }

  async getNotifications(): Promise<Notification[]> {
    // This would typically come from a real notifications endpoint
    const response = await fetch(`${API_BASE_URL}/notifications`, {
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      // Return mock data if endpoint doesn't exist yet
      return [
        { 
          id: '1', 
          title: 'Weekly Fever Alert', 
          message: 'Increased fever cases reported in District A. Please take necessary precautions.',
          type: 'alert' as const,
          target_audience: 'volunteers' as const,
          delivery_method: 'sms' as const,
          status: 'sent' as const, 
          delivery_rate: 0.98, 
          created_at: '2026-01-26T08:00:00Z' 
        },
        { 
          id: '2', 
          title: 'Vector Check Reminder', 
          message: 'Reminder to conduct vector control activities in your assigned areas.',
          type: 'reminder' as const,
          target_audience: 'health_officers' as const,
          delivery_method: 'sms' as const,
          status: 'scheduled' as const, 
          delivery_rate: null, 
          created_at: '2026-01-28T09:00:00Z' 
        },
        { 
          id: '3', 
          title: 'Emergency Outbreak Notice', 
          message: 'Emergency: Disease outbreak reported. All regional staff to report immediately.',
          type: 'alert' as const,
          target_audience: 'all' as const,
          delivery_method: 'push' as const,
          status: 'sent' as const, 
          delivery_rate: 1.0, 
          created_at: '2026-01-24T14:20:00Z' 
        },
        { 
          id: '4', 
          title: 'Submission Deadline', 
          message: 'Final reminder: Survey submissions due by end of day.',
          type: 'reminder' as const,
          target_audience: 'district_managers' as const,
          delivery_method: 'email' as const,
          status: 'failed' as const, 
          delivery_rate: 0.82, 
          created_at: '2026-01-23T17:00:00Z' 
        },
      ];
    }

    return response.json();
  }

  async getNotificationStats(): Promise<NotificationStats> {
    // This would typically come from a real notifications endpoint
    const response = await fetch(`${API_BASE_URL}/notifications/stats`, {
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      // Return mock data if endpoint doesn't exist yet
      return {
        total_sent: 15,
        total_pending: 3,
        total_failed: 2,
        delivery_rate: 0.92,
        gateway_status: 'online',
        credits_remaining: 42500
      };
    }

    return response.json();
  }
}

export const apiService = new ApiService();
