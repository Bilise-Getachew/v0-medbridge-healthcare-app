"use client";

import { useState } from "react";
import {
  FileEdit,
  Search,
  Plus,
  Pill,
  Clock,
  User,
  Check,
  AlertCircle,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { usePatients } from "@/context/patient-context";
import patientsData from "@/data/patients.json";

// Common medications for quick selection
const commonMedications = [
  { name: "Amoxicillin", dosages: ["250mg", "500mg"] },
  { name: "Lisinopril", dosages: ["5mg", "10mg", "20mg"] },
  { name: "Metformin", dosages: ["500mg", "850mg", "1000mg"] },
  { name: "Atorvastatin", dosages: ["10mg", "20mg", "40mg"] },
  { name: "Omeprazole", dosages: ["20mg", "40mg"] },
];

const frequencies = [
  "Once daily",
  "Twice daily",
  "Three times daily",
  "Every 8 hours",
  "Every 12 hours",
  "As needed",
  "Before meals",
  "After meals",
];

export default function DoctorPrescriptionsPage() {
  const { prescriptions, addPrescription } = usePatients();
  const [searchQuery, setSearchQuery] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    patientId: "",
    drugName: "",
    dosage: "",
    frequency: "",
    instructions: "",
  });
  const [success, setSuccess] = useState(false);

  const patients = patientsData.patients;

  const filteredPrescriptions = prescriptions.filter(
    (rx) =>
      rx.drugName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rx.patientId.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.drugName || !formData.dosage || !formData.frequency) {
      return;
    }

    addPrescription({
      id: `rx-${Date.now()}`,
      drugName: formData.drugName,
      dosage: formData.dosage,
      frequency: formData.frequency,
      instructions: formData.instructions || "Take as directed",
      confidence: 1,
      patientId: formData.patientId || "unassigned",
      scannedAt: new Date().toISOString(),
    });

    setSuccess(true);
    setTimeout(() => {
      setSuccess(false);
      setDialogOpen(false);
      setFormData({
        patientId: "",
        drugName: "",
        dosage: "",
        frequency: "",
        instructions: "",
      });
    }, 1500);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Prescriptions</h1>
          <p className="text-muted-foreground">
            Create and manage patient prescriptions
          </p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              New Prescription
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Write Prescription</DialogTitle>
            </DialogHeader>
            
            {success ? (
              <div className="flex flex-col items-center py-8">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-success/20">
                  <Check className="h-8 w-8 text-success" />
                </div>
                <p className="font-medium text-success">Prescription created!</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label>Patient</Label>
                  <Select
                    value={formData.patientId}
                    onValueChange={(v) => setFormData({ ...formData, patientId: v })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select patient" />
                    </SelectTrigger>
                    <SelectContent>
                      {patients.map((patient) => (
                        <SelectItem key={patient.id} value={patient.id}>
                          {patient.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Medication</Label>
                  <Select
                    value={formData.drugName}
                    onValueChange={(v) => setFormData({ ...formData, drugName: v, dosage: "" })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select medication" />
                    </SelectTrigger>
                    <SelectContent>
                      {commonMedications.map((med) => (
                        <SelectItem key={med.name} value={med.name}>
                          {med.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Dosage</Label>
                  <Select
                    value={formData.dosage}
                    onValueChange={(v) => setFormData({ ...formData, dosage: v })}
                    disabled={!formData.drugName}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select dosage" />
                    </SelectTrigger>
                    <SelectContent>
                      {formData.drugName &&
                        commonMedications
                          .find((m) => m.name === formData.drugName)
                          ?.dosages.map((dosage) => (
                            <SelectItem key={dosage} value={dosage}>
                              {dosage}
                            </SelectItem>
                          ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Frequency</Label>
                  <Select
                    value={formData.frequency}
                    onValueChange={(v) => setFormData({ ...formData, frequency: v })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select frequency" />
                    </SelectTrigger>
                    <SelectContent>
                      {frequencies.map((freq) => (
                        <SelectItem key={freq} value={freq}>
                          {freq}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Additional Instructions</Label>
                  <Textarea
                    placeholder="e.g., Take with food, avoid alcohol..."
                    value={formData.instructions}
                    onChange={(e) => setFormData({ ...formData, instructions: e.target.value })}
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  disabled={!formData.drugName || !formData.dosage || !formData.frequency}
                >
                  <FileEdit className="mr-2 h-4 w-4" />
                  Create Prescription
                </Button>
              </form>
            )}
          </DialogContent>
        </Dialog>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search prescriptions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
        </CardContent>
      </Card>

      {/* Prescriptions List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileEdit className="h-5 w-5 text-primary" />
            All Prescriptions ({filteredPrescriptions.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {filteredPrescriptions.length === 0 ? (
            <div className="py-8 text-center">
              <Pill className="mx-auto mb-4 h-12 w-12 text-muted-foreground/50" />
              <p className="text-muted-foreground">No prescriptions found</p>
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => setDialogOpen(true)}
              >
                <Plus className="mr-2 h-4 w-4" />
                Create First Prescription
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredPrescriptions
                .sort((a, b) => new Date(b.scannedAt).getTime() - new Date(a.scannedAt).getTime())
                .map((rx) => {
                  const patient = patients.find((p) => p.id === rx.patientId);
                  return (
                    <div
                      key={rx.id}
                      className="flex items-center justify-between rounded-lg border p-4 transition-colors hover:bg-muted/50"
                    >
                      <div className="flex items-center gap-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10">
                          <Pill className="h-5 w-5 text-accent" />
                        </div>
                        <div>
                          <p className="font-medium text-foreground">{rx.drugName}</p>
                          <p className="text-sm text-muted-foreground">
                            {rx.dosage} - {rx.frequency}
                          </p>
                          <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
                            <User className="h-3 w-3" />
                            {patient?.name || "Unassigned"}
                            <span className="text-muted-foreground/50">|</span>
                            <Clock className="h-3 w-3" />
                            {new Date(rx.scannedAt).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                      <Badge
                        variant="outline"
                        className={
                          rx.confidence === 1
                            ? "bg-primary/10 text-primary border-primary/20"
                            : "bg-success/10 text-success border-success/20"
                        }
                      >
                        {rx.confidence === 1 ? "Written" : "Scanned"}
                      </Badge>
                    </div>
                  );
                })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
