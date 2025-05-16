export async function selectOnlyOne<T>(
  result: T[],
): Promise<T | null> {
  if (result.length === 0) {
    return null;
  }
  if (result.length > 1) {
    throw new Error("More than one result found");
  }
  return result[0];
}