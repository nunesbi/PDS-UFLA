import { create } from 'zustand'

interface User {
  id: string
  name: string
  email: string
  cpf: string
  institution: string
}

interface Event {
  id: string
  title: string
  description: string
  location: string
  time: string
  date: string
  capacity: number
  enrolled: number
  qrCode: string
  image?: string
}

interface Certificate {
  id: string
  participantId: string
  participantName: string
  participantEmail: string
  eventId: string
  eventTitle: string
  type: string
  date: string
  status: 'pending' | 'sent' | 'viewed'
  certificateUrl?: string
}

interface Store {
  user: User | null
  setUser: (user: User | null) => void
  events: Event[]
  setEvents: (events: Event[]) => void
  addEvent: (event: Event) => void
  updateEvent: (event: Event) => void
  deleteEvent: (id: string) => void
  certificates: Certificate[]
  setCertificates: (certificates: Certificate[]) => void
  addCertificate: (cert: Certificate) => void
  updateCertificate: (cert: Certificate) => void
  certificateTemplate: string | null
  setCertificateTemplate: (template: string) => void
}

export const useStore = create<Store>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  
  events: [
    { id: 'evt-1', title: 'React Native Avançado', description: 'Aprenda técnicas avançadas de React Native com exemplos práticos', location: 'Sala 101', time: '09:00 - 11:00', date: '2024-05-15', capacity: 30, enrolled: 25, qrCode: 'CUFLA-EVT-001', image: '📱' },
    { id: 'evt-2', title: 'Web Development com TypeScript', description: 'Desenvolvimento web moderno usando TypeScript e React', location: 'Sala 102', time: '14:00 - 16:00', date: '2024-05-15', capacity: 25, enrolled: 20, qrCode: 'CUFLA-EVT-002', image: '💻' },
  ],
  setEvents: (events) => set({ events }),
  addEvent: (event) => set((state) => ({ events: [...state.events, event] })),
  updateEvent: (event) => set((state) => ({ events: state.events.map(e => e.id === event.id ? event : e) })),
  deleteEvent: (id) => set((state) => ({ events: state.events.filter(e => e.id !== id) })),
  
  certificates: [
    { id: 'cert-1', participantId: 'user-1', participantName: 'João Silva', participantEmail: 'joao@email.com', eventId: 'evt-1', eventTitle: 'React Native Avançado', type: 'Participação', date: '2024-05-15', status: 'pending' },
  ],
  setCertificates: (certificates) => set({ certificates }),
  addCertificate: (cert) => set((state) => ({ certificates: [...state.certificates, cert] })),
  updateCertificate: (cert) => set((state) => ({ certificates: state.certificates.map(c => c.id === cert.id ? cert : c) })),
  
  certificateTemplate: null,
  setCertificateTemplate: (template) => set({ certificateTemplate: template }),
}))
