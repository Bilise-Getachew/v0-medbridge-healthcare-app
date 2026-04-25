export interface Patient {
  id: string;
  name: string;
  age: number;
  gender: string;
  bloodType: string;
  condition: string;
  medications: string[];
  allergies: string[];
  doctor: string;
  hospital: string;
  lastVisit: string;
  notes: string;
}

export interface Prescription {
  id: string;
  patientId: string;
  drugName: string;
  dosage: string;
  frequency: string;
  instructions: string;
  confidence: number;
  scannedAt: string;
  simplifiedExplanation?: string;
}

export interface EmergencyStep {
  order: number;
  action: string;
  duration: number;
  critical: boolean;
}

export interface EmergencyProtocol {
  id: string;
  title: string;
  icon: string;
  severity: 'moderate' | 'critical';
  symptoms: string[];
  steps: EmergencyStep[];
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export type ViewType = 'dashboard' | 'prescription' | 'emergency' | 'chat' | 'health-card';
