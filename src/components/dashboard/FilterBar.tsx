"use client";

import { useMounted } from "@/hooks/useMounted";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import type { Department, Role, SortField, SortOrder, ApplicantStatus } from "@/types";
import { ROLES_BY_DEPARTMENT } from "@/lib/roles";

const STATUS_TABS: { value: ApplicantStatus | "all"; label: string; dotColor: string; activeText: string; activeBorderColor: string }[] = [
  { value: "all", label: "All", dotColor: "bg-chart-1", activeText: "text-chart-1", activeBorderColor: "border-chart-1 border-2" },
  { value: "pending", label: "Pending", dotColor: "bg-chart-1", activeText: "text-chart-1", activeBorderColor: "border-chart-1 border-2" },
  { value: "rejected", label: "Rejected", dotColor: "bg-chart-1", activeText: "text-chart-1", activeBorderColor: "border-chart-1 border-2" },
  { value: "interested", label: "Interested", dotColor: "bg-chart-1", activeText: "text-chart-1", activeBorderColor: "border-chart-1 border-2" },
  { value: "inprocess", label: "In Process", dotColor: "bg-chart-1", activeText: "text-chart-1", activeBorderColor: "border-chart-1 border-2" },
];

interface FilterBarProps {
  department: Department;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedRole: Role | "all";
  onRoleChange: (role: Role | "all") => void;
  sortField: SortField;
  onSortFieldChange: (field: SortField) => void;
  sortOrder: SortOrder;
  onSortOrderChange: (order: SortOrder) => void;
  activeStatus: ApplicantStatus | "all";
  onStatusChange: (status: ApplicantStatus | "all") => void;
  statusCounts?: { all: number; pending: number; interested: number; inprocess: number; rejected: number };
}

const SORT_FIELDS: { value: SortField; label: string }[] = [
  { value: "created_time", label: "Creation Date" },
  { value: "updated", label: "Last Updated" },
  { value: "full_name", label: "Applicant Name" },
  { value: "position", label: "Role Title" },
];

const STATUS_FILTERS: { value: ApplicantStatus | "all"; label: string }[] = [
  { value: "all", label: "All Statuses" },
  { value: "pending", label: "Pending" },
  { value: "interested", label: "Interested" },
  { value: "inprocess", label: "In Process" },
  { value: "rejected", label: "Rejected" },
];

export default function FilterBar({
  department,
  searchQuery,
  onSearchChange,
  selectedRole,
  onRoleChange,
  sortField,
  onSortFieldChange,
  sortOrder,
  onSortOrderChange,
  activeStatus,
  onStatusChange,
  statusCounts,
}: FilterBarProps) {
  const mounted = useMounted();

  const departmentRoles = ROLES_BY_DEPARTMENT[department];
  const activeFiltersCount = 
    (selectedRole !== "all" ? 1 : 0) + 
    (activeStatus !== "all" ? 1 : 0) + 
    (sortField !== "created_time" || sortOrder !== "desc" ? 1 : 0);

  return (
    <div className="flex flex-col gap-[var(--dash-gap)] mb-1 lg:flex-row lg:items-center">
      {/* 🟢 Status Chips (Part of Row now) */}
      <div 
        className="flex min-w-0 flex-1 items-center gap-2 overflow-x-auto pb-1 no-scrollbar scroll-smooth flex-nowrap touch-pan-x"
        data-lenis-prevent
      >
        <div className="flex flex-nowrap items-center gap-2 min-w-0">
          {STATUS_TABS.map((tab) => {
            const isActive = activeStatus === tab.value;
            return (
              <button
                key={tab.value}
                onClick={() => onStatusChange(tab.value)}
                className={cn(
                  "relative flex flex-shrink-0 items-center gap-2 rounded-[var(--dash-card-radius)] px-4 py-2 h-10 border transition-all duration-[var(--dash-transition-fast)]",
                  isActive
                    ? "border-transparent z-10 "
                    : "bg-background border-border text-muted-foreground hover:border-border/80"
                )}
              >
                {isActive && (
                  <motion.div
                    layoutId="status-pill-bg"
                    className={`absolute inset-0 rounded-[var(--dash-card-radius)] ${tab.activeBorderColor} shadow-sm`}
                    transition={{ type: "spring", duration: 0.5, bounce: 0.15 }}
                  />
                )}
                <span className={cn("relative z-10 h-1.5 w-1.5 rounded-full", tab.dotColor)} />
                <span className={cn("relative z-10 text-xs font-black transition-colors duration-300", isActive ? tab.activeText : "text-muted-foreground")}>
                  {tab.label}
                </span>
                {mounted && statusCounts && (
                  <span className={cn(
                    "relative z-10 flex h-[18px] min-w-[18px] items-center justify-center rounded-full px-1.5 text-[9px] font-black transition-colors duration-300",
                    isActive ? `bg-muted shadow-xs ${tab.activeText}` : "bg-muted text-muted-foreground "
                  )}>
                    {statusCounts[tab.value]}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        {/* Search Input */}
        <div className="relative w-full sm:w-64 lg:w-80">
          <svg
            className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>

          {searchQuery && (
            <button
              type="button"
              onClick={() => onSearchChange("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground active:scale-95 transition-all outline-none"
            >
              <svg
                className="h-3 w-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={3}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          )}

          <Input
            placeholder="Quick search..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="h-10 w-full pl-9 pr-9 text-xs font-semibold rounded-[var(--dash-card-radius)] border-[var(--dash-border)] bg-background focus:ring-0 focus:border-border/80 shadow-inner/50"
          />
        </div>
      {/* Filter Popover */}
      {!mounted ? (
        <button
          disabled
          className={cn(
            buttonVariants({ variant: "outline" }),
            "h-10 px-4 rounded-xl border-border opacity-50 flex items-center gap-2"
          )}
        >
          <svg className="h-4 w-4 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
          </svg>
          Filters
        </button>
      ) : (
        <Popover>
          <PopoverTrigger
            className={cn(
              buttonVariants({ variant: "outline" }),
              "h-10 px-4 rounded-[var(--dash-card-radius)] border-[var(--dash-border)] font-semibold text-xs flex items-center gap-2 hover:bg-muted shadow-premium transition-all duration-[var(--dash-transition-fast)]"
            )}
          >
            <svg
              className="h-4 w-4 text-muted-foreground"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
              />
            </svg>
            Filters
            {activeFiltersCount > 0 && (
              <span className="flex h-4 w-4 items-center justify-center rounded-full bg-muted-foreground/20 text-[10px] text-white animate-in zoom-in-50">
                {activeFiltersCount}
              </span>
            )}
          </PopoverTrigger>
          <PopoverContent className="w-72 p-4 rounded-[var(--dash-card-radius)] shadow-xl border-[var(--dash-border)]" align="end" sideOffset={8}>
            <div className="space-y-4">
              <div className="space-y-2">
                <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Sort Mechanism</p>
                <div className="flex items-center gap-2">
                  <Select value={sortField} onValueChange={(v) => v && onSortFieldChange(v as SortField)}>
                    <SelectTrigger className="h-8 flex-1 text-[10px] uppercase font-black text-white rounded-lg border-border/40 bg-background/50">
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl border-primary/10">
                      {SORT_FIELDS.map((f) => (
                        <SelectItem key={f.value} value={f.value} className="text-[10px] uppercase font-black text-white">
                          {f.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button
                    variant="outline"
                    className="h-9 px-2 rounded-lg border-border flex items-center gap-1.5 min-w-[70px]"
                    onClick={() => onSortOrderChange(sortOrder === "asc" ? "desc" : "asc")}
                  >
                    <span className="text-[10px] font-bold uppercase tracking-tighter">
                      {sortOrder === "asc" ? "Asc" : "Desc"}
                    </span>
                    <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                      {sortOrder === "asc" ? (
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
                      ) : (
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                      )}
                    </svg>
                  </Button>
                </div>
              </div>

              <Separator className="bg-border/50" />

              <div className="space-y-2">
                <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Filter By Status</p>
                <Select value={activeStatus} onValueChange={(v) => v && onStatusChange(v as ApplicantStatus | "all")}>
                  <SelectTrigger className="h-8 w-full text-[10px] uppercase font-black text-white rounded-lg border-border/40 bg-background/50">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl border-primary/10">
                    {STATUS_FILTERS.map((s) => (
                      <SelectItem key={s.value} value={s.value} className="text-[10px] uppercase font-black text-white">
                        {s.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Separator className="bg-border/50" />

              <div className="space-y-2">
                <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Filter by Role</p>
                <Select value={selectedRole} onValueChange={(v) => v && onRoleChange(v as Role | "all")}>
                  <SelectTrigger className="h-8 w-full text-[10px] uppercase font-black text-white rounded-lg border-border/40 bg-background/50">
                    <SelectValue placeholder="Filter role" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl border-primary/10">
                    <SelectItem value="all" className="text-[10px] uppercase font-black text-white">All Roles</SelectItem>
                    {departmentRoles.map((role) => (
                      <SelectItem key={role} value={role} className="text-[10px] uppercase font-black text-white">
                        {role}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="pt-2 flex items-center justify-between">
                <button 
                  onClick={() => {
                    onRoleChange("all");
                    onStatusChange("all");
                    onSortFieldChange("created_time");
                    onSortOrderChange("desc");
                  }}
                  className="text-[10px] font-bold text-red-500 hover:underline"
                >
                  Reset all
                </button>
                <p className="text-[10px] text-muted-foreground">
                  {activeFiltersCount} active
                </p>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      )}
      </div>
    </div>
  );
}
