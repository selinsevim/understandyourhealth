import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Calendar, Plus, Trash2, Edit2, Check, X, Clock, MapPin, Stethoscope, Bell } from "lucide-react";
import { motion } from "framer-motion";
import { format, isPast, isFuture, isToday, differenceInDays } from "date-fns";
import Navbar from "@/components/Navbar";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface FamilyMember {
  id: string;
  name: string;
}

interface Appointment {
  id: string;
  doctor_name: string;
  specialty: string | null;
  appointment_date: string;
  location: string | null;
  notes: string | null;
  remind_before_hours: number;
  member_id: string | null;
  created_at: string;
}

const Appointments = () => {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [members, setMembers] = useState<FamilyMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form state
  const [doctorName, setDoctorName] = useState("");
  const [specialty, setSpecialty] = useState("");
  const [appointmentDate, setAppointmentDate] = useState("");
  const [appointmentTime, setAppointmentTime] = useState("");
  const [location, setLocation] = useState("");
  const [notes, setNotes] = useState("");
  const [remindHours, setRemindHours] = useState(24);
  const [memberId, setMemberId] = useState("");

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }
    fetchData();
  }, [user]);

  const fetchData = async () => {
    const [apptRes, memberRes] = await Promise.all([
      supabase
        .from("appointments")
        .select("*")
        .order("appointment_date", { ascending: true }),
      supabase
        .from("family_members")
        .select("id, name")
        .order("created_at", { ascending: true }),
    ]);
    if (apptRes.data) setAppointments(apptRes.data);
    if (memberRes.data) setMembers(memberRes.data);
    setLoading(false);
  };

  const resetForm = () => {
    setDoctorName("");
    setSpecialty("");
    setAppointmentDate("");
    setAppointmentTime("");
    setLocation("");
    setNotes("");
    setRemindHours(24);
    setMemberId("");
    setShowForm(false);
    setEditingId(null);
  };

  const handleSave = async () => {
    if (!doctorName.trim() || !appointmentDate || !appointmentTime || !user) return;

    const dateTime = new Date(`${appointmentDate}T${appointmentTime}`).toISOString();

    const payload = {
      user_id: user.id,
      doctor_name: doctorName.trim(),
      specialty: specialty.trim() || null,
      appointment_date: dateTime,
      location: location.trim() || null,
      notes: notes.trim() || null,
      remind_before_hours: remindHours,
      member_id: memberId || null,
    };

    if (editingId) {
      const { user_id, ...updatePayload } = payload;
      const { error } = await supabase.from("appointments").update(updatePayload).eq("id", editingId);
      if (error) {
        toast.error("Failed to update appointment");
      } else {
        toast.success("Appointment updated");
        fetchData();
        resetForm();
      }
    } else {
      const { error } = await supabase.from("appointments").insert(payload);
      if (error) {
        toast.error("Failed to add appointment");
      } else {
        toast.success("Appointment added!");
        fetchData();
        resetForm();
      }
    }
  };

  const handleEdit = (appt: Appointment) => {
    setEditingId(appt.id);
    setDoctorName(appt.doctor_name);
    setSpecialty(appt.specialty || "");
    const d = new Date(appt.appointment_date);
    setAppointmentDate(format(d, "yyyy-MM-dd"));
    setAppointmentTime(format(d, "HH:mm"));
    setLocation(appt.location || "");
    setNotes(appt.notes || "");
    setRemindHours(appt.remind_before_hours);
    setMemberId(appt.member_id || "");
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("appointments").delete().eq("id", id);
    if (error) {
      toast.error("Failed to delete appointment");
    } else {
      setAppointments((a) => a.filter((x) => x.id !== id));
      toast.success("Appointment deleted");
    }
  };

  const getMemberName = (id: string | null) => {
    if (!id) return null;
    return members.find((m) => m.id === id)?.name || null;
  };

  const getTimeLabel = (dateStr: string) => {
    const d = new Date(dateStr);
    if (isToday(d)) return "Today";
    const days = differenceInDays(d, new Date());
    if (days === 1) return "Tomorrow";
    if (days > 0 && days <= 7) return `In ${days} days`;
    return null;
  };

  const upcoming = appointments.filter((a) => isFuture(new Date(a.appointment_date)) || isToday(new Date(a.appointment_date)));
  const past = appointments.filter((a) => isPast(new Date(a.appointment_date)) && !isToday(new Date(a.appointment_date)));

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto max-w-2xl px-4 py-12 text-center">
          <Calendar className="mx-auto h-12 w-12 text-muted-foreground" />
          <h2 className="mt-4 font-display text-xl font-semibold text-foreground">Sign in to manage appointments</h2>
          <Link to="/auth" className="mt-4 inline-block rounded-xl px-6 py-3 text-sm font-semibold text-primary-foreground" style={{ backgroundImage: "var(--gradient-button)" }}>
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto max-w-2xl px-4 py-12">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-display text-3xl font-bold text-foreground">Appointments</h1>
            <p className="mt-2 text-muted-foreground">Track your upcoming doctor visits.</p>
          </div>
          {!showForm && (
            <button
              onClick={() => setShowForm(true)}
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm transition-colors hover:bg-primary/90"
            >
              <Plus className="h-4 w-4" />
              Add
            </button>
          )}
        </div>

        {showForm && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mt-6 rounded-xl border border-border bg-card p-5">
            <h3 className="font-display text-base font-semibold text-card-foreground">
              {editingId ? "Edit Appointment" : "New Appointment"}
            </h3>
            <div className="mt-4 space-y-3">
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm font-medium text-foreground">Doctor name *</label>
                  <input
                    value={doctorName}
                    onChange={(e) => setDoctorName(e.target.value)}
                    placeholder="e.g., Dr. Smith"
                    className="w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-foreground">Specialty</label>
                  <input
                    value={specialty}
                    onChange={(e) => setSpecialty(e.target.value)}
                    placeholder="e.g., Cardiologist"
                    className="w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm font-medium text-foreground">Date *</label>
                  <input
                    type="date"
                    value={appointmentDate}
                    onChange={(e) => setAppointmentDate(e.target.value)}
                    className="w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-foreground">Time *</label>
                  <input
                    type="time"
                    value={appointmentTime}
                    onChange={(e) => setAppointmentTime(e.target.value)}
                    className="w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-foreground">Location</label>
                <input
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g., City Hospital, Room 205"
                  className="w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-foreground">Notes</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g., Bring previous lab results"
                  rows={2}
                  className="w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="mb-1 flex items-center gap-1.5 text-sm font-medium text-foreground">
                    <Bell className="h-3.5 w-3.5 text-primary" />
                    Remind me before
                  </label>
                  <select
                    value={remindHours}
                    onChange={(e) => setRemindHours(Number(e.target.value))}
                    className="w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                  >
                    <option value={1}>1 hour</option>
                    <option value={2}>2 hours</option>
                    <option value={6}>6 hours</option>
                    <option value={12}>12 hours</option>
                    <option value={24}>1 day</option>
                    <option value={48}>2 days</option>
                    <option value={72}>3 days</option>
                    <option value={168}>1 week</option>
                  </select>
                </div>
                {members.length > 0 && (
                  <div>
                    <label className="mb-1 block text-sm font-medium text-foreground">For whom?</label>
                    <select
                      value={memberId}
                      onChange={(e) => setMemberId(e.target.value)}
                      className="w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                    >
                      <option value="">Myself</option>
                      {members.map((m) => (
                        <option key={m.id} value={m.id}>{m.name}</option>
                      ))}
                    </select>
                  </div>
                )}
              </div>
            </div>
            <div className="mt-4 flex gap-2">
              <button
                onClick={handleSave}
                disabled={!doctorName.trim() || !appointmentDate || !appointmentTime}
                className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50"
              >
                <Check className="h-4 w-4" />
                {editingId ? "Update" : "Add"}
              </button>
              <button
                onClick={resetForm}
                className="inline-flex items-center gap-1.5 rounded-xl border border-border px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted"
              >
                <X className="h-4 w-4" />
                Cancel
              </button>
            </div>
          </motion.div>
        )}

        {loading ? (
          <div className="mt-12 text-center text-muted-foreground">Loading…</div>
        ) : appointments.length === 0 && !showForm ? (
          <div className="mt-12 flex flex-col items-center gap-4 py-16 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-muted">
              <Calendar className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="font-display text-lg font-medium text-foreground">No appointments yet</h3>
            <p className="max-w-sm text-sm text-muted-foreground">
              Add your upcoming doctor visits to keep track and get reminders.
            </p>
          </div>
        ) : (
          <div className="mt-6 space-y-8">
            {upcoming.length > 0 && (
              <div>
                <h2 className="mb-3 font-display text-sm font-semibold uppercase tracking-wider text-primary">Upcoming</h2>
                <div className="space-y-3">
                  {upcoming.map((appt) => {
                    const timeLabel = getTimeLabel(appt.appointment_date);
                    return (
                      <motion.div
                        key={appt.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="rounded-xl border border-border bg-card p-4 transition-colors hover:bg-muted/50"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              <Stethoscope className="h-4 w-4 text-primary" />
                              <span className="font-medium text-card-foreground">{appt.doctor_name}</span>
                              {appt.specialty && (
                                <span className="rounded-md bg-muted px-1.5 py-0.5 text-xs text-muted-foreground">{appt.specialty}</span>
                              )}
                              {getMemberName(appt.member_id) && (
                                <span className="rounded-md bg-primary/10 px-1.5 py-0.5 text-xs text-primary">{getMemberName(appt.member_id)}</span>
                              )}
                            </div>
                            <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <Clock className="h-3.5 w-3.5" />
                                {format(new Date(appt.appointment_date), "MMM d, yyyy · h:mm a")}
                              </span>
                              {timeLabel && (
                                <span className="rounded-md bg-warning/10 px-1.5 py-0.5 text-xs font-medium text-warning">{timeLabel}</span>
                              )}
                              {appt.location && (
                                <span className="flex items-center gap-1">
                                  <MapPin className="h-3.5 w-3.5" />
                                  {appt.location}
                                </span>
                              )}
                            </div>
                            {appt.notes && (
                              <p className="mt-2 text-sm text-muted-foreground">{appt.notes}</p>
                            )}
                          </div>
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => handleEdit(appt)}
                              className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                            >
                              <Edit2 className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(appt.id)}
                              className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            )}

            {past.length > 0 && (
              <div>
                <h2 className="mb-3 font-display text-sm font-semibold uppercase tracking-wider text-muted-foreground">Past</h2>
                <div className="space-y-2">
                  {past.map((appt) => (
                    <div
                      key={appt.id}
                      className="flex items-center justify-between gap-4 rounded-xl border border-border bg-card/50 p-3 opacity-70"
                    >
                      <div className="flex items-center gap-3 overflow-hidden">
                        <Stethoscope className="h-4 w-4 shrink-0 text-muted-foreground" />
                        <div className="min-w-0">
                          <p className="truncate text-sm font-medium text-card-foreground">
                            {appt.doctor_name}
                            {appt.specialty && <span className="ml-1 text-muted-foreground">· {appt.specialty}</span>}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {format(new Date(appt.appointment_date), "MMM d, yyyy · h:mm a")}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleDelete(appt.id)}
                        className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Appointments;
