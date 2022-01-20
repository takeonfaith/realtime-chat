export default function filterArrayWithArray(
  whatToFilter: any[],
  withWhatToFilter: any[]
) {
  if (!whatToFilter || !withWhatToFilter) return [];
  return whatToFilter.filter((item) => !withWhatToFilter.includes(item));
}
