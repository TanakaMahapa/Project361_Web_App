export async function fetchLatestRecord() {
  const res = await fetch("/api/record/latest");
  if (!res.ok) throw new Error("Failed to fetch latest record");
  return res.json();
}
