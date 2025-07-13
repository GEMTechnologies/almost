import { v4 as uuidv4 } from 'uuid';

interface ThreatDetectionRequest {
  type: string;
  userId?: string;
  ipAddress?: string;
  userAgent?: string;
  details?: any;
  timestamp: Date;
}

interface ThreatDetectionResult {
  threat: boolean;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  details?: {
    reason?: string;
    patterns?: string[];
    blockedActions?: string[];
  };
}

class SecurityManager {
  private suspiciousIps = new Set<string>();
  private rateLimits = new Map<string, { count: number; lastReset: Date }>();
  
  detectThreat(request: ThreatDetectionRequest): ThreatDetectionResult {
    const threats: string[] = [];
    let riskLevel: 'low' | 'medium' | 'high' | 'critical' = 'low';
    
    // Check for suspicious IP addresses
    if (request.ipAddress && this.suspiciousIps.has(request.ipAddress)) {
      threats.push('Known suspicious IP');
      riskLevel = 'high';
    }
    
    // Check rate limits
    if (request.userId) {
      const limit = this.rateLimits.get(request.userId);
      if (limit && limit.count > 100 && 
          Date.now() - limit.lastReset.getTime() < 60000) { // 100 requests per minute
        threats.push('Rate limit exceeded');
        riskLevel = 'medium';
      }
    }
    
    // Check for SQL injection patterns
    if (request.details && typeof request.details === 'object') {
      const payload = JSON.stringify(request.details);
      const sqlPatterns = [
        /('|(\\')|(;)|(\\;)|(--)|(--)|(#)|(\\#)/i,
        /(union|select|insert|update|delete|drop|create|alter)/i
      ];
      
      for (const pattern of sqlPatterns) {
        if (pattern.test(payload)) {
          threats.push('Potential SQL injection');
          riskLevel = 'critical';
          break;
        }
      }
    }
    
    // Update rate limiting
    if (request.userId) {
      const now = new Date();
      const userLimit = this.rateLimits.get(request.userId);
      
      if (!userLimit || now.getTime() - userLimit.lastReset.getTime() > 60000) {
        this.rateLimits.set(request.userId, { count: 1, lastReset: now });
      } else {
        userLimit.count++;
      }
    }
    
    return {
      threat: threats.length > 0,
      riskLevel,
      details: threats.length > 0 ? {
        reason: threats.join(', '),
        patterns: threats,
        blockedActions: riskLevel === 'critical' ? ['write', 'delete'] : []
      } : undefined
    };
  }
  
  addSuspiciousIp(ip: string): void {
    this.suspiciousIps.add(ip);
  }
  
  clearRateLimits(): void {
    this.rateLimits.clear();
  }
}

export default SecurityManager;