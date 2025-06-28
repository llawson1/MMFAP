// Real-time Transfer Updates Service - AUTHENTIC DATA ONLY
import { CurrentTransferService } from "./current-transfer-data";

export interface LiveTransfer {
  id: number;
  fromTeam: string;
  toTeam: string;
  playerName: string;
  transferFee: number;
  transferType: "permanent" | "loan" | "free" | "release_clause";
  date: string;
  reliability: number;
  source: string;
  sourceUrl: string;
  status: "rumor" | "confirmed" | "advanced_talks" | "medical" | "completed";
  timeAgo: string;
  isBreaking: boolean;
  tags: string[];
}

export interface LiveStats {
  transferRumors: number;
  confirmedDeals: number;
  totalSpending: number;
  activeNegotiations: number;
  completedToday: number;
  lastUpdate: string;
}

class LiveTransferService {
  private transfers: LiveTransfer[] = [];
  private stats: LiveStats = {
    transferRumors: 0,
    confirmedDeals: 0,
    totalSpending: 0,
    activeNegotiations: 0,
    completedToday: 0,
    lastUpdate: new Date().toISOString()
  };
  private listeners: Set<(data: { transfers: LiveTransfer[], stats: LiveStats }) => void> = new Set();

  constructor() {
    this.initializeData();
  }

  private initializeData() {
    // AUTHENTIC TRANSFERS ONLY - Load from verified sources only
    const currentData = CurrentTransferService.getCurrentTransfers();
    
    // Convert authentic current transfer data to LiveTransfer format
    this.transfers = currentData.map((transfer, index) => ({
      id: index + 1000,
      fromTeam: transfer.fromTeam,
      toTeam: transfer.toTeam,
      playerName: transfer.playerName,
      transferFee: transfer.transferFee,
      transferType: transfer.transferFee === 0 ? "free" : "permanent",
      date: transfer.timestamp.toISOString(),
      reliability: transfer.reliability,
      source: transfer.source,
      sourceUrl: transfer.sourceUrl,
      status: transfer.status as any,
      timeAgo: "",
      isBreaking: transfer.isBreaking,
      tags: this.generateAuthenticTags(transfer.status, transfer.isBreaking)
    }));

    this.updateTimeAgo();
    this.updateStats();
  }

  private generateAuthenticTags(status: string, isBreaking: boolean): string[] {
    const tags = [];
    
    if (isBreaking) tags.push("BREAKING");
    
    switch (status) {
      case "completed":
        tags.push("CONFIRMED", "OFFICIAL");
        break;
      case "medical":
        tags.push("MEDICAL");
        break;
      case "negotiations":
        tags.push("TALKS");
        break;
      default:
        tags.push("RUMOR");
    }
    
    return tags;
  }

  private updateTimeAgo() {
    const now = new Date();
    this.transfers.forEach(transfer => {
      const transferDate = new Date(transfer.date);
      const diffMs = now.getTime() - transferDate.getTime();
      const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
      const diffDays = Math.floor(diffHours / 24);
      
      if (diffDays > 0) {
        transfer.timeAgo = `${diffDays}d ago`;
      } else if (diffHours > 0) {
        transfer.timeAgo = `${diffHours}h ago`;
      } else {
        transfer.timeAgo = "Recently";
      }
    });
  }

  private updateStats() {
    this.stats = {
      transferRumors: this.transfers.filter(t => t.status === "rumor").length,
      confirmedDeals: this.transfers.filter(t => t.status === "completed").length,
      totalSpending: this.transfers.reduce((sum, t) => sum + t.transferFee, 0),
      activeNegotiations: this.transfers.filter(t => t.status === "negotiations").length,
      completedToday: this.transfers.filter(t => {
        const today = new Date().toDateString();
        const transferDate = new Date(t.date).toDateString();
        return transferDate === today && t.status === "completed";
      }).length,
      lastUpdate: new Date().toISOString()
    };
  }

  private notifyListeners() {
    this.listeners.forEach(listener => {
      listener({ transfers: this.transfers, stats: this.stats });
    });
  }

  public subscribe(listener: (data: { transfers: LiveTransfer[], stats: LiveStats }) => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  public getTransfers(): LiveTransfer[] {
    return this.transfers;
  }

  public getStats(): LiveStats {
    return this.stats;
  }

  public refreshData(): void {
    this.initializeData();
    this.notifyListeners();
  }
}

export const liveTransferService = new LiveTransferService();