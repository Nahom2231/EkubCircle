import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CircleDetails, CircleSummary, CreateCircleRequest, HistoryItem, PayoutResponse, Round } from './models';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private http = inject(HttpClient);

  mine(): Observable<CircleSummary[]> { return this.http.get<CircleSummary[]>('/api/circles/mine'); }
  available(search = '', frequency = ''): Observable<CircleSummary[]> {
    let params = new HttpParams();
    if (search) params = params.set('search', search);
    if (frequency) params = params.set('frequency', frequency);
    return this.http.get<CircleSummary[]>('/api/circles/available', { params });
  }
  createCircle(body: CreateCircleRequest): Observable<CircleSummary> { return this.http.post<CircleSummary>('/api/circles', body); }
  details(id: number): Observable<CircleDetails> { return this.http.get<CircleDetails>(`/api/circles/${id}`); }
  join(id: number): Observable<{message: string}> { return this.http.post<{message: string}>(`/api/circles/${id}/join`, {}); }
  addMember(id: number, emailOrPhone: string): Observable<{message: string}> { return this.http.post<{message: string}>(`/api/circles/${id}/members`, { emailOrPhone }); }
  start(id: number): Observable<{message: string}> { return this.http.post<{message: string}>(`/api/circles/${id}/start`, {}); }
  currentRound(id: number): Observable<Round> { return this.http.get<Round>(`/api/circles/${id}/current-round`); }
  rounds(id: number): Observable<Round[]> { return this.http.get<Round[]>(`/api/circles/${id}/rounds`); }
  history(id: number): Observable<HistoryItem[]> { return this.http.get<HistoryItem[]>(`/api/circles/${id}/history`); }
  payment(roundId: number, membershipId: number, amount: number, referenceNote = ''): Observable<{message: string}> {
    return this.http.post<{message: string}>(`/api/rounds/${roundId}/payments/${membershipId}`, { amount, referenceNote, paidAt: new Date().toISOString() });
  }
  payout(circleId: number): Observable<PayoutResponse> { return this.http.post<PayoutResponse>(`/api/circles/${circleId}/payout`, {}); }
}
