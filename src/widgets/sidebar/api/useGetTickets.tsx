import { useQuery } from "@tanstack/react-query"

// Описываем тип тикета, который нам вернет бэкенд
export interface SupportTicketData {
  id: string
  status: string
  createdAt: string
  profile: {
    name: string
    imageUrl: string
  }
  messages: {
    text: string
    createdAt: string
  }[]
}

export function useGetTickets() {
  return useQuery<SupportTicketData[]>({
    queryKey: ["support-tickets"], // Уникальный ключ кэша
    queryFn: async () => {
      const res = await fetch("/api/support/tickets")
      if (!res.ok) throw new Error("Не удалось загрузить тикеты")
      return res.json()
    },
    // refetchInterval: 3000, // 👈 КРИТИЧНО ДЛЯ РЕАЛ-ТАЙМА: опрашиваем базу каждые 3 секунды
  })
}
