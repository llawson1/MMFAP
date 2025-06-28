// Notification Service with Frequency Controls
import { selfAuditService } from "./self-audit-service";

export type NotificationFrequency = "off" | "5min" | "30min" | "1hour";

export interface Notification {
  id: string;
  type: "transfer" | "audit" | "system" | "market";
  title: string;
  message: string;
  timestamp: Date;
  priority: "low" | "medium" | "high";
  read: boolean;
  actionUrl?: string;
}

class NotificationService {
  private notifications: Notification[] = [];
  private frequency: NotificationFrequency = "30min";
  private intervalId: NodeJS.Timeout | null = null;
  private listeners: Set<(notifications: Notification[]) => void> = new Set();

  constructor() {
    this.loadSettings();
    this.scheduleNotifications();
    this.subscribeToAudits();
  }

  private loadSettings(): void {
    const saved = localStorage.getItem("notification-frequency");
    if (saved && ["off", "5min", "30min", "1hour"].includes(saved)) {
      this.frequency = saved as NotificationFrequency;
    }
  }

  private saveSettings(): void {
    localStorage.setItem("notification-frequency", this.frequency);
  }

  setFrequency(frequency: NotificationFrequency): void {
    this.frequency = frequency;
    this.saveSettings();
    this.scheduleNotifications();
    
    this.addNotification({
      type: "system",
      title: "Notification Settings Updated",
      message: `Notifications ${frequency === "off" ? "disabled" : `set to every ${frequency.replace("min", " minutes").replace("hour", " hour")}`}`,
      priority: "low"
    });
  }

  getFrequency(): NotificationFrequency {
    return this.frequency;
  }

  private scheduleNotifications(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }

    if (this.frequency === "off") return;

    const intervals = {
      "5min": 5 * 60 * 1000,
      "30min": 30 * 60 * 1000,
      "1hour": 60 * 60 * 1000
    };

    const interval = intervals[this.frequency];
    this.intervalId = setInterval(() => {
      this.checkForUpdates();
    }, interval);
  }

  private subscribeToAudits(): void {
    // Listen for audit results and create notifications for critical issues
    setInterval(() => {
      const auditResults = selfAuditService.getLatestAuditResults();
      const recentFails = auditResults.filter(
        result => result.status === "fail" && 
        Date.now() - result.timestamp.getTime() < 10 * 60 * 1000 // Last 10 minutes
      );

      if (recentFails.length > 0) {
        this.addNotification({
          type: "audit",
          title: "Data Integrity Issues Detected",
          message: `${recentFails.length} critical issues found in recent audit`,
          priority: "high",
          actionUrl: "/system-health"
        });
      }
    }, 5 * 60 * 1000); // Check every 5 minutes
  }

  private async checkForUpdates(): void {
    if (this.frequency === "off") return;

    try {
      // Check for new transfers
      const response = await fetch('/api/transfers?limit=5');
      const recentTransfers = await response.json();
      
      const now = new Date();
      const cutoff = new Date(now.getTime() - this.getFrequencyMs());
      
      const newTransfers = recentTransfers.filter((transfer: any) => 
        new Date(transfer.timestamp) > cutoff
      );

      if (newTransfers.length > 0) {
        this.addNotification({
          type: "transfer",
          title: "New Transfer Activity",
          message: `${newTransfers.length} new transfer${newTransfers.length > 1 ? 's' : ''} detected`,
          priority: "medium",
          actionUrl: "/transfers"
        });
      }

      // Check for market value changes
      this.checkMarketUpdates();

    } catch (error) {
      console.warn("Notification check failed:", error);
    }
  }

  private async checkMarketUpdates(): void {
    // Simulate market value update checks
    const marketChanges = 0.5;
    
    if (marketChanges > 0.7) { // 30% chance of significant market movement
      this.addNotification({
        type: "market",
        title: "Market Movement Detected",
        message: "Significant player value changes in the last hour",
        priority: "medium",
        actionUrl: "/players?tab=market-tracker"
      });
    }
  }

  private getFrequencyMs(): number {
    const intervals = {
      "off": 0,
      "5min": 5 * 60 * 1000,
      "30min": 30 * 60 * 1000,
      "1hour": 60 * 60 * 1000
    };
    return intervals[this.frequency];
  }

  addNotification(notification: Omit<Notification, "id" | "timestamp" | "read">): void {
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString() + 0.5.toString(36).substr(2, 9),
      timestamp: new Date(),
      read: false
    };

    this.notifications.unshift(newNotification);
    
    // Keep only last 50 notifications
    if (this.notifications.length > 50) {
      this.notifications = this.notifications.slice(0, 50);
    }

    this.notifyListeners();

    // Show browser notification for high priority items
    if (notification.priority === "high" && this.frequency !== "off") {
      this.showBrowserNotification(newNotification);
    }
  }

  private showBrowserNotification(notification: Notification): void {
    if ("Notification" in window && Notification.permission === "granted") {
      new Notification(notification.title, {
        body: notification.message,
        icon: "/favicon.ico",
        tag: notification.type
      });
    } else if ("Notification" in window && Notification.permission !== "denied") {
      Notification.requestPermission().then(permission => {
        if (permission === "granted") {
          new Notification(notification.title, {
            body: notification.message,
            icon: "/favicon.ico",
            tag: notification.type
          });
        }
      });
    }
  }

  markAsRead(notificationId: string): void {
    const notification = this.notifications.find(n => n.id === notificationId);
    if (notification) {
      notification.read = true;
      this.notifyListeners();
    }
  }

  markAllAsRead(): void {
    this.notifications.forEach(n => n.read = true);
    this.notifyListeners();
  }

  clearNotifications(): void {
    this.notifications = [];
    this.notifyListeners();
  }

  getNotifications(): Notification[] {
    return this.notifications;
  }

  getUnreadCount(): number {
    return this.notifications.filter(n => !n.read).length;
  }

  subscribe(callback: (notifications: Notification[]) => void): () => void {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }

  private notifyListeners(): void {
    this.listeners.forEach(callback => callback(this.notifications));
  }

  destroy(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }
}

export const notificationService = new NotificationService();
export default notificationService;