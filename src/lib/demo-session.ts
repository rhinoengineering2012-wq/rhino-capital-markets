const LOGIN_KEY = 'rhino_logged';
const TRIAL_START_KEY = 'rhino_trial_started';

export function isDemoLoggedIn(): boolean {
  return localStorage.getItem(LOGIN_KEY) === 'true';
}

export function startDemoSession(): void {
  localStorage.setItem(LOGIN_KEY, 'true');
  if (!localStorage.getItem(TRIAL_START_KEY)) {
    localStorage.setItem(TRIAL_START_KEY, new Date().toISOString());
  }
}

export function endDemoSession(): void {
  localStorage.removeItem(LOGIN_KEY);
}

export function getTrialStartedAt(): string {
  return localStorage.getItem(TRIAL_START_KEY) ?? new Date().toISOString();
}
