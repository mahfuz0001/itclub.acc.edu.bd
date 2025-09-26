import { collection, addDoc, query, orderBy, limit, getDocs, where } from "firebase/firestore";
import { db } from "./config";

export interface AuditLog {
  id?: string;
  adminId: string;
  adminEmail: string;
  action: string;
  target: string;
  targetId: string;
  details: any;
  timestamp: string;
  ipAddress?: string;
  userAgent?: string;
}

export interface AdminActivity {
  totalActions: number;
  recentActions: AuditLog[];
  actionsByType: { [key: string]: number };
  mostActiveAdmins: { adminEmail: string; count: number }[];
}

export async function logAdminAction(
  adminId: string,
  adminEmail: string,
  action: string,
  target: string,
  targetId: string,
  details: any = {},
  metadata: { ipAddress?: string; userAgent?: string } = {}
): Promise<void> {
  try {
    const logEntry: AuditLog = {
      adminId,
      adminEmail,
      action,
      target,
      targetId,
      details: typeof details === 'object' ? details : { value: details },
      timestamp: new Date().toISOString(),
      ipAddress: metadata.ipAddress,
      userAgent: metadata.userAgent,
    };

    await addDoc(collection(db, "auditLogs"), logEntry);
  } catch (error) {
    console.error("Error logging admin action:", error);
    // Don't throw error to prevent breaking main functionality
  }
}

export async function getAuditLogs(
  limitCount: number = 50,
  adminEmail?: string
): Promise<AuditLog[]> {
  try {
    let auditQuery;
    
    if (adminEmail) {
      auditQuery = query(
        collection(db, "auditLogs"),
        where("adminEmail", "==", adminEmail),
        orderBy("timestamp", "desc"),
        limit(limitCount)
      );
    } else {
      auditQuery = query(
        collection(db, "auditLogs"),
        orderBy("timestamp", "desc"),
        limit(limitCount)
      );
    }

    const querySnapshot = await getDocs(auditQuery);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    })) as AuditLog[];
  } catch (error) {
    console.error("Error fetching audit logs:", error);
    return [];
  }
}

export async function getAdminActivity(): Promise<AdminActivity> {
  try {
    const logs = await getAuditLogs(500); // Get more logs for analytics
    
    const actionsByType = logs.reduce((acc, log) => {
      acc[log.action] = (acc[log.action] || 0) + 1;
      return acc;
    }, {} as { [key: string]: number });

    const adminActions = logs.reduce((acc, log) => {
      acc[log.adminEmail] = (acc[log.adminEmail] || 0) + 1;
      return acc;
    }, {} as { [key: string]: number });

    const mostActiveAdmins = Object.entries(adminActions)
      .map(([adminEmail, count]) => ({ adminEmail, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    return {
      totalActions: logs.length,
      recentActions: logs.slice(0, 20),
      actionsByType,
      mostActiveAdmins,
    };
  } catch (error) {
    console.error("Error fetching admin activity:", error);
    return {
      totalActions: 0,
      recentActions: [],
      actionsByType: {},
      mostActiveAdmins: [],
    };
  }
}

// Common audit actions
export const AUDIT_ACTIONS = {
  // Member actions
  MEMBER_VIEW: "member_view",
  MEMBER_EDIT: "member_edit", 
  MEMBER_DELETE: "member_delete",
  MEMBER_STATUS_CHANGE: "member_status_change",
  MEMBER_EXPORT: "member_export",
  
  // Application actions
  APPLICATION_APPROVE: "application_approve",
  APPLICATION_REJECT: "application_reject",
  APPLICATION_VIEW: "application_view",
  
  // News actions
  NEWS_CREATE: "news_create",
  NEWS_EDIT: "news_edit",
  NEWS_DELETE: "news_delete",
  NEWS_PUBLISH: "news_publish",
  
  // Gallery actions
  GALLERY_UPLOAD: "gallery_upload",
  GALLERY_DELETE: "gallery_delete",
  GALLERY_EDIT: "gallery_edit",
  
  // Admin actions
  ADMIN_LOGIN: "admin_login",
  ADMIN_LOGOUT: "admin_logout",
  USER_CREATE: "user_create",
  USER_DELETE: "user_delete",
  USER_ROLE_CHANGE: "user_role_change",
  
  // Settings actions
  SETTINGS_UPDATE: "settings_update",
  
  // Bulk actions
  BULK_EXPORT: "bulk_export",
  BULK_DELETE: "bulk_delete",
  BULK_UPDATE: "bulk_update",
} as const;

export type AuditAction = typeof AUDIT_ACTIONS[keyof typeof AUDIT_ACTIONS];