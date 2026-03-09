const ADZUNA_APP_ID = "ac083125";
const ADZUNA_APP_KEY = "b6db554a5d4fc328ecccbbb2ac0d875f";
const BASE_URL = "https://api.adzuna.com/v1/api/jobs";

export interface AdzunaJob {
  id: string;
  title: string;
  company: string;
  location: string;
  description: string;
  redirect_url: string;
  created: string;
  category: string;
  salary_min?: number;
  salary_max?: number;
  contract_type?: string;
}

interface AdzunaApiResult {
  id: string;
  title: string;
  company: { display_name: string };
  location: { display_name: string; area: string[] };
  description: string;
  redirect_url: string;
  created: string;
  category: { label: string; tag: string };
  salary_min?: number;
  salary_max?: number;
  contract_type?: string;
}

export async function searchAdzunaInternships(
  query: string = "intern",
  page: number = 1,
  country: string = "in"
): Promise<{ results: AdzunaJob[]; total: number }> {
  const searchQuery = query ? `${query} intern` : "intern";
  const url = `${BASE_URL}/${country}/search/${page}?app_id=${ADZUNA_APP_ID}&app_key=${ADZUNA_APP_KEY}&results_per_page=20&what=${encodeURIComponent(searchQuery)}&content-type=application/json`;

  try {
    const res = await fetch(url);
    if (!res.ok) {
      console.error("Adzuna API error:", res.status, res.statusText);
      return { results: [], total: 0 };
    }
    const data = await res.json();
    const results: AdzunaJob[] = (data.results || []).map((r: AdzunaApiResult) => ({
      id: `adzuna-${r.id}`,
      title: r.title,
      company: r.company?.display_name || "Unknown",
      location: r.location?.display_name || "Unknown",
      description: r.description || "",
      redirect_url: r.redirect_url,
      created: r.created,
      category: r.category?.label || "",
      salary_min: r.salary_min,
      salary_max: r.salary_max,
      contract_type: r.contract_type,
    }));
    return { results, total: data.count || 0 };
  } catch (err) {
    console.error("Adzuna fetch error:", err);
    return { results: [], total: 0 };
  }
}
