import { useState } from 'react'
import QRCode from 'qrcode'
import logo from './assets/logo.png'
import './App.css'

// Types
interface User {
  id: string
  name: string
  email: string
  cpf: string
  institution: string
  password: string
  enrolledEvents: string[]
}

interface Event {
  id: string
  title: string
  description: string
  date: string
  time: string
  location: string
  category: string
  capacity: number
  enrolled: number
}

interface Enrollment {
  id: string
  userId: string
  eventId: string
  qrCode: string
  qrCodeImage: string
  enrollmentDate: string
  used: boolean
}

interface Toast {
  id: string
  message: string
  type: 'success' | 'error' | 'info'
}

type Screen = 'landing' | 'login' | 'register' | 'admin-login' | 'home' | 'events' | 'certificates' | 'profile' | 'admin-home' | 'admin-events' | 'admin-qr' | 'admin-certificates' | 'admin-reports'

// Storage
const StorageDB = {
  users: {
    get: () => JSON.parse(localStorage.getItem('cufla_users') || '[]'),
    set: (users: User[]) => localStorage.setItem('cufla_users', JSON.stringify(users)),
  },
  events: {
    get: () => JSON.parse(localStorage.getItem('cufla_events') || '[]'),
    set: (events: Event[]) => localStorage.setItem('cufla_events', JSON.stringify(events)),
  },
  enrollments: {
    get: () => JSON.parse(localStorage.getItem('cufla_enrollments') || '[]'),
    set: (enrollments: Enrollment[]) => localStorage.setItem('cufla_enrollments', JSON.stringify(enrollments)),
  },
  attendances: {
    get: () => JSON.parse(localStorage.getItem('cufla_attendances') || '[]'),
    set: (attendances: any[]) => localStorage.setItem('cufla_attendances', JSON.stringify(attendances)),
  },
}

// Initialize data
if (StorageDB.events.get().length === 0) {
  StorageDB.events.set([
    { id: 'evt-1', title: 'React Native Avançado', description: 'Aprenda técnicas avançadas de React Native com exemplos práticos', date: '2024-05-15', time: '09:00', location: 'Auditório Principal', category: 'Workshop', capacity: 50, enrolled: 0 },
    { id: 'evt-2', title: 'Web Development com TypeScript', description: 'Desenvolvimento web moderno usando TypeScript e React', date: '2024-05-15', time: '14:00', location: 'Sala 201', category: 'Minicurso', capacity: 40, enrolled: 0 },
  ])
}

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('landing')
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [toasts, setToasts] = useState<Toast[]>([])

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    const id = Date.now().toString()
    setToasts(prev => [...prev, { id, message, type }])
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3000)
  }

  const handleLogout = () => {
    setCurrentUser(null)
    setCurrentScreen('landing')
  }

  return (
    <div className="app">
      {currentScreen === 'landing' && <LandingScreen onNavigate={setCurrentScreen} onShowToast={showToast} />}
      {currentScreen === 'login' && <LoginScreen onNavigate={setCurrentScreen} onSetUser={setCurrentUser} onShowToast={showToast} />}
      {currentScreen === 'register' && <RegisterScreen onNavigate={setCurrentScreen} onShowToast={showToast} />}
      {currentScreen === 'admin-login' && <AdminLoginScreen onNavigate={setCurrentScreen} onSetUser={setCurrentUser} onShowToast={showToast} />}
      
      {currentUser && currentUser.email !== 'admin@ufla.br' && (
        <>
          {currentScreen === 'home' && <HomeScreen user={currentUser} onNavigate={setCurrentScreen} onLogout={handleLogout} onShowToast={showToast} />}
          {currentScreen === 'events' && <EventsScreen user={currentUser} onNavigate={setCurrentScreen} onLogout={handleLogout} onShowToast={showToast} />}
          {currentScreen === 'certificates' && <CertificatesScreen user={currentUser} onNavigate={setCurrentScreen} onLogout={handleLogout} onShowToast={showToast} />}
          {currentScreen === 'profile' && <ProfileScreen user={currentUser} setUser={setCurrentUser} onNavigate={setCurrentScreen} onLogout={handleLogout} onShowToast={showToast} />}
        </>
      )}

      {currentUser && currentUser.email === 'admin@ufla.br' && (
        <>
          {currentScreen === 'admin-home' && <AdminHomeScreen onNavigate={setCurrentScreen} onLogout={handleLogout} onShowToast={showToast} />}
          {currentScreen === 'admin-events' && <AdminEventsScreen onNavigate={setCurrentScreen} onLogout={handleLogout} onShowToast={showToast} />}
          {currentScreen === 'admin-qr' && <AdminQRScreen onNavigate={setCurrentScreen} onLogout={handleLogout} onShowToast={showToast} />}
          {currentScreen === 'admin-certificates' && <AdminCertificatesScreen onNavigate={setCurrentScreen} onLogout={handleLogout} onShowToast={showToast} />}
          {currentScreen === 'admin-reports' && <AdminReportsScreen onNavigate={setCurrentScreen} onLogout={handleLogout} onShowToast={showToast} />}
        </>
      )}

      <div className="toasts-container">
        {toasts.map(toast => (
          <div key={toast.id} className={`toast toast-${toast.type}`}>{toast.message}</div>
        ))}
      </div>
    </div>
  )
}

// LANDING SCREEN
function LandingScreen({ onNavigate, onShowToast }: { onNavigate: (screen: Screen) => void; onShowToast: (msg: string, type: 'success' | 'error' | 'info') => void }) {
  return (
    <div className="landing-page">
      <nav className="landing-nav">
        <div className="nav-container">
          <img src={logo} alt="QuadCode" className="logo-img" />
          <div className="nav-actions">
            <button className="nav-btn nav-login" onClick={() => onNavigate('login')}>Entrar</button>
            <button className="nav-btn nav-register" onClick={() => onNavigate('register')}>Cadastrar</button>
          </div>
        </div>
      </nav>

      <div className="landing-hero">
        <div className="hero-content">
          <div className="hero-text">
            <h1>Congresso Unificado UFLA Paraíso</h1>
            <p className="hero-subtitle">Sistema de Inscrição, Programação e Certificados</p>
            <p className="hero-description">Gerencie suas inscrições em eventos, acompanhe a programação e baixe seus certificados de participação de forma simples e rápida.</p>
            
            <div className="hero-features">
              <div className="feature-item">Inscrição Simplificada</div>
              <div className="feature-item">Programação Dinâmica</div>
              <div className="feature-item">QR Code Único</div>
              <div className="feature-item">Certificados Automáticos</div>
            </div>

            <div className="hero-actions">
              <button className="btn btn-primary btn-lg" onClick={() => onNavigate('register')}>Fazer Inscrição</button>
              <button className="btn btn-secondary btn-lg" onClick={() => onNavigate('login')}>Ver Programação</button>
              <button className="btn btn-outline btn-lg" onClick={() => onNavigate('admin-login')}>Área Administrativa</button>
            </div>
          </div>

          <div className="hero-image">
            <div className="hero-graphic">
              <div className="graphic-circle circle-1"></div>
              <div className="graphic-circle circle-2"></div>
              <img src={logo} alt="QuadCode" className="hero-logo" />
            </div>
          </div>
        </div>
      </div>

      <footer className="landing-footer">
        Desenvolvido com para o Congresso Unificado UFLA Paraíso
      </footer>
    </div>
  )
}

// LOGIN SCREEN
function LoginScreen({ onNavigate, onSetUser, onShowToast }: { onNavigate: (screen: Screen) => void; onSetUser: (user: User) => void; onShowToast: (msg: string, type: 'success' | 'error' | 'info') => void }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleLogin = () => {
    const users = StorageDB.users.get()
    const user = users.find((u: User) => u.email === email && u.password === password)
    
    if (user) {
      onSetUser(user)
      onNavigate('home')
      onShowToast('Login realizado com sucesso!', 'success')
    } else {
      onShowToast('Email ou senha incorretos', 'error')
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-container">
        <button className="back-btn" onClick={() => onNavigate('landing')}>Voltar</button>
        
        <div className="auth-header">
          <img src={logo} alt="QuadCode" className="auth-logo" />
          <h2>Entrar</h2>
        </div>

        <div className="form-group">
          <label>Email</label>
          <input type="email" className="input" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="seu@email.com" />
        </div>

        <div className="form-group">
          <label>Senha</label>
          <input type="password" className="input" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" />
        </div>

        <button className="btn btn-primary btn-lg" style={{ width: '100%' }} onClick={handleLogin}>Entrar</button>

        <p style={{ marginTop: '20px', textAlign: 'center', color: '#999', fontSize: '14px' }}>
          Não tem conta? <button className="back-btn" onClick={() => onNavigate('register')} style={{ marginLeft: '4px' }}>Cadastre-se</button>
        </p>
      </div>
    </div>
  )
}

// REGISTER SCREEN
function RegisterScreen({ onNavigate, onShowToast }: { onNavigate: (screen: Screen) => void; onShowToast: (msg: string, type: 'success' | 'error' | 'info') => void }) {
  const [form, setForm] = useState({ name: '', email: '', cpf: '', institution: '', password: '', confirmPassword: '' })
  const [errors, setErrors] = useState<string[]>([])

  const validatePassword = (pwd: string) => {
    const reqs = [
      { test: pwd.length >= 8, msg: 'Mínimo 8 caracteres' },
      { test: /[A-Z]/.test(pwd), msg: 'Pelo menos uma letra maiúscula' },
      { test: /[0-9]/.test(pwd), msg: 'Pelo menos um número' },
      { test: /[!@#$%^&*]/.test(pwd), msg: 'Pelo menos um caractere especial (!@#$%^&*)' },
    ]
    return reqs
  }

  const handleRegister = () => {
    const newErrors: string[] = []
    const pwdReqs = validatePassword(form.password)
    
    if (!form.name) newErrors.push('Nome é obrigatório')
    if (!form.email) newErrors.push('Email é obrigatório')
    if (!form.cpf) newErrors.push('CPF é obrigatório')
    if (!form.institution) newErrors.push('Instituição é obrigatória')
    if (form.password !== form.confirmPassword) newErrors.push('Senhas não conferem')
    if (pwdReqs.some(r => !r.test)) newErrors.push('Senha não atende aos requisitos')

    if (newErrors.length > 0) {
      setErrors(newErrors)
      return
    }

    const users = StorageDB.users.get()
    if (users.find((u: User) => u.email === form.email)) {
      onShowToast('Email já cadastrado', 'error')
      return
    }

    const newUser: User = {
      id: 'user-' + Date.now(),
      name: form.name,
      email: form.email,
      cpf: form.cpf,
      institution: form.institution,
      password: form.password,
      enrolledEvents: []
    }

    users.push(newUser)
    StorageDB.users.set(users)
    onShowToast('Cadastro realizado com sucesso!', 'success')
    onNavigate('login')
  }

  const pwdReqs = validatePassword(form.password)

  return (
    <div className="auth-page">
      <div className="auth-container">
        <button className="back-btn" onClick={() => onNavigate('landing')}>Voltar</button>
        
        <div className="auth-header">
          <img src={logo} alt="QuadCode" className="auth-logo" />
          <h2>Cadastro</h2>
        </div>

        {errors.length > 0 && (
          <div className="error-message">
            {errors.map((err, i) => <div key={i}>{err}</div>)}
          </div>
        )}

        <div className="form-group">
          <label>Nome Completo</label>
          <input type="text" className="input" value={form.name} onChange={(e) => setForm({...form, name: e.target.value})} />
        </div>

        <div className="form-group">
          <label>Email</label>
          <input type="email" className="input" value={form.email} onChange={(e) => setForm({...form, email: e.target.value})} />
        </div>

        <div className="form-group">
          <label>CPF</label>
          <input type="text" className="input" value={form.cpf} onChange={(e) => setForm({...form, cpf: e.target.value})} />
        </div>

        <div className="form-group">
          <label>Instituição</label>
          <input type="text" className="input" value={form.institution} onChange={(e) => setForm({...form, institution: e.target.value})} />
        </div>

        <div className="form-group">
          <label>Senha</label>
          <input type="password" className="input" value={form.password} onChange={(e) => setForm({...form, password: e.target.value})} />
          <div className="password-requirements">
            {pwdReqs.map((req, i) => (
              <div key={i} className={req.test ? 'requirement-success' : 'requirement-error'}>
                {req.test ? '✓' : '✗'} {req.msg}
              </div>
            ))}
          </div>
        </div>

        <div className="form-group">
          <label>Confirmar Senha</label>
          <input type="password" className="input" value={form.confirmPassword} onChange={(e) => setForm({...form, confirmPassword: e.target.value})} />
        </div>

        <button className="btn btn-primary btn-lg" style={{ width: '100%' }} onClick={handleRegister}>Cadastrar</button>
      </div>
    </div>
  )
}

// HOME SCREEN
function HomeScreen({ user, onNavigate, onLogout, onShowToast }: { user: User; onNavigate: (screen: Screen) => void; onLogout: () => void; onShowToast: (msg: string, type: 'success' | 'error' | 'info') => void }) {
  const events = StorageDB.events.get()
  const enrollments = StorageDB.enrollments.get().filter((e: Enrollment) => e.userId === user.id)

  return (
    <div className="dashboard-layout">
      <aside className="sidebar">
        <div className="sidebar-header">
          <img src={logo} alt="QuadCode" className="sidebar-logo" />
        </div>
        <nav className="sidebar-nav">
          <button className="nav-item active" onClick={() => onNavigate('home')}>Home</button>
          <button className="nav-item" onClick={() => onNavigate('events')}>Programação</button>
          <button className="nav-item" onClick={() => onNavigate('certificates')}>Inscrições</button>
          <button className="nav-item" onClick={() => onNavigate('profile')}>Perfil</button>
        </nav>
        <div className="sidebar-footer">
          <button className="nav-item" onClick={onLogout}>Sair</button>
        </div>
      </aside>

      <main className="main-content">
        <div className="home-hero">
          <div className="hero-circle"></div>
          <div className="home-content">
            <img src={logo} alt="QuadCode" className="home-logo" />
            <h1>Congresso Unificado UFLA Paraíso</h1>
            <p className="home-subtitle">Sistema de Inscrição, Programação e Certificados</p>
            
            <div className="home-actions">
              <button className="btn btn-primary btn-lg" onClick={() => onNavigate('events')}>Fazer Inscrição</button>
              <button className="btn btn-secondary btn-lg" onClick={() => onNavigate('events')}>Ver Programação</button>
              <button className="btn btn-outline btn-lg" onClick={() => onNavigate('certificates')}>Certificados</button>
              <button className="btn btn-outline btn-lg" onClick={onLogout}>Sair</button>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

// EVENTS SCREEN
function EventsScreen({ user, onNavigate, onLogout, onShowToast }: { user: User; onNavigate: (screen: Screen) => void; onLogout: () => void; onShowToast: (msg: string, type: 'success' | 'error' | 'info') => void }) {
  const [events, setEvents] = useState(StorageDB.events.get())
  const enrollments = StorageDB.enrollments.get().filter((e: Enrollment) => e.userId === user.id)

  const handleEnroll = async (event: Event) => {
    if (enrollments.find((e: Enrollment) => e.eventId === event.id)) {
      onShowToast('Você já está inscrito neste evento', 'error')
      return
    }

    if (event.enrolled >= event.capacity) {
      onShowToast('Evento cheio', 'error')
      return
    }

    const qrCodeValue = `${user.id}-${event.id}-${Date.now()}`
    const qrCodeImage = await QRCode.toDataURL(qrCodeValue)

    const enrollment: Enrollment = {
      id: 'enr-' + Date.now(),
      userId: user.id,
      eventId: event.id,
      qrCode: qrCodeValue,
      qrCodeImage: qrCodeImage,
      enrollmentDate: new Date().toISOString(),
      used: false
    }

    const allEnrollments = StorageDB.enrollments.get()
    allEnrollments.push(enrollment)
    StorageDB.enrollments.set(allEnrollments)

    const updatedEvents = events.map((e: Event) => e.id === event.id ? { ...e, enrolled: e.enrolled + 1 } : e)
    setEvents(updatedEvents)
    StorageDB.events.set(updatedEvents)

    onShowToast('Inscrição realizada com sucesso!', 'success')
  }

  return (
    <div className="dashboard-layout">
      <aside className="sidebar">
        <div className="sidebar-header">
          <img src={logo} alt="QuadCode" className="sidebar-logo" />
        </div>
        <nav className="sidebar-nav">
          <button className="nav-item" onClick={() => onNavigate('home')}>Home</button>
          <button className="nav-item active" onClick={() => onNavigate('events')}>Programação</button>
          <button className="nav-item" onClick={() => onNavigate('certificates')}>Inscrições</button>
          <button className="nav-item" onClick={() => onNavigate('profile')}>Perfil</button>
        </nav>
        <div className="sidebar-footer">
          <button className="nav-item" onClick={onLogout}>Sair</button>
        </div>
      </aside>

      <main className="main-content">
        <div className="dashboard-header">
          <h1>Programação do Evento</h1>
          <p>Confira todos os eventos disponíveis e faça suas inscrições</p>
        </div>

        <div className="events-list">
          {events.map((event: Event) => (
            <div key={event.id} className="event-list-item">
              <div className="event-time">
                <strong>{event.time}</strong>
                <span>{event.date}</span>
              </div>
              <div className="event-details">
                <h3>{event.title}</h3>
                <p>{event.description}</p>
                <span style={{ fontSize: '12px', color: '#999' }}>Local: {event.location} | Vagas: {event.enrolled}/{event.capacity}</span>
              </div>
              <button 
                className={`btn ${enrollments.find((e: Enrollment) => e.eventId === event.id) ? 'btn-outline' : 'btn-primary'} btn-sm`}
                onClick={() => handleEnroll(event)}
              >
                {enrollments.find((e: Enrollment) => e.eventId === event.id) ? 'Inscrito' : 'Inscrever'}
              </button>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}

// CERTIFICATES SCREEN
function CertificatesScreen({ user, onNavigate, onLogout, onShowToast }: { user: User; onNavigate: (screen: Screen) => void; onLogout: () => void; onShowToast: (msg: string, type: 'success' | 'error' | 'info') => void }) {
  const enrollments = StorageDB.enrollments.get().filter((e: Enrollment) => e.userId === user.id)
  const events = StorageDB.events.get()
  const attendances = StorageDB.attendances.get()

  const generateCertificatePDF = (event: Event | undefined, user: User, attendance: any) => {
    if (!event || !attendance) {
      onShowToast('Presença não confirmada. Certificado não disponível.', 'error')
      return
    }

    const certificateText = `CERTIFICADO DE PARTICIPACAO\n\n================================\n\nCongresso Unificado UFLA Paraiso\n\n================================\n\nCertificamos que\n\n${user.name}\n\nparticipou do evento\n\n${event.title}\n\nRealizado em ${event.date} as ${event.time}\nLocal: ${event.location}\n\n================================\n\nCertificado emitido em ${new Date().toLocaleDateString('pt-BR')}\n\nCodigo: ${Math.random().toString(36).substr(2, 9).toUpperCase()}`
    
    const blob = new Blob([certificateText], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `certificado-${event.title.replace(/\s+/g, '-')}-${new Date().getTime()}.txt`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
    
    onShowToast('Certificado baixado com sucesso!', 'success')
  }

  return (
    <div className="dashboard-layout">
      <aside className="sidebar">
        <div className="sidebar-header">
          <img src={logo} alt="QuadCode" className="sidebar-logo" />
        </div>
        <nav className="sidebar-nav">
          <button className="nav-item" onClick={() => onNavigate('home')}>Home</button>
          <button className="nav-item" onClick={() => onNavigate('events')}>Programação</button>
          <button className="nav-item active" onClick={() => onNavigate('certificates')}>Inscrições</button>
          <button className="nav-item" onClick={() => onNavigate('profile')}>Perfil</button>
        </nav>
        <div className="sidebar-footer">
          <button className="nav-item" onClick={onLogout}>Sair</button>
        </div>
      </aside>

      <main className="main-content">
        <div className="dashboard-header">
          <h1>Inscrições</h1>
          <p>Acompanhe suas inscrições e certificados</p>
        </div>

        <div className="qr-list">
          {enrollments.map((enrollment: Enrollment) => {
            const event = events.find((e: Event) => e.id === enrollment.eventId)
            const attendance = attendances.find((a: any) => a.enrollmentId === enrollment.id)
            return (
              <div key={enrollment.id} className="qr-card">
                <div className="qr-content">
                  <h3>{event?.title}</h3>
                  <p>{event?.date} às {event?.time}</p>
                  <span className={`badge ${attendance ? 'badge-success' : 'badge-warning'}`}>
                    {attendance ? 'Presença Confirmada' : 'Aguardando Presença'}
                  </span>
                </div>
                <div className="qr-preview">
                  <img src={enrollment.qrCodeImage} alt="QR Code" />
                </div>
                <div className="qr-code-text">{enrollment.qrCode}</div>
                {attendance && (
                  <button className="btn btn-primary btn-sm" style={{ marginTop: '12px', width: '100%' }} onClick={() => generateCertificatePDF(event, user, attendance)}>
                    Baixar Certificado
                  </button>
                )}
              </div>
            )
          })}
        </div>

        {enrollments.length === 0 && (
          <div className="empty-state">
            <p>Você ainda não tem inscrições</p>
          </div>
        )}
      </main>
    </div>
  )
}

// PROFILE SCREEN
function ProfileScreen({ user, setUser, onNavigate, onLogout, onShowToast }: { user: User; setUser: (user: User) => void; onNavigate: (screen: Screen) => void; onLogout: () => void; onShowToast: (msg: string, type: 'success' | 'error' | 'info') => void }) {
  const [form, setForm] = useState(user)

  const handleSave = () => {
    const users = StorageDB.users.get()
    const index = users.findIndex((u: User) => u.id === user.id)
    if (index !== -1) {
      users[index] = form
      StorageDB.users.set(users)
      setUser(form)
      onShowToast('Perfil atualizado com sucesso!', 'success')
    }
  }

  return (
    <div className="dashboard-layout">
      <aside className="sidebar">
        <div className="sidebar-header">
          <img src={logo} alt="QuadCode" className="sidebar-logo" />
        </div>
        <nav className="sidebar-nav">
          <button className="nav-item" onClick={() => onNavigate('home')}>Home</button>
          <button className="nav-item" onClick={() => onNavigate('events')}>Programação</button>
          <button className="nav-item" onClick={() => onNavigate('certificates')}>Inscrições</button>
          <button className="nav-item active" onClick={() => onNavigate('profile')}>Perfil</button>
        </nav>
        <div className="sidebar-footer">
          <button className="nav-item" onClick={onLogout}>Sair</button>
        </div>
      </aside>

      <main className="main-content">
        <div className="dashboard-header">
          <h1>Meu Perfil</h1>
          <p>Gerencie suas informações pessoais</p>
        </div>

        <div className="profile-form">
          <div className="form-group">
            <label>Nome Completo</label>
            <input type="text" className="input" value={form.name} onChange={(e) => setForm({...form, name: e.target.value})} />
          </div>

          <div className="form-group">
            <label>Email</label>
            <input type="email" className="input" value={form.email} disabled />
          </div>

          <div className="form-group">
            <label>CPF</label>
            <input type="text" className="input" value={form.cpf} onChange={(e) => setForm({...form, cpf: e.target.value})} />
          </div>

          <div className="form-group">
            <label>Instituição</label>
            <input type="text" className="input" value={form.institution} onChange={(e) => setForm({...form, institution: e.target.value})} />
          </div>

          <div className="form-actions">
            <button className="btn btn-primary" onClick={handleSave}>Salvar Alterações</button>
            <button className="btn btn-outline" onClick={() => setForm(user)}>Cancelar</button>
          </div>
        </div>
      </main>
    </div>
  )
}

// ADMIN LOGIN
function AdminLoginScreen({ onNavigate, onSetUser, onShowToast }: { onNavigate: (screen: Screen) => void; onSetUser: (user: User) => void; onShowToast: (msg: string, type: 'success' | 'error' | 'info') => void }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleLogin = () => {
    if (email === 'admin@ufla.br' && password === 'Admin123!') {
      const adminUser: User = {
        id: 'admin-1',
        name: 'Administrador',
        email: 'admin@ufla.br',
        cpf: '00000000000',
        institution: 'UFLA',
        password: 'Admin123!',
        enrolledEvents: []
      }
      onSetUser(adminUser)
      onNavigate('admin-home')
      onShowToast('Login administrativo realizado!', 'success')
    } else {
      onShowToast('Email ou senha incorretos', 'error')
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-container">
        <button className="back-btn" onClick={() => onNavigate('landing')}>Voltar</button>
        
        <div className="auth-header">
          <img src={logo} alt="QuadCode" className="auth-logo" />
          <h2>Admin</h2>
        </div>

        <div className="form-group">
          <label>Email</label>
          <input type="email" className="input" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="admin@ufla.br" />
        </div>

        <div className="form-group">
          <label>Senha</label>
          <input type="password" className="input" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" />
        </div>

        <button className="btn btn-primary btn-lg" style={{ width: '100%' }} onClick={handleLogin}>Entrar</button>
      </div>
    </div>
  )
}

// ADMIN HOME
function AdminHomeScreen({ onNavigate, onLogout, onShowToast }: { onNavigate: (screen: Screen) => void; onLogout: () => void; onShowToast: (msg: string, type: 'success' | 'error' | 'info') => void }) {
  const events = StorageDB.events.get()
  const enrollments = StorageDB.enrollments.get()
  const attendances = StorageDB.attendances.get()

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <div className="admin-header">
          <img src={logo} alt="QuadCode" className="admin-logo" />
          <h2>Admin</h2>
        </div>
        <nav className="admin-nav">
          <button className="admin-nav-item active" onClick={() => onNavigate('admin-home')}>Dashboard</button>
          <button className="admin-nav-item" onClick={() => onNavigate('admin-events')}>Eventos</button>
          <button className="admin-nav-item" onClick={() => onNavigate('admin-qr')}>Presença</button>
          <button className="admin-nav-item" onClick={() => onNavigate('admin-certificates')}>Certificados</button>
          <button className="admin-nav-item" onClick={() => onNavigate('admin-reports')}>Relatórios</button>
        </nav>
        <div style={{ marginTop: 'auto', paddingTop: '16px', borderTop: '1px solid rgba(255,255,255,0.2)' }}>
          <button className="admin-nav-item" onClick={onLogout}>Sair</button>
        </div>
      </aside>

      <main className="admin-main">
        <div className="admin-header-top">
          <h1>Dashboard</h1>
          <p>Visão geral do congresso</p>
        </div>

        <div className="admin-stats-grid">
          <div className="admin-stat-card">
            <div className="stat-icon">📊</div>
            <div className="stat-data">
              <strong>{events.length}</strong>
              <span>Eventos</span>
            </div>
          </div>
          <div className="admin-stat-card">
            <div className="stat-icon">👥</div>
            <div className="stat-data">
              <strong>{enrollments.length}</strong>
              <span>Inscrições</span>
            </div>
          </div>
          <div className="admin-stat-card">
            <div className="stat-icon">✓</div>
            <div className="stat-data">
              <strong>{attendances.length}</strong>
              <span>Presenças</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

// ADMIN EVENTS
function AdminEventsScreen({ onNavigate, onLogout, onShowToast }: { onNavigate: (screen: Screen) => void; onLogout: () => void; onShowToast: (msg: string, type: 'success' | 'error' | 'info') => void }) {
  const [events, setEvents] = useState(StorageDB.events.get())
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState({ title: '', description: '', date: '', time: '', location: '', category: '', capacity: 50 })

  const handleAdd = () => {
    const newEvent: Event = {
      id: 'evt-' + Date.now(),
      ...form,
      enrolled: 0
    }
    const allEvents = [...events, newEvent]
    setEvents(allEvents)
    StorageDB.events.set(allEvents)
    setForm({ title: '', description: '', date: '', time: '', location: '', category: '', capacity: 50 })
    setShowModal(false)
    onShowToast('Evento criado com sucesso!', 'success')
  }

  const handleDelete = (id: string) => {
    const filtered = events.filter(e => e.id !== id)
    setEvents(filtered)
    StorageDB.events.set(filtered)
    onShowToast('Evento deletado!', 'success')
  }

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <div className="admin-header">
          <img src={logo} alt="QuadCode" className="admin-logo" />
          <h2>Admin</h2>
        </div>
        <nav className="admin-nav">
          <button className="admin-nav-item" onClick={() => onNavigate('admin-home')}>Dashboard</button>
          <button className="admin-nav-item active" onClick={() => onNavigate('admin-events')}>Eventos</button>
          <button className="admin-nav-item" onClick={() => onNavigate('admin-qr')}>Presença</button>
          <button className="admin-nav-item" onClick={() => onNavigate('admin-certificates')}>Certificados</button>
          <button className="admin-nav-item" onClick={() => onNavigate('admin-reports')}>Relatórios</button>
        </nav>
        <div style={{ marginTop: 'auto', paddingTop: '16px', borderTop: '1px solid rgba(255,255,255,0.2)' }}>
          <button className="admin-nav-item" onClick={onLogout}>Sair</button>
        </div>
      </aside>

      <main className="admin-main">
        <div className="admin-header-top">
          <h1>Gerenciar Eventos</h1>
          <p>Crie, edite e delete eventos do congresso</p>
        </div>

        <div className="admin-actions">
          <button className="btn btn-primary" onClick={() => setShowModal(true)}>Novo Evento</button>
        </div>

        <div className="events-table">
          <h2>Eventos</h2>
          <table>
            <thead>
              <tr>
                <th>Título</th>
                <th>Data</th>
                <th>Horário</th>
                <th>Local</th>
                <th>Inscritos</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {events.map(event => (
                <tr key={event.id}>
                  <td>{event.title}</td>
                  <td>{event.date}</td>
                  <td>{event.time}</td>
                  <td>{event.location}</td>
                  <td>{event.enrolled}/{event.capacity}</td>
                  <td>
                    <button className="btn btn-danger btn-sm" onClick={() => handleDelete(event.id)}>Deletar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {showModal && (
          <div className="modal-overlay" onClick={() => setShowModal(false)}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
              <h2>Novo Evento</h2>
              <div className="modal-form">
                <div className="form-group">
                  <label>Título</label>
                  <input type="text" className="input" value={form.title} onChange={(e) => setForm({...form, title: e.target.value})} />
                </div>
                <div className="form-group">
                  <label>Descrição</label>
                  <input type="text" className="input" value={form.description} onChange={(e) => setForm({...form, description: e.target.value})} />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Data</label>
                    <input type="date" className="input" value={form.date} onChange={(e) => setForm({...form, date: e.target.value})} />
                  </div>
                  <div className="form-group">
                    <label>Horário</label>
                    <input type="time" className="input" value={form.time} onChange={(e) => setForm({...form, time: e.target.value})} />
                  </div>
                </div>
                <div className="form-group">
                  <label>Local</label>
                  <input type="text" className="input" value={form.location} onChange={(e) => setForm({...form, location: e.target.value})} />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Categoria</label>
                    <input type="text" className="input" value={form.category} onChange={(e) => setForm({...form, category: e.target.value})} />
                  </div>
                  <div className="form-group">
                    <label>Capacidade</label>
                    <input type="number" className="input" value={form.capacity} onChange={(e) => setForm({...form, capacity: parseInt(e.target.value)})} />
                  </div>
                </div>
                <div className="modal-buttons">
                  <button className="btn btn-outline" onClick={() => setShowModal(false)}>Cancelar</button>
                  <button className="btn btn-primary" onClick={handleAdd}>Criar</button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

// ADMIN QR
function AdminQRScreen({ onNavigate, onLogout, onShowToast }: { onNavigate: (screen: Screen) => void; onLogout: () => void; onShowToast: (msg: string, type: 'success' | 'error' | 'info') => void }) {
  const [qrInput, setQrInput] = useState('')
  const [attendances, setAttendances] = useState(StorageDB.attendances.get())

  const handleQRScan = () => {
    const enrollment = StorageDB.enrollments.get().find((e: Enrollment) => e.qrCode === qrInput)
    if (enrollment) {
      if (attendances.find((a: any) => a.enrollmentId === enrollment.id)) {
        onShowToast('Presença já registrada', 'error')
      } else {
        const newAttendance = { id: 'att-' + Date.now(), enrollmentId: enrollment.id, timestamp: new Date().toISOString() }
        const allAttendances = [...attendances, newAttendance]
        setAttendances(allAttendances)
        StorageDB.attendances.set(allAttendances)
        onShowToast('Presença registrada com sucesso!', 'success')
        setQrInput('')
      }
    } else {
      onShowToast('QR Code inválido', 'error')
    }
  }

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <div className="admin-header">
          <img src={logo} alt="QuadCode" className="admin-logo" />
          <h2>Admin</h2>
        </div>
        <nav className="admin-nav">
          <button className="admin-nav-item" onClick={() => onNavigate('admin-home')}>Dashboard</button>
          <button className="admin-nav-item" onClick={() => onNavigate('admin-events')}>Eventos</button>
          <button className="admin-nav-item active" onClick={() => onNavigate('admin-qr')}>Presença</button>
          <button className="admin-nav-item" onClick={() => onNavigate('admin-certificates')}>Certificados</button>
          <button className="admin-nav-item" onClick={() => onNavigate('admin-reports')}>Relatórios</button>
        </nav>
        <div style={{ marginTop: 'auto', paddingTop: '16px', borderTop: '1px solid rgba(255,255,255,0.2)' }}>
          <button className="admin-nav-item" onClick={onLogout}>Sair</button>
        </div>
      </aside>

      <main className="admin-main">
        <div className="admin-header-top">
          <h1>Registro de Presença</h1>
          <p>Escaneie QR Codes ou digite o código para registrar presença</p>
        </div>

        <div className="qr-section">
          <h2>Escanear QR Code</h2>
          <div className="form-group">
            <label>Código QR ou Código Alfanumérico</label>
            <input type="text" className="input" value={qrInput} onChange={(e) => setQrInput(e.target.value)} placeholder="Cole o código aqui" />
          </div>
          <button className="btn btn-primary" onClick={handleQRScan}>Registrar Presença</button>
        </div>

        <div className="attendances-table">
          <h2>Presenças Registradas</h2>
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Data/Hora</th>
              </tr>
            </thead>
            <tbody>
              {attendances.map((att: any) => (
                <tr key={att.id}>
                  <td>{att.id}</td>
                  <td>{new Date(att.timestamp).toLocaleString('pt-BR')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  )
}

// ADMIN CERTIFICATES
function AdminCertificatesScreen({ onNavigate, onLogout, onShowToast }: { onNavigate: (screen: Screen) => void; onLogout: () => void; onShowToast: (msg: string, type: 'success' | 'error' | 'info') => void }) {
  const enrollments = StorageDB.enrollments.get()
  const attendances = StorageDB.attendances.get()
  const events = StorageDB.events.get()

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <div className="admin-header">
          <img src={logo} alt="QuadCode" className="admin-logo" />
          <h2>Admin</h2>
        </div>
        <nav className="admin-nav">
          <button className="admin-nav-item" onClick={() => onNavigate('admin-home')}>Dashboard</button>
          <button className="admin-nav-item" onClick={() => onNavigate('admin-events')}>Eventos</button>
          <button className="admin-nav-item" onClick={() => onNavigate('admin-qr')}>Presença</button>
          <button className="admin-nav-item active" onClick={() => onNavigate('admin-certificates')}>Certificados</button>
          <button className="admin-nav-item" onClick={() => onNavigate('admin-reports')}>Relatórios</button>
        </nav>
        <div style={{ marginTop: 'auto', paddingTop: '16px', borderTop: '1px solid rgba(255,255,255,0.2)' }}>
          <button className="admin-nav-item" onClick={onLogout}>Sair</button>
        </div>
      </aside>

      <main className="admin-main">
        <div className="admin-header-top">
          <h1>Certificados</h1>
          <p>Gerencie certificados de participação</p>
        </div>

        <div className="certificates-list">
          {enrollments.map((enrollment: Enrollment) => {
            const event = events.find((e: Event) => e.id === enrollment.eventId)
            const attendance = attendances.find((a: any) => a.enrollmentId === enrollment.id)
            return (
              <div key={enrollment.id} className="certificate-card">
                <div className="cert-content">
                  <h3>{event?.title}</h3>
                  <p>{event?.date}</p>
                  <span className={`badge ${attendance ? 'badge-success' : 'badge-warning'}`}>
                    {attendance ? 'Certificado Disponível' : 'Aguardando Presença'}
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      </main>
    </div>
  )
}

// ADMIN REPORTS
function AdminReportsScreen({ onNavigate, onLogout, onShowToast }: { onNavigate: (screen: Screen) => void; onLogout: () => void; onShowToast: (msg: string, type: 'success' | 'error' | 'info') => void }) {
  const events = StorageDB.events.get()
  const enrollments = StorageDB.enrollments.get()
  const attendances = StorageDB.attendances.get()
  const users = StorageDB.users.get()

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <div className="admin-header">
          <img src={logo} alt="QuadCode" className="admin-logo" />
          <h2>Admin</h2>
        </div>
        <nav className="admin-nav">
          <button className="admin-nav-item" onClick={() => onNavigate('admin-home')}>Dashboard</button>
          <button className="admin-nav-item" onClick={() => onNavigate('admin-events')}>Eventos</button>
          <button className="admin-nav-item" onClick={() => onNavigate('admin-qr')}>Presença</button>
          <button className="admin-nav-item" onClick={() => onNavigate('admin-certificates')}>Certificados</button>
          <button className="admin-nav-item active" onClick={() => onNavigate('admin-reports')}>Relatórios</button>
        </nav>
        <div style={{ marginTop: 'auto', paddingTop: '16px', borderTop: '1px solid rgba(255,255,255,0.2)' }}>
          <button className="admin-nav-item" onClick={onLogout}>Sair</button>
        </div>
      </aside>

      <main className="admin-main">
        <div className="admin-header-top">
          <h1>Relatórios</h1>
          <p>Estatísticas e métricas do congresso</p>
        </div>

        <div className="reports-grid">
          <div className="report-card">
            <h3>Resumo Geral</h3>
            <div className="report-item">
              <span>Total de Eventos:</span>
              <strong>{events.length}</strong>
            </div>
            <div className="report-item">
              <span>Total de Inscrições:</span>
              <strong>{enrollments.length}</strong>
            </div>
            <div className="report-item">
              <span>Total de Participantes:</span>
              <strong>{users.filter((u: User) => u.email !== 'admin@ufla.br').length}</strong>
            </div>
            <div className="report-item">
              <span>Presenças Confirmadas:</span>
              <strong>{attendances.length}</strong>
            </div>
          </div>

          <div className="report-card">
            <h3>Taxa de Presença</h3>
            <div className="report-item">
              <span>Inscritos:</span>
              <strong>{enrollments.length}</strong>
            </div>
            <div className="report-item">
              <span>Presentes:</span>
              <strong>{attendances.length}</strong>
            </div>
            <div className="report-item">
              <span>Taxa:</span>
              <strong>{enrollments.length > 0 ? ((attendances.length / enrollments.length) * 100).toFixed(1) : 0}%</strong>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
