import type { Applicant, ApplicantStatus, Role } from "@/types";

export const mapRow = (row: (string | number)[], index: number): Applicant => {
  let updatedArr: string[] = [];
  const rawUpdated = String(row[7] ?? "[]");
  try {
    const parsed: unknown = JSON.parse(rawUpdated);
    if (Array.isArray(parsed)) {
      updatedArr = parsed.map(String);
    }
  } catch {
    updatedArr = [];
  }

  const rawStatus = String(row[5] ?? "").trim();
  const status = (rawStatus === "" ? "pending" : rawStatus) as ApplicantStatus;

  return {
    id: String(index + 1),
    created_time: String(row[0] ?? ""),
    position: String(row[1] ?? "") as Role,
    full_name: String(row[2] ?? ""),
    phone: String(row[3] ?? ""),
    email: String(row[4] ?? ""),
    status,
    feedback: String(row[6] ?? ""),
    updated: updatedArr,
  };
};
