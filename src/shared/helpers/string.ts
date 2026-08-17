export function formatDate(date: string) {
  return new Date(date).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

export function formatDateTime(date: string) {
  return new Date(date).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function formatTime(date: string) {
  const dateString = new Date(date).toLocaleDateString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return dateString.split(", ")[1];
}
