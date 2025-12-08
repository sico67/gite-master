import { Injectable } from '@angular/core';
import { v4 as uuid } from 'uuid';

const STORAGE_KEY = 'gite_master_data_v1';

@Injectable({ providedIn: 'root' })
export class DataService {
  private state: any = null;

  constructor() {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      this.state = JSON.parse(raw);
    } else {
      this.state = this._initialState();
      this._save();
    }
  }

  private _initialState() {
    return {
      reservations: [],
      menages: [],
      finances: [],
      guides: [],
      settings: {
        taxeSejourTaux: 0.88
      }
    };
  }

  private _save() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
  }

  getReservations() {
    return this.state.reservations;
  }

  getReservationById(id: string) {
    return this.state.reservations.find(r => r.id === id);
  }

  addReservation(res) {
    const item = { ...res, id: uuid(), createdAt: new Date().toISOString() };
    this.state.reservations.push(item);
    this._save();
    return item;
  }

  updateReservation(id, patch) {
    const i = this.state.reservations.findIndex(r => r.id === id);
    if (i >= 0) {
      this.state.reservations[i] = { ...this.state.reservations[i], ...patch };
      this._save();
    }
  }

  getMenages() { return this.state.menages; }
  addMenage(m) { m.id = uuid(); this.state.menages.push(m); this._save(); return m; }

  getSettings() { return this.state.settings; }
  updateSettings(s) { this.state.settings = { ...this.state.settings, ...s }; this._save(); }
}
