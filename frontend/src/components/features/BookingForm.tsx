"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Calendar as CalendarIcon, User, Mail, Phone, Stethoscope, FileText, Clock } from "lucide-react";
import { format } from "date-fns";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Calendar } from "../ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { toast } from "sonner";
import { Calendar22 } from "./example-date-picker";

type BookingFormData = {
  fullName: string;
  email: string;
  phone: string;
  doctor: string;
  appointmentDate: Date | undefined;
  timeSlot: string;
  notes: string;
};

const doctors = [
  { id: "dr-smith", name: "Dr. Sarah Smith", specialty: "General Dentistry" },
  { id: "dr-johnson", name: "Dr. Michael Johnson", specialty: "Orthodontics" },
  { id: "dr-williams", name: "Dr. Emily Williams", specialty: "Cosmetic Dentistry" },
  { id: "dr-brown", name: "Dr. James Brown", specialty: "Oral Surgery" },
  { id: "dr-davis", name: "Dr. Lisa Davis", specialty: "Pediatric Dentistry" },
];

const timeSlots = [
  "09:00 AM",
  "10:00 AM",
  "11:00 AM",
  "12:00 PM",
  "02:00 PM",
  "03:00 PM",
  "04:00 PM",
  "05:00 PM",
];

export function BookingForm() {
  const [date, setDate] = useState<Date>();
  const [selectedDoctor, setSelectedDoctor] = useState<string>("");
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>("");

  const { register, handleSubmit, formState: { errors }, reset } = useForm<BookingFormData>();

  const onSubmit = (data: BookingFormData) => {
    const bookingData = {
      ...data,
      doctor: selectedDoctor,
      appointmentDate: date,
      timeSlot: selectedTimeSlot,
    };

    console.log("Booking Data:", bookingData);

    toast.success("Appointment Booked!", {
      description: `Your appointment is scheduled for ${date ? format(date, "PPP") : "a selected date"} at ${selectedTimeSlot || "selected time"}.`,
    });

    // Reset form
    reset();
    setDate(undefined);
    setSelectedDoctor("");
    setSelectedTimeSlot("");
  };

  return (
    <Card className="shadow-xl border-0">
      <CardHeader className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-t-lg">
        <CardTitle>Book Your Appointment</CardTitle>
        <CardDescription className="text-blue-50">
          Fill in your details to schedule a dental appointment
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* User Information Section */}
          <div className="space-y-4">
            <div className="border-b pb-2">
              <h3 className="text-slate-700 flex items-center gap-2">
                <User className="w-5 h-5 text-blue-600" />
                Personal Information
              </h3>
            </div>

            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name *</Label>
              <div className="relative">
                <Input
                  id="fullName"
                  placeholder="John Doe"
                  className={`border-dark border-2`}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address *</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="john@example.com"
                    className={` border-dark border-2 pl-10 `}
                    readOnly
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number *</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+1 (555) 000-0000"
                    className={` border-dark border-2 pl-10 `}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Appointment Details Section */}
          <div className="space-y-4">
            <div className="border-b pb-2">
              <h3 className="text-slate-700 flex items-center gap-2">
                <Stethoscope className="w-5 h-5 text-blue-600" />
                Appointment Details
              </h3>
            </div>

            <div className="space-y-2">
              <Label htmlFor="doctor">Select Doctor *</Label>
              <Select value={selectedDoctor} onValueChange={setSelectedDoctor}>
                <SelectTrigger id="doctor">
                  <SelectValue placeholder="Choose your preferred dentist" />
                </SelectTrigger>
                <SelectContent>
                  {doctors.map((doctor) => (
                    <SelectItem key={doctor.id} value={doctor.id}>
                      <div className="flex flex-col">
                        <span>{doctor.name}</span>
                        <span className="text-xs text-slate-500">{doctor.specialty}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

  <Calendar22/>
          </div>

          {/* Notes Section */}
          <div className="space-y-4">
            <div className="border-b pb-2">
              <h3 className="text-slate-700 flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-600" />
                Additional Information
              </h3>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Notes (Optional)</Label>
              <Textarea
                id="notes"
                placeholder="Please share any specific concerns, symptoms, or special requirements..."
                className="resize-none h-32"
                {...register("notes")}
              />
              <p className="text-xs text-slate-500">
                Let us know about any allergies, medications, or special needs
              </p>
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
              size="lg"
            >
              Book Appointment
            </Button>
          </div>
        </form>
        
      </CardContent>
    </Card>
  );
}
