export interface ManagedCallNumber {
  id: string;
  phoneNumber: string;
  verified: boolean;
  assignedToUserId: string;
  assignedToName: string;
  createdByUserId: string;
  createdAt: string;
  updatedAt: string;
}

const CALL_NUMBERS_PREFIX = "tasknova_call_numbers";

function getStorageKey(orgId: string): string {
  return `${CALL_NUMBERS_PREFIX}_${orgId}`;
}

export function normalizePhoneNumber(value: string): string {
  const trimmed = (value || "").trim();
  if (!trimmed) return "";

  const keepPlus = trimmed.startsWith("+");
  const digitsOnly = trimmed.replace(/[^\d]/g, "");
  return `${keepPlus ? "+" : ""}${digitsOnly}`;
}

export function isValidDialNumber(value: string): boolean {
  return /^\+?[1-9]\d{7,14}$/.test(value);
}

export function getCallNumbers(orgId: string): ManagedCallNumber[] {
  if (!orgId) return [];

  try {
    const raw = localStorage.getItem(getStorageKey(orgId));
    if (!raw) return [];

    const parsed = JSON.parse(raw) as ManagedCallNumber[];
    if (!Array.isArray(parsed)) return [];

    return parsed;
  } catch {
    return [];
  }
}

export function saveCallNumbers(orgId: string, numbers: ManagedCallNumber[]): void {
  if (!orgId) return;
  localStorage.setItem(getStorageKey(orgId), JSON.stringify(numbers));
}

export function addCallNumber(
  orgId: string,
  phoneNumberInput: string,
  createdByUserId: string
): { ok: boolean; error?: string; number?: ManagedCallNumber } {
  const normalized = normalizePhoneNumber(phoneNumberInput);

  if (!normalized) {
    return { ok: false, error: "Phone number is required." };
  }

  if (!isValidDialNumber(normalized)) {
    return { ok: false, error: "Enter a valid phone number in international format." };
  }

  const existing = getCallNumbers(orgId);
  const duplicate = existing.some((item) => item.phoneNumber === normalized);
  if (duplicate) {
    return { ok: false, error: "This number already exists." };
  }

  const nowIso = new Date().toISOString();
  const next: ManagedCallNumber = {
    id: crypto.randomUUID(),
    phoneNumber: normalized,
    verified: false,
    assignedToUserId: "",
    assignedToName: "",
    createdByUserId,
    createdAt: nowIso,
    updatedAt: nowIso,
  };

  saveCallNumbers(orgId, [next, ...existing]);
  return { ok: true, number: next };
}

export function verifyCallNumber(orgId: string, numberId: string): ManagedCallNumber[] {
  const existing = getCallNumbers(orgId);
  const updated = existing.map((item) =>
    item.id === numberId
      ? {
          ...item,
          verified: true,
          updatedAt: new Date().toISOString(),
        }
      : item
  );

  saveCallNumbers(orgId, updated);
  return updated;
}

export function assignCallNumber(
  orgId: string,
  numberId: string,
  userId: string,
  userName: string
): ManagedCallNumber[] {
  const existing = getCallNumbers(orgId);

  const updated = existing.map((item) =>
    item.id === numberId
      ? {
          ...item,
          assignedToUserId: userId,
          assignedToName: userName,
          updatedAt: new Date().toISOString(),
        }
      : item
  );

  saveCallNumbers(orgId, updated);
  return updated;
}

export function getAssignedNumbersForUser(orgId: string, userId: string): ManagedCallNumber[] {
  if (!orgId || !userId) return [];

  return getCallNumbers(orgId)
    .filter((item) => item.assignedToUserId === userId && item.verified)
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}
