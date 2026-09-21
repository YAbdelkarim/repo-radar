interface ParsedLinks {
  prev?: number;
  next?: number;
  first?: number;
  last?: number;
}

export function parseLinkHeader(header: string | undefined): ParsedLinks {
  if (!header) return {};

  const links: ParsedLinks = {};
  const parts = header.split(",");

  for (const part of parts) {
    const match = part.match(/<([^>]+)>;\s*rel="([^"]+)"/);
    if (!match) continue;

    const [, url, rel] = match;
    const page = new URL(url).searchParams.get("page");
    if (page && (rel === "prev" || rel === "next" || rel === "first" || rel === "last")) {
      links[rel] = Number(page);
    }
  }

  return links;
}
