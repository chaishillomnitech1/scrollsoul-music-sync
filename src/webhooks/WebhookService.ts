/**
 * Webhook Service
 * Manages webhook subscriptions and event delivery
 */

export type WebhookEvent =
  | 'video.generation.started'
  | 'video.generation.completed'
  | 'video.generation.failed'
  | 'video.published'
  | 'nft.sale.detected'
  | 'subscription.updated'
  | 'payment.received'
  | 'order.created'
  | 'order.completed';

export interface WebhookEndpoint {
  id: string;
  tenantId: string;
  url: string;
  events: WebhookEvent[];
  secret: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface WebhookDelivery {
  id: string;
  endpointId: string;
  event: WebhookEvent;
  payload: Record<string, unknown>;
  status: 'PENDING' | 'SENT' | 'FAILED' | 'RETRYING';
  attempts: number;
  lastAttemptAt?: Date;
  nextRetryAt?: Date;
  responseCode?: number;
  responseBody?: string;
  createdAt: Date;
}

export class WebhookService {
  private endpoints: Map<string, WebhookEndpoint> = new Map();
  private deliveries: WebhookDelivery[] = [];
  private maxRetries: number = 3;

  /**
   * Register a webhook endpoint
   */
  async registerEndpoint(data: {
    tenantId: string;
    url: string;
    events: WebhookEvent[];
  }): Promise<WebhookEndpoint> {
    const endpoint: WebhookEndpoint = {
      id: this.generateId(),
      tenantId: data.tenantId,
      url: data.url,
      events: data.events,
      secret: this.generateSecret(),
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.endpoints.set(endpoint.id, endpoint);
    return endpoint;
  }

  /**
   * Update webhook endpoint
   */
  async updateEndpoint(
    endpointId: string,
    updates: {
      url?: string;
      events?: WebhookEvent[];
      isActive?: boolean;
    }
  ): Promise<WebhookEndpoint> {
    const endpoint = this.endpoints.get(endpointId);
    if (!endpoint) {
      throw new Error('Webhook endpoint not found');
    }

    if (updates.url) endpoint.url = updates.url;
    if (updates.events) endpoint.events = updates.events;
    if (updates.isActive !== undefined) endpoint.isActive = updates.isActive;
    endpoint.updatedAt = new Date();

    this.endpoints.set(endpointId, endpoint);
    return endpoint;
  }

  /**
   * Delete webhook endpoint
   */
  async deleteEndpoint(endpointId: string): Promise<void> {
    this.endpoints.delete(endpointId);
  }

  /**
   * Trigger webhook event
   */
  async triggerEvent(
    tenantId: string,
    event: WebhookEvent,
    payload: Record<string, unknown>
  ): Promise<void> {
    // Find all active endpoints for this tenant that listen to this event
    const endpoints = Array.from(this.endpoints.values()).filter(
      (e) => e.tenantId === tenantId && e.isActive && e.events.includes(event)
    );

    // Create deliveries for each endpoint
    for (const endpoint of endpoints) {
      const delivery: WebhookDelivery = {
        id: this.generateId(),
        endpointId: endpoint.id,
        event,
        payload,
        status: 'PENDING',
        attempts: 0,
        createdAt: new Date(),
      };

      this.deliveries.push(delivery);
      
      // Deliver webhook asynchronously
      this.deliverWebhook(delivery, endpoint).catch((error) => {
        console.error(`Failed to deliver webhook ${delivery.id}:`, error);
      });
    }
  }

  /**
   * Deliver webhook to endpoint
   */
  private async deliverWebhook(delivery: WebhookDelivery, endpoint: WebhookEndpoint): Promise<void> {
    delivery.attempts += 1;
    delivery.lastAttemptAt = new Date();

    try {
      // In production, this would make an actual HTTP request
      // const response = await axios.post(endpoint.url, {
      //   event: delivery.event,
      //   data: delivery.payload,
      //   timestamp: new Date().toISOString(),
      // }, {
      //   headers: {
      //     'X-ScrollSoul-Signature': this.generateSignature(delivery.payload, endpoint.secret),
      //     'Content-Type': 'application/json',
      //   },
      // });

      // Mock successful delivery
      delivery.status = 'SENT';
      delivery.responseCode = 200;
      delivery.responseBody = 'OK';

      console.log(`Webhook ${delivery.id} delivered successfully to ${endpoint.url}`);
    } catch (error) {
      delivery.status = 'FAILED';

      // Retry logic
      if (delivery.attempts < this.maxRetries) {
        delivery.status = 'RETRYING';
        delivery.nextRetryAt = this.calculateRetryTime(delivery.attempts);

        console.log(
          `Webhook ${delivery.id} failed, will retry at ${delivery.nextRetryAt.toISOString()}`
        );

        // Schedule retry
        setTimeout(() => {
          this.deliverWebhook(delivery, endpoint);
        }, delivery.nextRetryAt.getTime() - Date.now());
      } else {
        console.error(`Webhook ${delivery.id} failed after ${delivery.attempts} attempts`);
      }
    }
  }

  /**
   * Get webhook endpoints for tenant
   */
  async getEndpoints(tenantId: string): Promise<WebhookEndpoint[]> {
    return Array.from(this.endpoints.values()).filter((e) => e.tenantId === tenantId);
  }

  /**
   * Get webhook deliveries for endpoint
   */
  async getDeliveries(endpointId: string, limit: number = 50): Promise<WebhookDelivery[]> {
    return this.deliveries
      .filter((d) => d.endpointId === endpointId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(0, limit);
  }

  /**
   * Retry failed webhook delivery
   */
  async retryDelivery(deliveryId: string): Promise<void> {
    const delivery = this.deliveries.find((d) => d.id === deliveryId);
    if (!delivery) {
      throw new Error('Delivery not found');
    }

    const endpoint = this.endpoints.get(delivery.endpointId);
    if (!endpoint) {
      throw new Error('Endpoint not found');
    }

    delivery.status = 'PENDING';
    await this.deliverWebhook(delivery, endpoint);
  }

  /**
   * Generate signature for webhook payload
   */
  private generateSignature(payload: Record<string, unknown>, secret: string): string {
    // In production, this would use HMAC-SHA256
    const payloadStr = JSON.stringify(payload);
    return `sha256=${secret.substring(0, 10)}_${payloadStr.length}`;
  }

  /**
   * Calculate retry time with exponential backoff
   */
  private calculateRetryTime(attemptNumber: number): Date {
    const delay = Math.pow(2, attemptNumber) * 1000; // Exponential backoff
    return new Date(Date.now() + delay);
  }

  private generateId(): string {
    return `wh_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private generateSecret(): string {
    return `whsec_${Math.random().toString(36).substring(2, 34)}`;
  }
}
