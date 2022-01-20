import twoDigitFormat from "./two-digit-format";

const localizeDate = (
  date: string | null | undefined,
  mode: "hours" | "date" = "date"
): string => {
  if (!date) return "";

  switch (mode) {
    case "date":
      return (
        new Date(Date.parse(date)).toLocaleDateString("ru", {
          year: "numeric",
          month: "long",
          day: "numeric",
        }) ?? ""
      );
    case "hours":
      return `${twoDigitFormat(
        new Date(Date.parse(date)).getHours()
      )}:${twoDigitFormat(new Date(Date.parse(date)).getMinutes())}`;
  }
};

export default localizeDate;
