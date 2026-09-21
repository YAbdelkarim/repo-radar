function getStatus(error: unknown): number | undefined {
  if (
    typeof error === "object" &&
    error !== null &&
    "status" in error &&
    typeof error.status === "number"
  ) {
    return error.status;
  }
  return undefined;
}

export function toErrorMessage(error: unknown): string {
  if (!navigator.onLine) return "You appear to be offline. Check your connection and try again.";

  const status = getStatus(error);
  if (status === 403 || status === 429)
    return "GitHub rate limit reached. Please wait a minute and try again.";
  if (status === 404) return "Repository not found. It may have been deleted or renamed.";
  if (status === 422) return "GitHub couldn't process this search. Try different search terms.";
  if (error instanceof Error) return error.message;
  return "Something went wrong. Please try again.";
}
