import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import {
  getTransportConfig,
  updateTransportConfig,
} from "@/lib/transportConfigStore";
import {
  sectorKinds,
  transportLocations,
  type SectorKind,
  type TransportConfig,
  type TransportLocation,
  type TransportSector,
  type TransportVehicle,
  type VisaTier,
} from "@/lib/transportConfig";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json({ config: await getTransportConfig() });
}

const locationKeys = new Set(transportLocations.map((l) => l.key));

function num(value: unknown): number | null {
  const n = Number(value);
  return Number.isFinite(n) && n >= 0 ? n : null;
}

function requireNum(value: unknown, field: string): number {
  const n = num(value);
  if (n === null) throw new Error(`Enter a valid number for ${field}.`);
  return n;
}

function slug(value: unknown, field: string): string {
  const s = String(value ?? "").trim().toLowerCase().replace(/[^a-z0-9-]+/g, "-");
  if (!s) throw new Error(`${field} is required.`);
  return s;
}

/** Validate and normalise the posted config. Throws with a clear message. */
function sanitize(body: Record<string, unknown>): TransportConfig {
  const raw = body.config as Partial<TransportConfig> | undefined;
  if (!raw || typeof raw !== "object") throw new Error("Missing config.");

  const visaTiers: VisaTier[] = (Array.isArray(raw.visaTiers) ? raw.visaTiers : [])
    .map((t) => ({
      minPax: Math.max(1, Math.floor(requireNum(t?.minPax, "tier min pax"))),
      maxPax: Math.max(1, Math.floor(requireNum(t?.maxPax, "tier max pax"))),
      pricePerPerson: requireNum(t?.pricePerPerson, "tier visa price"),
    }))
    .filter((t) => t.maxPax >= t.minPax)
    .sort((a, b) => a.minPax - b.minPax);
  if (visaTiers.length === 0) throw new Error("Add at least one visa tier.");

  const vehicles: TransportVehicle[] = (Array.isArray(raw.vehicles) ? raw.vehicles : []).map(
    (v) => ({
      id: slug(v?.id, "vehicle id"),
      name: String(v?.name ?? "").trim() || "Vehicle",
      seats: Math.max(1, Math.floor(requireNum(v?.seats, "vehicle seats"))),
      active: Boolean(v?.active),
    })
  );
  if (vehicles.length === 0) throw new Error("Add at least one vehicle.");
  const vehicleIds = new Set(vehicles.map((v) => v.id));
  if (vehicleIds.size !== vehicles.length) {
    throw new Error("Vehicle ids must be unique.");
  }

  const sectors: TransportSector[] = (Array.isArray(raw.sectors) ? raw.sectors : []).map(
    (s, index) => {
      const from = String(s?.from ?? "") as TransportLocation;
      const to = String(s?.to ?? "") as TransportLocation;
      if (!locationKeys.has(from) || !locationKeys.has(to)) {
        throw new Error("Every sector needs a valid from and to location.");
      }
      const kind = (sectorKinds as readonly string[]).includes(String(s?.kind))
        ? (String(s?.kind) as SectorKind)
        : "other";
      const prices: Record<string, number | null> = {};
      for (const v of vehicles) {
        prices[v.id] = num((s?.prices as Record<string, unknown>)?.[v.id]);
      }
      return {
        id: slug(s?.id ?? `sector-${index + 1}`, "sector id"),
        from,
        to,
        via: String(s?.via ?? "").trim(),
        kind,
        prices,
        active: Boolean(s?.active),
        sortOrder: Math.floor(num(s?.sortOrder) ?? index + 1),
      };
    }
  );

  const f = (raw.fees ?? {}) as Record<string, unknown>;
  return {
    visaTiers,
    vehicles,
    sectors,
    fees: {
      infantVisa: requireNum(f.infantVisa, "infant visa"),
      fullPrivateVisa: requireNum(f.fullPrivateVisa, "full private visa"),
      partialPrivateVisa: requireNum(f.partialPrivateVisa, "partial private visa"),
      selfHotelFee: requireNum(f.selfHotelFee, "self hotel fee"),
      nusukPerPersonNight: requireNum(f.nusukPerPersonNight, "Nusuk per night fee"),
      longStayFee: requireNum(f.longStayFee, "long stay fee"),
      longStayAfterDays: requireNum(f.longStayAfterDays, "long stay after days"),
      longStayMaxDays: requireNum(f.longStayMaxDays, "long stay max days"),
      busPerPersonSector: requireNum(f.busPerPersonSector, "bus per person sector"),
      visaCancellation: requireNum(f.visaCancellation, "visa cancellation"),
      nonTravelling: requireNum(f.nonTravelling, "non travelling charge"),
    },
  };
}

export async function PUT(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }
  let config: TransportConfig;
  try {
    config = sanitize(body);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Invalid transport config.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
  try {
    const saved = await updateTransportConfig(config);
    revalidatePath("/admin/transport");
    revalidatePath("/package-calculator");
    return NextResponse.json({ config: saved });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to save config.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
