"use client";

import { useState } from "react";
import {
  User,
  Heart,
  Pill,
  AlertTriangle,
  Calendar,
  Droplet,
  FileText,
  Phone,
  Mail,
  Clock,
  Download,
  Share2,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/use-auth";
import { usePatients } from "@/context/patient-context";

// Mock patient health data
const patientData = {
  bloodType: "O+",
  dateOfBirth: "1985-03-15",
  height: "5'10\"",
  weight: "175 lbs",
  allergies: ["Penicillin", "Shellfish"],
  conditions: ["Type 2 Diabetes", "Hypertension"],
  emergencyContact: {
    name: "Jane Smith",
    relationship: "Spouse",
    phone: "(555) 123-4567",
  },
  primaryDoctor: {
    name: "Dr. Sarah Johnson",
    specialty: "Internal Medicine",
    phone: "(555) 987-6543",
    email: "sjohnson@medclinic.com",
  },
};

export default function PatientHealthPage() {
  const { user } = useAuth();
  const { prescriptions } = usePatients();
  const [activeTab, setActiveTab] = useState("overview");

  const age = new Date().getFullYear() - new Date(patientData.dateOfBirth).getFullYear();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">My Health Card</h1>
          <p className="text-muted-foreground">
            Your personal health information at a glance
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Share2 className="mr-2 h-4 w-4" />
            Share
          </Button>
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Download
          </Button>
        </div>
      </div>

      {/* Profile Card */}
      <Card className="overflow-hidden">
        <div className="h-24 bg-gradient-to-r from-primary/20 via-primary/10 to-accent/10" />
        <CardContent className="-mt-12 flex flex-col items-center pb-6 text-center sm:flex-row sm:items-end sm:text-left">
          <div className="flex h-24 w-24 items-center justify-center rounded-full border-4 border-card bg-primary/10">
            <User className="h-12 w-12 text-primary" />
          </div>
          <div className="mt-4 sm:ml-4 sm:mt-0 sm:pb-2">
            <h2 className="text-xl font-bold text-foreground">{user?.name || "Patient"}</h2>
            <p className="text-muted-foreground">{age} years old</p>
          </div>
          <div className="mt-4 flex flex-wrap justify-center gap-2 sm:ml-auto sm:mt-0">
            <Badge className="bg-primary/10 text-primary">
              <Droplet className="mr-1 h-3 w-3" />
              {patientData.bloodType}
            </Badge>
            <Badge variant="outline">{patientData.height}</Badge>
            <Badge variant="outline">{patientData.weight}</Badge>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="medications">Medications</TabsTrigger>
          <TabsTrigger value="allergies">Allergies</TabsTrigger>
          <TabsTrigger value="contacts">Contacts</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-4 space-y-4">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {/* Quick Stats */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                  <Pill className="h-4 w-4" />
                  Active Medications
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-foreground">{prescriptions.length}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                  <AlertTriangle className="h-4 w-4" />
                  Known Allergies
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-foreground">{patientData.allergies.length}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                  <Heart className="h-4 w-4" />
                  Conditions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-foreground">{patientData.conditions.length}</p>
              </CardContent>
            </Card>
          </div>

          {/* Conditions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="h-5 w-5 text-primary" />
                Medical Conditions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {patientData.conditions.map((condition, idx) => (
                  <Badge key={idx} variant="secondary" className="text-sm">
                    {condition}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="medications" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Pill className="h-5 w-5 text-primary" />
                Current Medications
              </CardTitle>
            </CardHeader>
            <CardContent>
              {prescriptions.length === 0 ? (
                <div className="py-8 text-center">
                  <Pill className="mx-auto mb-4 h-12 w-12 text-muted-foreground/50" />
                  <p className="text-muted-foreground">No medications on file</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Scan a prescription to add medications
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {prescriptions.map((rx) => (
                    <div
                      key={rx.id}
                      className="flex items-center justify-between rounded-lg border p-4"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                          <Pill className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium text-foreground">{rx.drugName}</p>
                          <p className="text-sm text-muted-foreground">
                            {rx.dosage} - {rx.frequency}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          Added {new Date(rx.scannedAt).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="allergies" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-destructive" />
                Allergies & Sensitivities
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3 sm:grid-cols-2">
                {patientData.allergies.map((allergy, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-3 rounded-lg border border-destructive/20 bg-destructive/5 p-4"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-destructive/10">
                      <AlertTriangle className="h-5 w-5 text-destructive" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{allergy}</p>
                      <p className="text-sm text-muted-foreground">Known allergy</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="contacts" className="mt-4 space-y-4">
          {/* Primary Doctor */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5 text-primary" />
                Primary Care Physician
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="font-medium text-foreground">{patientData.primaryDoctor.name}</p>
                  <p className="text-sm text-muted-foreground">{patientData.primaryDoctor.specialty}</p>
                </div>
                <div className="flex gap-2">
                  <a href={`tel:${patientData.primaryDoctor.phone}`}>
                    <Button variant="outline" size="sm">
                      <Phone className="mr-2 h-4 w-4" />
                      Call
                    </Button>
                  </a>
                  <a href={`mailto:${patientData.primaryDoctor.email}`}>
                    <Button variant="outline" size="sm">
                      <Mail className="mr-2 h-4 w-4" />
                      Email
                    </Button>
                  </a>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Emergency Contact */}
          <Card className="border-destructive/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Phone className="h-5 w-5 text-destructive" />
                Emergency Contact
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="font-medium text-foreground">{patientData.emergencyContact.name}</p>
                  <p className="text-sm text-muted-foreground">{patientData.emergencyContact.relationship}</p>
                </div>
                <a href={`tel:${patientData.emergencyContact.phone}`}>
                  <Button variant="destructive" size="sm">
                    <Phone className="mr-2 h-4 w-4" />
                    {patientData.emergencyContact.phone}
                  </Button>
                </a>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
