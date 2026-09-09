"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Search,
  CheckCircle2,
  XCircle,
  Clock,
  Ban,
  Eye,
  Edit2,
  X,
  FileSpreadsheet,
  Ticket,
  Loader2,
} from "lucide-react";

interface RegistrationItem {
  id: string;
  registrationNumber: string | null;
  bibNumber: string | null;
  status: string;
  createdAt: Date | string;
  participant: {
    id: string;
    fullName: string;
    mobile: string;
    email: string;
    dob: string;
    gender: string;
    city: string;
    state: string;
    emergencyName: string;
    emergencyMobile: string;
    tshirtSize: string | null;
    bloodGroup: string | null;
    runningExp: string | null;
  };
  payment: {
    id: string;
    amount: number;
    transactionId: string | null;
    status: string;
    rejectionReason: string | null;
  } | null;
}

export default function RegistrationsClient({
  initialRegistrations,
}: {
  initialRegistrations: RegistrationItem[];
}) {
  const router = useRouter();
  const [registrations, setRegistrations] = useState<RegistrationItem[]>(initialRegistrations);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  // Modal states
  const [viewingItem, setViewingItem] = useState<RegistrationItem | null>(null);
  const [editingItem, setEditingItem] = useState<RegistrationItem | null>(null);
  const [editForm, setEditForm] = useState({
    fullName: "",
    tshirtSize: "M",
    bloodGroup: "O+",
    emergencyName: "",
    emergencyMobile: "",
  });
  const [loading, setLoading] = useState(false);

  const filtered = registrations.filter((r) => {
    if (statusFilter !== "ALL" && r.status !== statusFilter) {
      return false;
    }

    if (search.trim()) {
      const q = search.toLowerCase();
      const name = r.participant.fullName.toLowerCase();
      const mob = r.participant.mobile.toLowerCase();
      const mail = r.participant.email.toLowerCase();
      const reg = (r.registrationNumber || "").toLowerCase();
      const bib = (r.bibNumber || "").toLowerCase();
      const utr = (r.payment?.transactionId || "").toLowerCase();

      return (
        name.includes(q) ||
        mob.includes(q) ||
        mail.includes(q) ||
        reg.includes(q) ||
        bib.includes(q) ||
        utr.includes(q)
      );
    }

    return true;
  });

  const openEditModal = (item: RegistrationItem) => {
    setEditingItem(item);
    setEditForm({
      fullName: item.participant.fullName,
      tshirtSize: item.participant.tshirtSize || "M",
      bloodGroup: item.participant.bloodGroup || "O+",
      emergencyName: item.participant.emergencyName,
      emergencyMobile: item.participant.emergencyMobile,
    });
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;

    setLoading(true);

    try {
      const res = await fetch(`/api/admin/registrations/${editingItem.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ participant: editForm }),
      });

      if (!res.ok) {
        alert("Failed to update details");
        return;
      }

      setRegistrations((prev) =>
        prev.map((r) =>
          r.id === editingItem.id
            ? {
                ...r,
                participant: {
                  ...r.participant,
                  ...editForm,
                },
              }
            : r
        )
      );

      setEditingItem(null);
      router.refresh();
    } catch (err) {
      console.error(err);
      alert("Error saving details");
    } finally {
      setLoading(false);
    }
  };

  const handleCancelRegistration = async (item: RegistrationItem) => {
    const reason = prompt(
      `Enter reason for cancelling registration for ${item.participant.fullName}:`
    );
    if (!reason || !reason.trim()) return;

    setLoading(true);

    try {
      const res = await fetch(`/api/admin/registrations/${item.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "CANCEL", reason: reason.trim() }),
      });

      if (!res.ok) {
        alert("Failed to cancel registration");
        return;
      }

      setRegistrations((prev) =>
        prev.map((r) => (r.id === item.id ? { ...r, status: "CANCELLED" } : r))
      );

      router.refresh();
    } catch (err) {
      console.error(err);
      alert("Error cancelling registration");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight">
            Registration Management
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Search, filter, view complete participant profiles, and edit permitted details.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/api/admin/export"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 transition-colors"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
            <span>Download CSV Roster</span>
          </Link>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search Name, Mobile, Email, Reg #, Bib, UTR..."
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-orange-500 transition-colors"
          />
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
        </div>

        <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs w-full sm:w-auto overflow-x-auto">
          {["ALL", "CONFIRMED", "PENDING", "REJECTED", "CANCELLED"].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-lg font-bold transition-colors whitespace-nowrap ${
                statusFilter === st
                  ? "bg-orange-500 text-white shadow-sm"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950/80 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
              <tr>
                <th className="px-4 py-3.5">Runner Name</th>
                <th className="px-4 py-3.5">Contact Details</th>
                <th className="px-4 py-3.5">BIB / REG NO.</th>
                <th className="px-4 py-3.5">Reg Status</th>
                <th className="px-4 py-3.5">T-Shirt &amp; Blood</th>
                <th className="px-4 py-3.5">Payment</th>
                <th className="px-4 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center text-slate-500">
                    No registrations found.
                  </td>
                </tr>
              ) : (
                filtered.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-800/20 transition-colors">
                    <td className="px-4 py-3.5">
                      <span className="font-bold text-white block text-sm">
                        {item.participant.fullName}
                      </span>
                      <span className="text-[10px] text-slate-500">
                        {item.participant.gender} • {item.participant.city}, {item.participant.state}
                      </span>
                    </td>

                    <td className="px-4 py-3.5">
                      <span className="block">{item.participant.mobile}</span>
                      <span className="text-[10px] text-slate-500">{item.participant.email}</span>
                    </td>

                    <td className="px-4 py-3.5 font-mono min-w-[110px]">
                      {item.status === "CONFIRMED" && (item.bibNumber || item.registrationNumber) ? (
                        <span className="font-black text-orange-400 text-sm block tracking-wider">
                          {item.bibNumber || item.registrationNumber}
                        </span>
                      ) : (
                        <span className="text-slate-500 italic text-xs">Unassigned</span>
                      )}
                    </td>

                    <td className="px-4 py-3.5">
                      {item.status === "CONFIRMED" && (
                        <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold">
                          CONFIRMED
                        </span>
                      )}
                      {item.status === "PENDING" && (
                        <span className="px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30 text-[10px] font-bold">
                          PENDING
                        </span>
                      )}
                      {item.status === "REJECTED" && (
                        <span className="px-2.5 py-1 rounded-full bg-rose-500/20 text-rose-400 border border-rose-500/30 text-[10px] font-bold">
                          REJECTED
                        </span>
                      )}
                      {item.status === "CANCELLED" && (
                        <span className="px-2.5 py-1 rounded-full bg-slate-700/60 text-slate-400 border border-slate-700 text-[10px] font-bold">
                          CANCELLED
                        </span>
                      )}
                    </td>

                    <td className="px-4 py-3.5">
                      <span className="font-semibold text-slate-200">
                        {item.participant.tshirtSize || "M"}
                      </span>
                      <span className="text-slate-500 text-[10px] block">
                        Blood: {item.participant.bloodGroup || "N/A"}
                      </span>
                    </td>

                    <td className="px-4 py-3.5">
                      <span
                        className={`text-xs font-semibold ${
                          item.payment?.status === "VERIFIED"
                            ? "text-emerald-400"
                            : item.payment?.status === "REJECTED"
                            ? "text-rose-400"
                            : "text-amber-400"
                        }`}
                      >
                        {item.payment?.status || "PENDING"}
                      </span>
                      {item.payment?.transactionId && (
                        <span className="text-[10px] font-mono text-slate-500 block truncate max-w-[100px]">
                          {item.payment.transactionId}
                        </span>
                      )}
                    </td>

                    <td className="px-4 py-3.5 text-right space-x-1.5">
                      <button
                        onClick={() => setViewingItem(item)}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300"
                        title="View Full Profile"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => openEditModal(item)}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-orange-400"
                        title="Edit Details"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>

                      {item.status === "CONFIRMED" && (
                        <Link
                          href={`/card/${item.id}`}
                          target="_blank"
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-400 inline-block"
                          title="View Digital Pass"
                        >
                          <Ticket className="w-3.5 h-3.5" />
                        </Link>
                      )}

                      {item.status !== "CANCELLED" && (
                        <button
                          onClick={() => handleCancelRegistration(item)}
                          className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400"
                          title="Cancel Registration"
                        >
                          <Ban className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* View Modal */}
      {viewingItem && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-5 shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <h3 className="text-lg font-bold text-white uppercase">Participant Profile</h3>
                <span className="text-xs text-orange-400 font-mono font-bold">
                  BIB / REG NO: {viewingItem.status === "CONFIRMED" ? (viewingItem.bibNumber || viewingItem.registrationNumber || "Unassigned") : "Unassigned"}
                </span>
              </div>
              <button
                onClick={() => setViewingItem(null)}
                className="p-1 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-slate-500 uppercase font-semibold text-[10px] block">
                  Full Name
                </span>
                <span className="text-sm font-bold text-white">
                  {viewingItem.participant.fullName}
                </span>
              </div>
              <div>
                <span className="text-slate-500 uppercase font-semibold text-[10px] block">
                  Mobile Number
                </span>
                <span className="text-sm font-bold text-white">
                  +91 {viewingItem.participant.mobile}
                </span>
              </div>
              <div>
                <span className="text-slate-500 uppercase font-semibold text-[10px] block">
                  Email Address
                </span>
                <span className="text-white font-medium">{viewingItem.participant.email}</span>
              </div>
              <div>
                <span className="text-slate-500 uppercase font-semibold text-[10px] block">
                  DOB &amp; Gender
                </span>
                <span className="text-white font-medium">
                  {viewingItem.participant.dob} ({viewingItem.participant.gender})
                </span>
              </div>
              <div>
                <span className="text-slate-500 uppercase font-semibold text-[10px] block">
                  City &amp; State
                </span>
                <span className="text-white font-medium">
                  {viewingItem.participant.city}, {viewingItem.participant.state}
                </span>
              </div>
              <div>
                <span className="text-slate-500 uppercase font-semibold text-[10px] block">
                  T-Shirt Size &amp; Blood
                </span>
                <span className="text-white font-medium">
                  {viewingItem.participant.tshirtSize || "M"} • {viewingItem.participant.bloodGroup || "N/A"}
                </span>
              </div>
              <div className="col-span-2 pt-2 border-t border-slate-800">
                <span className="text-slate-500 uppercase font-semibold text-[10px] block">
                  Emergency Contact
                </span>
                <span className="text-white font-medium">
                  {viewingItem.participant.emergencyName} (+91 {viewingItem.participant.emergencyMobile})
                </span>
              </div>
              <div className="col-span-2 pt-2 border-t border-slate-800">
                <span className="text-slate-500 uppercase font-semibold text-[10px] block">
                  Running Experience
                </span>
                <span className="text-white font-medium">
                  {viewingItem.participant.runningExp || "First-time 10K"}
                </span>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setViewingItem(null)}
                className="px-5 py-2.5 rounded-xl bg-slate-800 text-xs font-bold text-white hover:bg-slate-700"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editingItem && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 sm:p-8 space-y-5 shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <h3 className="text-base font-bold text-white uppercase flex items-center gap-2">
                <Edit2 className="w-4 h-4 text-orange-400" />
                Edit Participant Details
              </h3>
              <button
                onClick={() => setEditingItem(null)}
                className="p-1 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-bold uppercase mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={editForm.fullName}
                  onChange={(e) => setEditForm({ ...editForm, fullName: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-bold uppercase mb-1">T-Shirt Size</label>
                  <select
                    value={editForm.tshirtSize}
                    onChange={(e) => setEditForm({ ...editForm, tshirtSize: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white"
                  >
                    <option value="XS">XS</option>
                    <option value="S">S</option>
                    <option value="M">M</option>
                    <option value="L">L</option>
                    <option value="XL">XL</option>
                    <option value="XXL">XXL</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-bold uppercase mb-1">Blood Group</label>
                  <select
                    value={editForm.bloodGroup}
                    onChange={(e) => setEditForm({ ...editForm, bloodGroup: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white"
                  >
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-bold uppercase mb-1">
                  Emergency Contact Name
                </label>
                <input
                  type="text"
                  required
                  value={editForm.emergencyName}
                  onChange={(e) => setEditForm({ ...editForm, emergencyName: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold uppercase mb-1">
                  Emergency Contact Mobile
                </label>
                <input
                  type="tel"
                  maxLength={10}
                  required
                  value={editForm.emergencyMobile}
                  onChange={(e) => setEditForm({ ...editForm, emergencyMobile: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingItem(null)}
                  className="px-4 py-2 rounded-xl text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-5 py-2.5 rounded-xl athletic-gradient text-white font-bold shadow-md hover:opacity-95 disabled:opacity-50"
                >
                  {loading ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
