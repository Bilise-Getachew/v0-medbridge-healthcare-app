import type { Patient, Prescription } from "./types";

// Simulated OCR Agent - parses prescription images
export function simulateOCR(): Omit<Prescription, "id" | "patientId" | "scannedAt"> {
  const mockPrescriptions = [
    {
      drugName: "Amoxicillin",
      dosage: "500mg",
      frequency: "3 times daily",
      instructions: "Take with food. Complete the full course even if you feel better.",
      confidence: 0.94,
    },
    {
      drugName: "Omeprazole",
      dosage: "20mg",
      frequency: "Once daily before breakfast",
      instructions: "Swallow whole, do not crush or chew. Take 30 minutes before eating.",
      confidence: 0.91,
    },
    {
      drugName: "Metformin",
      dosage: "850mg",
      frequency: "Twice daily with meals",
      instructions: "Take with food to reduce stomach upset. Monitor blood sugar levels.",
      confidence: 0.96,
    },
    {
      drugName: "Atorvastatin",
      dosage: "40mg",
      frequency: "Once daily at bedtime",
      instructions: "Take at the same time each day. Avoid grapefruit juice.",
      confidence: 0.89,
    },
    {
      drugName: "Lisinopril",
      dosage: "10mg",
      frequency: "Once daily",
      instructions: "Take at the same time each day. Report any persistent cough.",
      confidence: 0.93,
    },
  ];

  return mockPrescriptions[Math.floor(Math.random() * mockPrescriptions.length)];
}

// Medical Simplifier Agent - converts complex medical terms to simple explanations
export function simplifyMedicalText(prescription: Partial<Prescription>): string {
  const simplifications: Record<string, string> = {
    Amoxicillin: `This is an antibiotic medicine that fights bacterial infections. Take ${prescription.dosage} ${prescription.frequency}. It's important to finish all your medicine even if you start feeling better, because stopping early can make the infection come back stronger.`,
    Omeprazole: `This medicine helps reduce acid in your stomach. It's used to treat heartburn, acid reflux, and stomach ulcers. Take ${prescription.dosage} ${prescription.frequency}. For best results, take it before your first meal of the day.`,
    Metformin: `This is a diabetes medicine that helps control your blood sugar levels. Take ${prescription.dosage} ${prescription.frequency}. Always take it with food to avoid stomach upset. Keep checking your blood sugar as your doctor advised.`,
    Atorvastatin: `This is a cholesterol-lowering medicine. It helps reduce bad cholesterol and lower your risk of heart problems. Take ${prescription.dosage} ${prescription.frequency}. Avoid drinking grapefruit juice as it can affect how the medicine works.`,
    Lisinopril: `This is a blood pressure medicine that helps relax your blood vessels. Take ${prescription.dosage} ${prescription.frequency}. If you develop a dry cough that won't go away, let your doctor know.`,
  };

  return (
    simplifications[prescription.drugName || ""] ||
    `Take ${prescription.drugName} ${prescription.dosage} ${prescription.frequency}. ${prescription.instructions}`
  );
}

// Context-Aware Chat Agent
export function generateChatResponse(
  message: string,
  patient: Patient | null,
  prescriptions: Prescription[]
): string {
  const lowerMessage = message.toLowerCase();

  // Check for medication-related queries
  if (lowerMessage.includes("medication") || lowerMessage.includes("medicine") || lowerMessage.includes("drug")) {
    if (patient) {
      const meds = patient.medications.join(", ");
      return `Based on ${patient.name}'s records, they are currently taking: ${meds}. ${
        prescriptions.length > 0
          ? `They also have ${prescriptions.length} recently scanned prescription(s).`
          : ""
      } Would you like me to explain any of these medications in simple terms?`;
    }
    return "Please select a patient from the Health Card section first, so I can provide personalized medication information.";
  }

  // Check for dosage queries
  if (lowerMessage.includes("dosage") || lowerMessage.includes("dose") || lowerMessage.includes("how much")) {
    if (prescriptions.length > 0) {
      const lastPrescription = prescriptions[prescriptions.length - 1];
      return `The most recent prescription is ${lastPrescription.drugName} with a dosage of ${lastPrescription.dosage}, to be taken ${lastPrescription.frequency}. ${lastPrescription.instructions}`;
    }
    return "I don't see any scanned prescriptions yet. Would you like to scan a prescription to get dosage information?";
  }

  // Check for emergency queries
  if (lowerMessage.includes("emergency") || lowerMessage.includes("help") || lowerMessage.includes("urgent")) {
    return "For immediate emergencies, please use the Emergency Help feature from the dashboard. It provides step-by-step guidance for critical situations like heart attacks, severe bleeding, and choking. If this is a life-threatening emergency, call 911 immediately.";
  }

  // Check for allergy queries
  if (lowerMessage.includes("allergy") || lowerMessage.includes("allergic")) {
    if (patient) {
      const allergies = patient.allergies.length > 0 ? patient.allergies.join(", ") : "no known allergies";
      return `${patient.name} has the following allergies on record: ${allergies}. Always inform healthcare providers about allergies before receiving any new medications.`;
    }
    return "Please select a patient to view their allergy information.";
  }

  // Check for condition queries
  if (lowerMessage.includes("condition") || lowerMessage.includes("diagnosis") || lowerMessage.includes("health")) {
    if (patient) {
      return `${patient.name} has been diagnosed with ${patient.condition}. They are under the care of ${patient.doctor} at ${patient.hospital}. Last visit was on ${patient.lastVisit}. Doctor's notes: "${patient.notes}"`;
    }
    return "Please select a patient from the Health Card section to view their health condition details.";
  }

  // Default response
  if (patient) {
    return `I'm here to help with ${patient.name}'s healthcare information. You can ask me about their medications, allergies, health condition, or recent prescriptions. For emergencies, please use the Emergency Help feature.`;
  }

  return "Hello! I'm your Medbridge assistant. I can help you understand prescriptions, provide medication information, and guide you through emergencies. Please select a patient from the Health Card section for personalized assistance, or ask me any general health questions.";
}

// Suggestion generator based on context
export function generateSuggestions(patient: Patient | null, prescriptions: Prescription[]): string[] {
  const suggestions: string[] = [];

  if (patient) {
    suggestions.push(`Tell me about ${patient.name}'s condition`);
    suggestions.push("What allergies should I be aware of?");
    if (patient.medications.length > 0) {
      suggestions.push("Explain current medications");
    }
  } else {
    suggestions.push("How do I scan a prescription?");
  }

  if (prescriptions.length > 0) {
    suggestions.push("Explain my latest prescription");
  }

  suggestions.push("Emergency help guide");

  return suggestions.slice(0, 4);
}
