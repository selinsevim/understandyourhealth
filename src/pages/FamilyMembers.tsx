import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Users, Plus, Trash2, Edit2, Check, X } from "lucide-react";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface FamilyMember {
  id: string;
  name: string;
  age: string | null;
  conditions: string | null;
  created_at: string;
}

const FamilyMembers = () => {
  const { user } = useAuth();
  const [members, setMembers] = useState<FamilyMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [conditions, setConditions] = useState("");

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }
    fetchMembers();
  }, [user]);

  const fetchMembers = async () => {
    const { data, error } = await supabase
      .from("family_members")
      .select("*")
      .order("created_at", { ascending: true });
    if (!error && data) setMembers(data);
    setLoading(false);
  };

  const resetForm = () => {
    setName("");
    setAge("");
    setConditions("");
    setShowForm(false);
    setEditingId(null);
  };

  const handleSave = async () => {
    if (!name.trim() || !user) return;

    if (editingId) {
      const { error } = await supabase
        .from("family_members")
        .update({ name: name.trim(), age: age.trim() || null, conditions: conditions.trim() || null })
        .eq("id", editingId);
      if (error) {
        toast.error("Failed to update member");
      } else {
        toast.success("Member updated");
        fetchMembers();
        resetForm();
      }
    } else {
      const { error } = await supabase.from("family_members").insert({
        user_id: user.id,
        name: name.trim(),
        age: age.trim() || null,
        conditions: conditions.trim() || null,
      });
      if (error) {
        toast.error("Failed to add member");
      } else {
        toast.success("Member added!");
        fetchMembers();
        resetForm();
      }
    }
  };

  const handleEdit = (member: FamilyMember) => {
    setEditingId(member.id);
    setName(member.name);
    setAge(member.age || "");
    setConditions(member.conditions || "");
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("family_members").delete().eq("id", id);
    if (error) {
      toast.error("Failed to delete member");
    } else {
      setMembers((m) => m.filter((x) => x.id !== id));
      toast.success("Member removed");
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto max-w-2xl px-4 py-12 text-center">
          <Users className="mx-auto h-12 w-12 text-muted-foreground" />
          <h2 className="mt-4 font-display text-xl font-semibold text-foreground">Sign in to manage family members</h2>
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
            <h1 className="font-display text-3xl font-bold text-foreground">Family Members</h1>
            <p className="mt-2 text-muted-foreground">Add family members to track their reports separately.</p>
          </div>
          {!showForm && (
            <button
              onClick={() => setShowForm(true)}
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm transition-colors hover:bg-primary/90"
            >
              <Plus className="h-4 w-4" />
              Add Member
            </button>
          )}
        </div>

        {showForm && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mt-6 rounded-xl border border-border bg-card p-5">
            <h3 className="font-display text-base font-semibold text-card-foreground">
              {editingId ? "Edit Member" : "New Member"}
            </h3>
            <div className="mt-4 space-y-3">
              <div>
                <label className="mb-1 block text-sm font-medium text-foreground">Name *</label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g., Emma"
                  className="w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm font-medium text-foreground">Age</label>
                  <input
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    placeholder="e.g., 8"
                    className="w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-foreground">Known conditions</label>
                  <input
                    value={conditions}
                    onChange={(e) => setConditions(e.target.value)}
                    placeholder="e.g., asthma"
                    className="w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
              </div>
            </div>
            <div className="mt-4 flex gap-2">
              <button
                onClick={handleSave}
                disabled={!name.trim()}
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
        ) : members.length === 0 && !showForm ? (
          <div className="mt-12 flex flex-col items-center gap-4 py-16 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-muted">
              <Users className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="font-display text-lg font-medium text-foreground">No members yet</h3>
            <p className="max-w-sm text-sm text-muted-foreground">
              Add family members like your child or partner to track their health reports separately.
            </p>
          </div>
        ) : (
          <div className="mt-6 space-y-3">
            {members.map((member) => (
              <motion.div
                key={member.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center justify-between gap-4 rounded-xl border border-border bg-card p-4 transition-colors hover:bg-muted/50"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                    {member.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-medium text-card-foreground">{member.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {[member.age && `Age: ${member.age}`, member.conditions].filter(Boolean).join(" · ") || "No details"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleEdit(member)}
                    className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                  >
                    <Edit2 className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(member.id)}
                    className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FamilyMembers;
