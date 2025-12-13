export interface AuthSession {
  isAuthenticated: boolean;
  lastActivity: number;
  rememberMe: boolean;
}

class AuthService {
  private static instance: AuthService;
  private session: AuthSession | null = null;
  private readonly SESSION_TIMEOUT = 30 * 60 * 1000;

  private constructor() {
    this.loadSession();
  }

  static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  getStoredPin(): string {
    const settings = localStorage.getItem('gitemaster_settings');
    if (settings) {
      try {
        const parsed = JSON.parse(settings);
        return parsed.security?.pin || '1234';
      } catch {
        return '1234';
      }
    }
    return '1234';
  }

  updatePin(newPin: string): void {
    const settings = localStorage.getItem('gitemaster_settings');
    let parsed: any = {};
    
    if (settings) {
      try {
        parsed = JSON.parse(settings);
      } catch {}
    }

    parsed.security = parsed.security || {};
    parsed.security.pin = newPin;
    
    localStorage.setItem('gitemaster_settings', JSON.stringify(parsed));
  }

  verifyPin(pin: string): boolean {
    return pin === this.getStoredPin();
  }

  verifyCredentials(username: string, password: string): boolean {
    // Charger credentials depuis localStorage
    try {
      const stored = localStorage.getItem('gitemaster_credentials');
      if (stored) {
        const credentials = JSON.parse(stored);
        return (username === credentials.username && password === credentials.password);
      }
    } catch (error) {
      console.error('Error loading credentials:', error);
    }
    
    // Credentials par défaut si rien en localStorage
    return (username === 'admin' && password === 'admin123');
  }

  login(pin: string, rememberMe: boolean = false): boolean {
    if (this.verifyPin(pin)) {
      this.session = {
        isAuthenticated: true,
        lastActivity: Date.now(),
        rememberMe,
      };
      this.saveSession();
      return true;
    }
    return false;
  }

  loginWithCredentials(username: string, password: string, rememberMe: boolean = false): boolean {
    if (this.verifyCredentials(username, password)) {
      this.session = {
        isAuthenticated: true,
        lastActivity: Date.now(),
        rememberMe, // Utiliser la valeur passée
      };
      this.saveSession();
      return true;
    }
    return false;
  }

  logout(): void {
    this.session = null;
    localStorage.removeItem('gitemaster_auth_session');
    sessionStorage.removeItem('gitemaster_auth_session');
  }

  isAuthenticated(): boolean {
    if (!this.session) this.loadSession();
    if (!this.session?.isAuthenticated) return false;

    const timeSinceActivity = Date.now() - (this.session.lastActivity || 0);
    if (timeSinceActivity > this.SESSION_TIMEOUT && !this.session.rememberMe) {
      this.logout();
      return false;
    }
    return true;
  }

  updateActivity(): void {
    if (this.session?.isAuthenticated) {
      this.session.lastActivity = Date.now();
      this.saveSession();
    }
  }

  private saveSession(): void {
    if (!this.session) return;
    const storage = this.session.rememberMe ? localStorage : sessionStorage;
    storage.setItem('gitemaster_auth_session', JSON.stringify(this.session));
  }

  private loadSession(): void {
    let stored = localStorage.getItem('gitemaster_auth_session') || 
                 sessionStorage.getItem('gitemaster_auth_session');
    if (stored) {
      try {
        this.session = JSON.parse(stored);
      } catch {
        this.session = null;
      }
    }
  }
}

export default AuthService.getInstance();
