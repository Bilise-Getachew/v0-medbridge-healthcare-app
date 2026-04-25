"use client";

import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import type { Patient, Prescription } from "@/lib/types";
import patientsData from "@/data/patients.json";

interface PatientContextType {
  patients: Patient[];
  selectedPatient: Patient | null;
  setSelectedPatient: (patient: Patient | null) => void;
  prescriptions: Prescription[];
  addPrescription: (prescription: Prescription) => void;
  getPrescriptionsForPatient: (patientId: string) => Prescription[];
  searchPatients: (query: string) => Patient[];
  filterByCondition: (condition: string) => Patient[];
}

const PatientContext = createContext<PatientContextType | undefined>(undefined);

export function PatientProvider({ children }: { children: ReactNode }) {
  const [patients] = useState<Patient[]>(patientsData as Patient[]);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);

  // Load prescriptions from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem("medbridge_prescriptions");
    if (stored) {
      setPrescriptions(JSON.parse(stored));
    }
  }, []);

  // Save prescriptions to localStorage when updated
  useEffect(() => {
    localStorage.setItem("medbridge_prescriptions", JSON.stringify(prescriptions));
  }, [prescriptions]);

  const addPrescription = (prescription: Prescription) => {
    setPrescriptions((prev) => [...prev, prescription]);
  };

  const getPrescriptionsForPatient = (patientId: string) => {
    return prescriptions.filter((p) => p.patientId === patientId);
  };

  const searchPatients = (query: string) => {
    const lowercaseQuery = query.toLowerCase();
    return patients.filter(
      (patient) =>
        patient.name.toLowerCase().includes(lowercaseQuery) ||
        patient.condition.toLowerCase().includes(lowercaseQuery) ||
        patient.doctor.toLowerCase().includes(lowercaseQuery)
    );
  };

  const filterByCondition = (condition: string) => {
    if (!condition) return patients;
    return patients.filter((patient) =>
      patient.condition.toLowerCase().includes(condition.toLowerCase())
    );
  };

  return (
    <PatientContext.Provider
      value={{
        patients,
        selectedPatient,
        setSelectedPatient,
        prescriptions,
        addPrescription,
        getPrescriptionsForPatient,
        searchPatients,
        filterByCondition,
      }}
    >
      {children}
    </PatientContext.Provider>
  );
}

export function usePatients() {
  const context = useContext(PatientContext);
  if (context === undefined) {
    throw new Error("usePatients must be used within a PatientProvider");
  }
  return context;
}
