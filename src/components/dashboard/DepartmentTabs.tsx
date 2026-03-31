"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useMounted } from "@/hooks/useMounted";
import type { Department } from "@/types";

interface DepartmentTabsProps {
  activeDepartment: Department;
  departmentCounts?: { sales: number; service: number };
  onDepartmentChange: (dept: Department) => void;
}

const DEPARTMENTS: { value: Department; label: string }[] = [
  { value: "sales", label: "Sales" },
  { value: "service", label: "Service" },
];

export default function DepartmentTabs({
  activeDepartment,
  departmentCounts,
  onDepartmentChange,
}: DepartmentTabsProps) {
  const mounted = useMounted();

  return (
    <div className="flex flex-col gap-[var(--dash-gap)] w-full min-w-0 overflow-hidden">
      {/* Department Selector (Full width on mobile) */}
      <div className="flex w-full sm:w-fit h-12 mt-1 items-center gap-1 rounded-full bg-muted p-1 shadow-inner border-[var(--dash-border)]">
        {DEPARTMENTS.map((dept) => {
          const isActive = activeDepartment === dept.value;
          return (
            <button
              key={dept.value}
              onClick={() => onDepartmentChange(dept.value)}
              className={cn(
                "relative flex h-full flex-1 sm:flex-initial items-center justify-center gap-2 rounded-full px-4 transition-all duration-[var(--dash-transition-fast)]",
                isActive ? "text-primary z-10" : "text-muted-foreground hover:text-foreground"
              )}
            >
              {isActive && (
                <motion.div
                  layoutId="dept-pill-bg"
                  className="absolute inset-0 rounded-full bg-white text-black shadow-sm ring-1 ring-black/5"
                  transition={{ type: "spring", duration: 0.5, bounce: 0.1 }}
                />
              )}
              <span className={cn("relative z-10 text-sm font-black", isActive ? "text-black" : "text-muted-foreground")}>
                {dept.label}
              </span>
              {mounted && departmentCounts && (
                <span className={cn(
                  "relative z-10 flex h-5 min-w-[20px] items-center justify-center rounded-full px-1.5 text-[10px] font-black transition-colors",
                  isActive ? "bg-muted text-white" : "bg-muted-foreground/20 text-muted-foreground"
                )}>
                  {departmentCounts[dept.value]}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
