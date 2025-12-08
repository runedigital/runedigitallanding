// ENTERPRISE DASHBOARD DEMO - SHARED CONFIG
// This syncs between all dashboards using localStorage + BroadcastChannel

const CC_CONFIG = {
    // User profiles
    users: {
        ownerA: { 
            name: 'Owner A', 
            role: 'owner', 
            color: '#c4a77d', // Warm coffee/hedge fund gold
            accent: '#2d2d2d',
            title: 'OWNER // Franchise Group',
            theme: 'hedge-fund',
            icon: '🐔'
        },
        ownerB: { 
            name: 'Owner B', 
            role: 'owner', 
            color: '#ff3131', // Husqvarna red
            accent: '#1a1a1a',
            title: 'OWNER // Franchise Group',
            theme: 'ironman',
            icon: '🏍️'
        },
        managerA: { 
            name: 'Manager A', 
            role: 'manager', 
            color: '#d4af37', // Luxury gold
            accent: '#1a1a1a',
            title: 'MANAGER // Location Alpha',
            theme: 'luxury',
            icon: '👜'
        },
        managerB: { 
            name: 'Manager B', 
            role: 'manager', 
            color: '#ffd700', // Diamond gold
            accent: '#1a1a1a',
            title: 'MANAGER // Location Beta',
            subtitle: 'FRANCHISEE',
            theme: 'bling',
            icon: '💎'
        },
        corporate: {
            name: 'Enterprise',
            role: 'corporate',
            color: '#ffc20e', // CC Yellow
            accent: '#1a1a1a',
            title: 'FRANCHISE DASHBOARD',
            theme: 'corporate',
            icon: '🏢'
        }
    },

    // Default feature states
    defaultFeatures: {
        // Display features
        showSalesData: true,
        showStaffLeaderboard: true,
        showWebshopFeed: true,
        showMargins: false,        // Sensitive - owner controlled
        showShrinkage: false,      // Sensitive - owner controlled
        showToasts: true,
        
        // AI Intelligence features
        showSentiment: true,
        showCustomerHistory: true,
        showChurnRisk: true,
        showAiInsights: true,
        showTrendingThemes: true,
        showCompetitorAlerts: true,
        
        // Manager features
        showEmailTriage: true,
        showUrgentAlerts: true,
        showQuickReply: true
    },

    // Storage keys
    STORAGE_KEYS: {
        FEATURES: 'cc_features',
        REQUESTS: 'cc_requests',
        NOTIFICATIONS: 'cc_notifications'
    }
};

// ============================================
// SYNC ENGINE - Real-time updates
// ============================================

class CCSync {
    constructor(userId) {
        this.userId = userId;
        this.user = CC_CONFIG.users[userId];
        this.channel = new BroadcastChannel('cc_dashboard_sync');
        this.listeners = [];
        
        // Listen for updates from other tabs/windows
        this.channel.onmessage = (event) => {
            this.handleMessage(event.data);
        };
        
        // Initialize features if not exist
        if (!localStorage.getItem(CC_CONFIG.STORAGE_KEYS.FEATURES)) {
            this.saveFeatures(CC_CONFIG.defaultFeatures);
        }
        
        // Initialize requests if not exist
        if (!localStorage.getItem(CC_CONFIG.STORAGE_KEYS.REQUESTS)) {
            localStorage.setItem(CC_CONFIG.STORAGE_KEYS.REQUESTS, JSON.stringify([]));
        }
        
        // Initialize notifications if not exist
        if (!localStorage.getItem(CC_CONFIG.STORAGE_KEYS.NOTIFICATIONS)) {
            localStorage.setItem(CC_CONFIG.STORAGE_KEYS.NOTIFICATIONS, JSON.stringify([]));
        }
    }

    // Get current features
    getFeatures() {
        const stored = localStorage.getItem(CC_CONFIG.STORAGE_KEYS.FEATURES);
        return stored ? JSON.parse(stored) : CC_CONFIG.defaultFeatures;
    }

    // Save features (owner only)
    saveFeatures(features) {
        if (this.user.role !== 'owner' && this.user.role !== 'corporate') {
            console.warn('Only owners can modify features');
            return false;
        }
        localStorage.setItem(CC_CONFIG.STORAGE_KEYS.FEATURES, JSON.stringify(features));
        this.broadcast({ type: 'FEATURES_UPDATED', features, updatedBy: this.userId });
        return true;
    }

    // Toggle a single feature (owner only)
    toggleFeature(featureKey) {
        const features = this.getFeatures();
        features[featureKey] = !features[featureKey];
        return this.saveFeatures(features);
    }

    // Manager requests a feature change
    requestFeature(featureKey, requestedState, reason = '') {
        if (this.user.role !== 'manager') {
            console.warn('Only managers can request features');
            return false;
        }

        const request = {
            id: Date.now(),
            from: this.userId,
            fromName: this.user.name,
            feature: featureKey,
            requestedState,
            reason,
            timestamp: new Date().toISOString(),
            status: 'pending'
        };

        // Save request
        const requests = this.getRequests();
        requests.unshift(request);
        localStorage.setItem(CC_CONFIG.STORAGE_KEYS.REQUESTS, JSON.stringify(requests));

        // Create notification for owners
        this.createNotification({
            type: 'feature_request',
            title: `${this.user.name} requests access`,
            message: `${this.formatFeatureName(featureKey)}: ${requestedState ? 'Enable' : 'Disable'}`,
            reason,
            requestId: request.id,
            from: this.userId
        });

        // Broadcast
        this.broadcast({ type: 'NEW_REQUEST', request });
        
        return request;
    }

    // Get pending requests
    getRequests() {
        const stored = localStorage.getItem(CC_CONFIG.STORAGE_KEYS.REQUESTS);
        return stored ? JSON.parse(stored) : [];
    }

    // Approve/deny request (owner only)
    handleRequest(requestId, approved) {
        if (this.user.role !== 'owner') {
            console.warn('Only owners can handle requests');
            return false;
        }

        const requests = this.getRequests();
        const request = requests.find(r => r.id === requestId);
        
        if (!request) return false;

        request.status = approved ? 'approved' : 'denied';
        request.handledBy = this.userId;
        request.handledAt = new Date().toISOString();

        localStorage.setItem(CC_CONFIG.STORAGE_KEYS.REQUESTS, JSON.stringify(requests));

        // If approved, update the feature
        if (approved) {
            const features = this.getFeatures();
            features[request.feature] = request.requestedState;
            this.saveFeatures(features);
        }

        // Notify the requester
        this.createNotification({
            type: approved ? 'request_approved' : 'request_denied',
            title: approved ? '✅ Request Approved' : '❌ Request Denied',
            message: `${this.formatFeatureName(request.feature)} - ${approved ? 'Enabled' : 'Denied'} by ${this.user.name}`,
            for: request.from
        });

        this.broadcast({ type: 'REQUEST_HANDLED', requestId, approved, handledBy: this.userId });

        return true;
    }

    // Get notifications for current user
    getNotifications() {
        const stored = localStorage.getItem(CC_CONFIG.STORAGE_KEYS.NOTIFICATIONS);
        const all = stored ? JSON.parse(stored) : [];
        
        // Filter based on role
        if (this.user.role === 'owner') {
            return all.filter(n => n.type === 'feature_request' || n.for === this.userId);
        } else {
            return all.filter(n => n.for === this.userId || n.type === 'features_updated');
        }
    }

    // Create notification
    createNotification(notification) {
        notification.id = Date.now();
        notification.timestamp = new Date().toISOString();
        notification.read = false;

        const notifications = JSON.parse(localStorage.getItem(CC_CONFIG.STORAGE_KEYS.NOTIFICATIONS) || '[]');
        notifications.unshift(notification);
        
        // Keep only last 50
        if (notifications.length > 50) notifications.pop();
        
        localStorage.setItem(CC_CONFIG.STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifications));
        
        this.broadcast({ type: 'NEW_NOTIFICATION', notification });
    }

    // Mark notification as read
    markRead(notificationId) {
        const notifications = JSON.parse(localStorage.getItem(CC_CONFIG.STORAGE_KEYS.NOTIFICATIONS) || '[]');
        const notif = notifications.find(n => n.id === notificationId);
        if (notif) {
            notif.read = true;
            localStorage.setItem(CC_CONFIG.STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifications));
        }
    }

    // Clear all notifications for user
    clearNotifications() {
        const notifications = JSON.parse(localStorage.getItem(CC_CONFIG.STORAGE_KEYS.NOTIFICATIONS) || '[]');
        const filtered = notifications.filter(n => {
            if (this.user.role === 'owner') {
                return n.type !== 'feature_request' && n.for !== this.userId;
            } else {
                return n.for !== this.userId;
            }
        });
        localStorage.setItem(CC_CONFIG.STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(filtered));
    }

    // Broadcast message to all tabs
    broadcast(message) {
        message.timestamp = Date.now();
        message.source = this.userId;
        this.channel.postMessage(message);
    }

    // Handle incoming messages
    handleMessage(message) {
        this.listeners.forEach(listener => {
            listener(message);
        });
    }

    // Subscribe to updates
    onUpdate(callback) {
        this.listeners.push(callback);
    }

    // Format feature name for display
    formatFeatureName(key) {
        return key
            .replace(/^show/, '')
            .replace(/([A-Z])/g, ' $1')
            .trim();
    }

    // Get unread count
    getUnreadCount() {
        return this.getNotifications().filter(n => !n.read).length;
    }
}

// Export for use
window.CC_CONFIG = CC_CONFIG;
window.CCSync = CCSync;
