"use client";

import { useState } from "react";
import {
  Users,
  Search,
  Filter,
  User,
  Droplet,
  AlertTriangle,
  Pill,
  Phone,
  Mail,
  Calendar,
  ChevronRight,
  X,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import patientsData from "@/data/patients.json";

type Patient = (typeof patientsData.patients)[0];

export default function DoctorPatientsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCondition, setFilterCondition] = useState<string>("all");
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);

  const patients = patientsData.patients;

  // Get unique conditions for filter
  const allConditions = Array.from(
    new Set(patients.flatMap((p) => p.conditions))
  );

  // Filter patients
  const filteredPatients = patients.filter((patient) => {
    const matchesSearch =
      patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      patient.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCondition =
      filterCondition === "all" || patient.conditions.includes(filterCondition);
    return matchesSearch && matchesCondition;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Patients</h1>
          <p className="text-muted-foreground">
            Manage and view patient records
          </p>
        </div>
        <Button>
          <User className="mr-2 h-4 w-4" />
          Add Patient
        </Button>
      </div>

      {/* Search and Filter */}
      <Card>
        <CardContent className="flex flex-col gap-4 p-4 sm:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search patients by name or ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select value={filterCondition} onValueChange={setFilterCondition}>
            <SelectTrigger className="w-full sm:w-[200px]">
              <Filter className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Filter by condition" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Conditions</SelectItem>
              {allConditions.map((condition) => (
                <SelectItem key={condition} value={condition}>
                  {condition}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Patient List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" />
            Patient Records ({filteredPatients.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {filteredPatients.length === 0 ? (
            <div className="py-8 text-center">
              <Users className="mx-auto mb-4 h-12 w-12 text-muted-foreground/50" />
              <p className="text-muted-foreground">No patients found</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredPatients.map((patient) => (
                <div
                  key={patient.id}
                  className="flex cursor-pointer items-center justify-between rounded-lg border p-4 transition-colors hover:bg-muted/50"
                  onClick={() => setSelectedPatient(patient)}
                >
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                      <span className="text-lg font-semibold text-primary">
                        {patient.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{patient.name}</p>
                      <p className="text-sm text-muted-foreground">
                        ID: {patient.id} | Age: {new Date().getFullYear() - new Date(patient.dateOfBirth).getFullYear()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="hidden flex-wrap gap-1 sm:flex">
                      <Badge variant="outline" className="gap-1">
                        <Droplet className="h-3 w-3" />
                        {patient.bloodType}
                      </Badge>
                      {patient.allergies.length > 0 && (
                        <Badge variant="outline" className="gap-1 bg-destructive/10 text-destructive border-destructive/20">
                          <AlertTriangle className="h-3 w-3" />
                          {patient.allergies.length} Allergies
                        </Badge>
                      )}
                    </div>
                    <ChevronRight className="h-5 w-5 text-muted-foreground" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Patient Detail Sheet */}
      <Sheet open={!!selectedPatient} onOpenChange={() => setSelectedPatient(null)}>
        <SheetContent className="overflow-y-auto sm:max-w-lg">
          {selectedPatient && (
            <>
              <SheetHeader>
                <SheetTitle className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                    <span className="text-lg font-semibold text-primary">
                      {selectedPatient.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </span>
                  </div>
                  <div>
                    <p>{selectedPatient.name}</p>
                    <p className="text-sm font-normal text-muted-foreground">
                      Patient ID: {selectedPatient.id}
                    </p>
                  </div>
                </SheetTitle>
              </SheetHeader>

              <div className="mt-6 space-y-6">
                {/* Basic Info */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="rounded-lg bg-muted/50 p-3">
                    <p className="text-xs text-muted-foreground">Blood Type</p>
                    <p className="font-medium text-foreground">{selectedPatient.bloodType}</p>
                  </div>
                  <div className="rounded-lg bg-muted/50 p-3">
                    <p className="text-xs text-muted-foreground">Date of Birth</p>
                    <p className="font-medium text-foreground">
                      {new Date(selectedPatient.dateOfBirth).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="rounded-lg bg-muted/50 p-3">
                    <p className="text-xs text-muted-foreground">Height</p>
                    <p className="font-medium text-foreground">{selectedPatient.height}</p>
                  </div>
                  <div className="rounded-lg bg-muted/50 p-3">
                    <p className="text-xs text-muted-foreground">Weight</p>
                    <p className="font-medium text-foreground">{selectedPatient.weight}</p>
                  </div>
                </div>

                {/* Conditions */}
                <div>
                  <h3 className="mb-2 text-sm font-medium text-foreground">Medical Conditions</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedPatient.conditions.map((condition, idx) => (
                      <Badge key={idx} variant="secondary">
                        {condition}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Allergies */}
                <div>
                  <h3 className="mb-2 text-sm font-medium text-foreground">Allergies</h3>
                  {selectedPatient.allergies.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No known allergies</p>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {selectedPatient.allergies.map((allergy, idx) => (
                        <Badge
                          key={idx}
                          variant="outline"
                          className="bg-destructive/10 text-destructive border-destructive/20"
                        >
                          <AlertTriangle className="mr-1 h-3 w-3" />
                          {allergy}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>

                {/* Medications */}
                <div>
                  <h3 className="mb-2 text-sm font-medium text-foreground">Current Medications</h3>
                  <div className="space-y-2">
                    {selectedPatient.medications.map((med, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-3 rounded-lg border p-3"
                      >
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent/10">
                          <Pill className="h-4 w-4 text-accent" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-foreground">{med.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {med.dosage} - {med.frequency}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Emergency Contact */}
                <div>
                  <h3 className="mb-2 text-sm font-medium text-foreground">Emergency Contact</h3>
                  <div className="rounded-lg border p-3">
                    <p className="font-medium text-foreground">
                      {selectedPatient.emergencyContact.name}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {selectedPatient.emergencyContact.relationship}
                    </p>
                    <div className="mt-2 flex gap-2">
                      <a href={`tel:${selectedPatient.emergencyContact.phone}`}>
                        <Button size="sm" variant="outline">
                          <Phone className="mr-1 h-3 w-3" />
                          Call
                        </Button>
                      </a>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-4 border-t">
                  <Button className="flex-1">
                    <Pill className="mr-2 h-4 w-4" />
                    Write Prescription
                  </Button>
                  <Button variant="outline" className="flex-1">
                    <Calendar className="mr-2 h-4 w-4" />
                    Schedule
                  </Button>
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
