"use client";

import { useState } from "react";
import Link from "next/link";
import {
  User,
  Calendar,
  Stethoscope,
  Pill,
  AlertCircle,
  Building2,
  Search,
  Filter,
  FileText,
  Check,
  Droplet,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AppLayout } from "@/components/app-layout";
import { usePatients } from "@/context/patient-context";
import type { Patient } from "@/lib/types";

function HealthContent() {
  const {
    patients,
    selectedPatient,
    setSelectedPatient,
    searchPatients,
    getPrescriptionsForPatient,
  } = usePatients();

  const [searchQuery, setSearchQuery] = useState("");
  const [conditionFilter, setConditionFilter] = useState<string>("all");

  // Get unique conditions for filter
  const conditions = [...new Set(patients.map((p) => p.condition))];

  // Filter patients
  let filteredPatients = searchQuery ? searchPatients(searchQuery) : patients;
  if (conditionFilter !== "all") {
    filteredPatients = filteredPatients.filter((p) =>
      p.condition.toLowerCase().includes(conditionFilter.toLowerCase())
    );
  }

  const handleSelectPatient = (patient: Patient) => {
    setSelectedPatient(patient);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Health Cards</h1>
        <p className="text-muted-foreground">
          Select a patient to view their health records and history
        </p>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col gap-4 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search patients by name, condition, or doctor..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={conditionFilter} onValueChange={setConditionFilter}>
          <SelectTrigger className="w-full sm:w-[200px]">
            <Filter className="mr-2 h-4 w-4" />
            <SelectValue placeholder="Filter by condition" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Conditions</SelectItem>
            {conditions.map((condition) => (
              <SelectItem key={condition} value={condition.toLowerCase()}>
                {condition}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Patient List */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">
                Patients ({filteredPatients.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="max-h-[600px] space-y-2 overflow-y-auto">
              {filteredPatients.map((patient) => (
                <button
                  key={patient.id}
                  onClick={() => handleSelectPatient(patient)}
                  className={`w-full rounded-lg border p-3 text-left transition-all hover:bg-muted/50 ${
                    selectedPatient?.id === patient.id
                      ? "border-primary bg-primary/5 ring-1 ring-primary"
                      : ""
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className={`flex h-10 w-10 items-center justify-center rounded-full ${
                          selectedPatient?.id === patient.id
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted"
                        }`}
                      >
                        <User className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{patient.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {patient.age}y - {patient.gender}
                        </p>
                      </div>
                    </div>
                    {selectedPatient?.id === patient.id && (
                      <Check className="h-5 w-5 text-primary" />
                    )}
                  </div>
                  <Badge variant="outline" className="mt-2 text-xs">
                    {patient.condition}
                  </Badge>
                </button>
              ))}

              {filteredPatients.length === 0 && (
                <div className="py-8 text-center text-muted-foreground">
                  No patients found
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Patient Details */}
        <div className="lg:col-span-2">
          {selectedPatient ? (
            <PatientDetails patient={selectedPatient} />
          ) : (
            <Card className="flex h-full items-center justify-center border-dashed">
              <CardContent className="py-16 text-center">
                <div className="mb-4 flex justify-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                    <User className="h-8 w-8 text-muted-foreground" />
                  </div>
                </div>
                <h3 className="mb-2 text-lg font-semibold text-foreground">
                  Select a Patient
                </h3>
                <p className="text-muted-foreground">
                  Choose a patient from the list to view their health card and records
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

interface PatientDetailsProps {
  patient: Patient;
}

function PatientDetails({ patient }: PatientDetailsProps) {
  const { getPrescriptionsForPatient } = usePatients();
  const patientPrescriptions = getPrescriptionsForPatient(patient.id);

  return (
    <div className="space-y-4">
      {/* Main Card */}
      <Card className="overflow-hidden">
        {/* Header with gradient */}
        <div className="relative bg-gradient-to-br from-primary/20 via-primary/10 to-transparent p-6">
          <div className="flex items-start gap-4">
            <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-card shadow-lg">
              <User className="h-10 w-10 text-primary" />
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-foreground">{patient.name}</h2>
              <div className="mt-1 flex flex-wrap items-center gap-2 text-muted-foreground">
                <span>{patient.age} years old</span>
                <span>-</span>
                <span>{patient.gender}</span>
                <span>-</span>
                <span className="flex items-center gap-1">
                  <Droplet className="h-3 w-3" />
                  {patient.bloodType}
                </span>
              </div>
              <Badge className="mt-2 bg-primary/20 text-primary hover:bg-primary/30">
                {patient.condition}
              </Badge>
            </div>
          </div>
        </div>

        <CardContent className="space-y-6 p-6">
          {/* Quick Stats */}
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <div className="rounded-lg bg-muted/50 p-3">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Building2 className="h-4 w-4" />
                <span className="text-xs font-medium">Hospital</span>
              </div>
              <p className="mt-1 truncate text-sm font-semibold text-foreground">
                {patient.hospital}
              </p>
            </div>
            <div className="rounded-lg bg-muted/50 p-3">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Stethoscope className="h-4 w-4" />
                <span className="text-xs font-medium">Doctor</span>
              </div>
              <p className="mt-1 truncate text-sm font-semibold text-foreground">
                {patient.doctor}
              </p>
            </div>
            <div className="rounded-lg bg-muted/50 p-3">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span className="text-xs font-medium">Last Visit</span>
              </div>
              <p className="mt-1 text-sm font-semibold text-foreground">
                {new Date(patient.lastVisit).toLocaleDateString()}
              </p>
            </div>
            <div className="rounded-lg bg-muted/50 p-3">
              <div className="flex items-center gap-2 text-muted-foreground">
                <FileText className="h-4 w-4" />
                <span className="text-xs font-medium">Prescriptions</span>
              </div>
              <p className="mt-1 text-sm font-semibold text-foreground">
                {patientPrescriptions.length} scanned
              </p>
            </div>
          </div>

          {/* Medications */}
          <div>
            <h3 className="mb-3 flex items-center gap-2 font-semibold text-foreground">
              <Pill className="h-4 w-4 text-primary" />
              Current Medications
            </h3>
            <div className="flex flex-wrap gap-2">
              {patient.medications.map((med, index) => (
                <Badge key={index} variant="secondary" className="px-3 py-1">
                  {med}
                </Badge>
              ))}
            </div>
          </div>

          {/* Allergies */}
          <div>
            <h3 className="mb-3 flex items-center gap-2 font-semibold text-foreground">
              <AlertCircle className="h-4 w-4 text-destructive" />
              Allergies
            </h3>
            <div className="flex flex-wrap gap-2">
              {patient.allergies.length > 0 && patient.allergies[0] !== "None" ? (
                patient.allergies.map((allergy, index) => (
                  <Badge
                    key={index}
                    variant="outline"
                    className="border-destructive/50 bg-destructive/10 text-destructive"
                  >
                    {allergy}
                  </Badge>
                ))
              ) : (
                <span className="text-sm text-muted-foreground">No known allergies</span>
              )}
            </div>
          </div>

          {/* Notes */}
          <div>
            <h3 className="mb-2 font-semibold text-foreground">Doctor&apos;s Notes</h3>
            <p className="rounded-lg bg-muted/50 p-4 text-sm text-muted-foreground">
              {patient.notes}
            </p>
          </div>

          {/* Actions */}
          <div className="flex flex-wrap gap-3 border-t pt-4">
            <Link href="/scan">
              <Button>
                <FileText className="mr-2 h-4 w-4" />
                Scan Prescription
              </Button>
            </Link>
            <Link href="/chat">
              <Button variant="outline">
                <Stethoscope className="mr-2 h-4 w-4" />
                Ask About Patient
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Scanned Prescriptions */}
      {patientPrescriptions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Scanned Prescriptions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {patientPrescriptions.map((rx) => (
              <div key={rx.id} className="rounded-lg border p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-medium text-foreground">{rx.drugName}</p>
                    <p className="text-sm text-muted-foreground">
                      {rx.dosage} - {rx.frequency}
                    </p>
                  </div>
                  <Badge
                    variant="outline"
                    className={
                      rx.confidence >= 0.9
                        ? "bg-success/10 text-success"
                        : "bg-warning/10 text-warning-foreground"
                    }
                  >
                    {Math.round(rx.confidence * 100)}% confidence
                  </Badge>
                </div>
                {rx.simplifiedExplanation && (
                  <p className="mt-2 text-sm text-muted-foreground">
                    {rx.simplifiedExplanation}
                  </p>
                )}
                <p className="mt-2 text-xs text-muted-foreground">
                  Scanned on {new Date(rx.scannedAt).toLocaleDateString()}
                </p>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}

export default function HealthPage() {
  return (
    <AppLayout>
      <HealthContent />
    </AppLayout>
  );
}
