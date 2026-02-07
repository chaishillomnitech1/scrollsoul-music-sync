/**
 * Permission definition
 */
export interface Permission {
  resource: string;
  action: string;
}

/**
 * Role definition
 */
export interface Role {
  id: string;
  name: string;
  permissions: Permission[];
}

/**
 * Access request
 */
export interface AccessRequest {
  user: {
    id: string;
    roles: string[];
    attributes?: Record<string, any>;
  };
  resource: string;
  action: string;
  ip?: string;
  timestamp?: number;
  tenantId?: string;
}

/**
 * Policy definition
 */
export interface Policy {
  id: string;
  resource: string;
  conditions: PolicyCondition[];
}

/**
 * Policy condition
 */
export interface PolicyCondition {
  type: 'role' | 'attribute' | 'time' | 'ip' | 'tenant';
  operator: 'equals' | 'in' | 'contains' | 'greaterThan' | 'lessThan';
  value: any;
}

/**
 * Access Control Entry
 */
export interface ACL {
  userId: string;
  resourceId: string;
  permissions: string[];
  expiresAt?: number;
  createdAt: number;
}

/**
 * Authorization Service
 * Implements RBAC (Role-Based Access Control) and ABAC (Attribute-Based Access Control)
 */
export class AuthorizationService {
  private roles: Map<string, Role> = new Map();
  private userRoles: Map<string, string[]> = new Map();
  private policies: Map<string, Policy> = new Map();
  private acls: Map<string, ACL[]> = new Map(); // resourceId -> ACLs

  constructor() {
    this.initializeDefaultRoles();
  }

  /**
   * Initialize default roles
   */
  private initializeDefaultRoles() {
    const adminRole: Role = {
      id: 'admin',
      name: 'Administrator',
      permissions: [
        { resource: '*', action: '*' }, // Full access
      ],
    };

    const userRole: Role = {
      id: 'user',
      name: 'User',
      permissions: [
        { resource: 'track', action: 'read' },
        { resource: 'track', action: 'create' },
        { resource: 'license', action: 'read' },
        { resource: 'analytics', action: 'read' },
      ],
    };

    const viewerRole: Role = {
      id: 'viewer',
      name: 'Viewer',
      permissions: [
        { resource: 'track', action: 'read' },
        { resource: 'license', action: 'read' },
      ],
    };

    this.roles.set(adminRole.id, adminRole);
    this.roles.set(userRole.id, userRole);
    this.roles.set(viewerRole.id, viewerRole);
  }

  /**
   * Assign role to user
   */
  async assignRole(userId: string, roleId: string): Promise<void> {
    const roles = this.userRoles.get(userId) || [];
    if (!roles.includes(roleId)) {
      roles.push(roleId);
      this.userRoles.set(userId, roles);
    }
  }

  /**
   * Remove role from user
   */
  async removeRole(userId: string, roleId: string): Promise<void> {
    const roles = this.userRoles.get(userId) || [];
    const filtered = roles.filter((r) => r !== roleId);
    this.userRoles.set(userId, filtered);
  }

  /**
   * Get user roles
   */
  async getUserRoles(userId: string): Promise<string[]> {
    return this.userRoles.get(userId) || [];
  }

  /**
   * Get role permissions
   */
  async getRolePermissions(roleId: string): Promise<Permission[]> {
    const role = this.roles.get(roleId);
    return role ? role.permissions : [];
  }

  /**
   * Check permission (RBAC)
   */
  async checkPermission(userId: string, resource: string, action: string): Promise<boolean> {
    const userRoles = await this.getUserRoles(userId);

    for (const roleId of userRoles) {
      const permissions = await this.getRolePermissions(roleId);
      
      for (const permission of permissions) {
        // Check for wildcard permissions
        if (permission.resource === '*' && permission.action === '*') {
          return true;
        }
        
        // Check for resource wildcard
        if (permission.resource === '*' && permission.action === action) {
          return true;
        }
        
        // Check for action wildcard
        if (permission.resource === resource && permission.action === '*') {
          return true;
        }
        
        // Check for exact match
        if (permission.resource === resource && permission.action === action) {
          return true;
        }
      }
    }

    return false;
  }

  /**
   * Set policy for resource
   */
  async setPolicy(resource: string, conditions: PolicyCondition[]): Promise<string> {
    const policy: Policy = {
      id: `policy-${Date.now()}`,
      resource,
      conditions,
    };
    
    this.policies.set(resource, policy);
    return policy.id;
  }

  /**
   * Get policy for resource
   */
  async getPolicy(resource: string): Promise<Policy | undefined> {
    return this.policies.get(resource);
  }

  /**
   * Evaluate policy condition
   */
  private evaluateCondition(condition: PolicyCondition, context: any): boolean {
    const contextValue = context[condition.type];
    
    switch (condition.operator) {
      case 'equals':
        return contextValue === condition.value;
      
      case 'in':
        // Check if contextValue is in the array OR if the array contextValue contains value
        if (Array.isArray(contextValue)) {
          return contextValue.some(v => condition.value.includes(v));
        }
        return Array.isArray(condition.value) && condition.value.includes(contextValue);
      
      case 'contains':
        return Array.isArray(contextValue) && contextValue.includes(condition.value);
      
      case 'greaterThan':
        return contextValue > condition.value;
      
      case 'lessThan':
        return contextValue < condition.value;
      
      default:
        return false;
    }
  }

  /**
   * Evaluate policy (ABAC)
   */
  evaluatePolicy(policy: Policy, context: any): boolean {
    // All conditions must be satisfied
    return policy.conditions.every((condition) => this.evaluateCondition(condition, context));
  }

  /**
   * Check policy (ABAC)
   */
  async checkPolicy(request: AccessRequest): Promise<boolean> {
    const policy = await this.getPolicy(request.resource);
    
    if (!policy) {
      // No policy defined, fall back to RBAC
      return this.checkPermission(request.user.id, request.resource, request.action);
    }

    // Build context for policy evaluation
    const context = {
      role: request.user.roles,
      user: request.user.id,
      action: request.action,
      ip: request.ip,
      time: request.timestamp || Date.now(),
      tenant: request.tenantId,
      ...request.user.attributes,
    };

    return this.evaluatePolicy(policy, context);
  }

  /**
   * Grant resource access (fine-grained permissions)
   */
  async grantResourceAccess(
    userId: string,
    resourceId: string,
    permissions: string[]
  ): Promise<void> {
    const acl: ACL = {
      userId,
      resourceId,
      permissions,
      createdAt: Date.now(),
      expiresAt: Date.now() + 30 * 24 * 60 * 60 * 1000, // 30 days
    };

    const existing = this.acls.get(resourceId) || [];
    
    // Remove any existing ACL for this user/resource
    const filtered = existing.filter((a) => a.userId !== userId);
    filtered.push(acl);
    
    this.acls.set(resourceId, filtered);
  }

  /**
   * Revoke resource access
   */
  async revokeResourceAccess(userId: string, resourceId: string): Promise<void> {
    const existing = this.acls.get(resourceId) || [];
    const filtered = existing.filter((a) => a.userId !== userId);
    this.acls.set(resourceId, filtered);
  }

  /**
   * Check resource access
   */
  async checkResourceAccess(
    userId: string,
    resourceId: string,
    permission: string
  ): Promise<boolean> {
    const acls = this.acls.get(resourceId) || [];
    
    for (const acl of acls) {
      if (acl.userId !== userId) continue;
      
      // Check expiration
      if (acl.expiresAt && Date.now() > acl.expiresAt) {
        continue;
      }
      
      // Check permission
      if (acl.permissions.includes(permission) || acl.permissions.includes('*')) {
        return true;
      }
    }
    
    return false;
  }

  /**
   * Get user's resource permissions
   */
  async getUserResourcePermissions(userId: string, resourceId: string): Promise<string[]> {
    const acls = this.acls.get(resourceId) || [];
    
    for (const acl of acls) {
      if (acl.userId === userId) {
        // Check expiration
        if (!acl.expiresAt || Date.now() <= acl.expiresAt) {
          return acl.permissions;
        }
      }
    }
    
    return [];
  }

  /**
   * Clean up expired ACLs
   */
  async cleanupExpiredACLs(): Promise<number> {
    let cleaned = 0;
    const now = Date.now();
    
    for (const [resourceId, acls] of this.acls.entries()) {
      const filtered = acls.filter((acl) => !acl.expiresAt || now <= acl.expiresAt);
      
      if (filtered.length < acls.length) {
        cleaned += acls.length - filtered.length;
        this.acls.set(resourceId, filtered);
      }
    }
    
    return cleaned;
  }

  /**
   * Get statistics
   */
  getStats() {
    let totalACLs = 0;
    for (const acls of this.acls.values()) {
      totalACLs += acls.length;
    }
    
    return {
      totalRoles: this.roles.size,
      totalUsers: this.userRoles.size,
      totalPolicies: this.policies.size,
      totalACLs,
    };
  }
}
