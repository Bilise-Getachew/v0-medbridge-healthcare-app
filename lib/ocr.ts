import type { Prescription } from "./types";

// Mock OCR prescriptions with realistic data
const MOCK_PRESCRIPTIONS = [
  {
    drugName: "Amoxicillin",
    dosage: "500mg",
    frequency: "3 times daily",
    instructions: "Take after meals. Complete the full 7-day course even if symptoms improve.",
    confidence: 0.92,
  },
  {
    drugName: "Omeprazole",
    dosage: "20mg",
    frequency: "Once daily before breakfast",
    instructions: "Swallow whole with water. Do not crush or chew. Take 30-60 minutes before eating.",
    confidence: 0.94,
  },
  {
    drugName: "Metformin",
    dosage: "850mg",
    frequency: "Twice daily with meals",
    instructions: "Take with food to minimize stomach upset. Monitor blood sugar regularly.",
    confidence: 0.96,
  },
  {
    drugName: "Atorvastatin",
    dosage: "40mg",
    frequency: "Once daily at bedtime",
    instructions: "Take at the same time each day. Avoid grapefruit products.",
    confidence: 0.89,
  },
  {
    drugName: "Lisinopril",
    dosage: "10mg",
    frequency: "Once daily in the morning",
    instructions: "Take at the same time each day. Report persistent dry cough to doctor.",
    confidence: 0.93,
  },
  {
    drugName: "Prednisone",
    dosage: "5mg",
    frequency: "Once daily with breakfast",
    instructions: "Take with food. Do not stop suddenly without doctor advice.",
    confidence: 0.91,
  },
  {
    drugName: "Ciprofloxacin",
    dosage: "250mg",
    frequency: "Twice daily for 7 days",
    instructions: "Take with plenty of water. Avoid dairy products and antacids.",
    confidence: 0.88,
  },
  {
    drugName: "Amlodipine",
    dosage: "5mg",
    frequency: "Once daily",
    instructions: "Can be taken with or without food. Report swelling in ankles.",
    confidence: 0.95,
  },
];

export interface OCRResult {
  drugName: string;
  dosage: string;
  frequency: string;
  instructions: string;
  confidence: number;
}

// Simulate OCR processing with delay
export async function processImage(imageFile: File | Blob): Promise<OCRResult> {
  // Simulate processing time (1.5 - 3 seconds)
  const processingTime = 1500 + Math.random() * 1500;
  
  await new Promise((resolve) => setTimeout(resolve, processingTime));
  
  // Return a random mock prescription
  const result = MOCK_PRESCRIPTIONS[Math.floor(Math.random() * MOCK_PRESCRIPTIONS.length)];
  
  // Add slight variation to confidence based on "image quality"
  const confidenceVariation = (Math.random() - 0.5) * 0.1;
  const adjustedConfidence = Math.min(0.99, Math.max(0.75, result.confidence + confidenceVariation));
  
  return {
    ...result,
    confidence: Math.round(adjustedConfidence * 100) / 100,
  };
}

// Simplify medical text for patient understanding
export function simplifyPrescription(result: OCRResult): string {
  const simplifications: Record<string, string> = {
    Amoxicillin: `This is an antibiotic that fights bacterial infections. Take ${result.dosage} ${result.frequency}. It's crucial to finish the entire course, even if you feel better, to ensure the infection is completely cleared.`,
    Omeprazole: `This reduces stomach acid to treat heartburn, acid reflux, or ulcers. Take ${result.dosage} ${result.frequency}. For best effect, take it before your first meal of the day.`,
    Metformin: `This helps control blood sugar in type 2 diabetes. Take ${result.dosage} ${result.frequency}. Always take with food to avoid stomach discomfort.`,
    Atorvastatin: `This lowers cholesterol to protect your heart. Take ${result.dosage} ${result.frequency}. Avoid grapefruit as it interferes with this medication.`,
    Lisinopril: `This is a blood pressure medication that relaxes blood vessels. Take ${result.dosage} ${result.frequency}. If you develop a persistent cough, inform your doctor.`,
    Prednisone: `This is a corticosteroid that reduces inflammation. Take ${result.dosage} ${result.frequency}. Never stop this medication suddenly without doctor's guidance.`,
    Ciprofloxacin: `This is a strong antibiotic for bacterial infections. Take ${result.dosage} ${result.frequency}. Drink plenty of water and avoid dairy products around dosing time.`,
    Amlodipine: `This relaxes blood vessels to lower blood pressure. Take ${result.dosage} ${result.frequency}. Contact your doctor if you notice ankle swelling.`,
  };

  return (
    simplifications[result.drugName] ||
    `Take ${result.drugName} ${result.dosage} ${result.frequency}. ${result.instructions}`
  );
}

// Create a prescription object from OCR result
export function createPrescription(
  ocrResult: OCRResult,
  patientId: string
): Prescription {
  return {
    id: `RX-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    patientId,
    drugName: ocrResult.drugName,
    dosage: ocrResult.dosage,
    frequency: ocrResult.frequency,
    instructions: ocrResult.instructions,
    confidence: ocrResult.confidence,
    scannedAt: new Date().toISOString(),
    simplifiedExplanation: simplifyPrescription(ocrResult),
  };
}
