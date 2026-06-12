import { User, HistoryItem, Transaction, AffiliateData, Notification, ActivityLog, ExpertiseClassification } from '../types';

// Helper for UUID since we don't have the package installed yet, I'll use a simple one
const generateId = () => Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

const STORAGE_KEYS = {
  USERS: 'brandvision_users',
  CURRENT_USER: 'brandvision_current_user',
  HISTORY: 'brandvision_history',
  TRANSACTIONS: 'brandvision_transactions',
  AFFILIATE: 'brandvision_affiliate',
  NOTIFICATIONS: 'brandvision_notifications',
  ACTIVITY_LOGS: 'brandvision_activity_logs',
  SETTINGS: 'brandvision_settings'
};

class MockBackend {
  private getData<T>(key: string): T[] {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
  }

  private setData<T>(key: string, data: T): void {
    localStorage.setItem(key, JSON.stringify(data));
  }

  // Auth
  getCurrentUser(): User | null {
    const user = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    return user ? JSON.parse(user) : null;
  }

  login(email: string, password: string): User {
    const users = this.getData<User>(STORAGE_KEYS.USERS);
    const user = users.find(u => u.email === email);
    if (!user) throw new Error("User not found");
    
    // In a real app, we'd check password hash
    this.setData(STORAGE_KEYS.CURRENT_USER, user);
    this.logActivity(user.id, "Login", "User logged in successfully");
    return user;
  }

  register(name: string, email: string, password: string, phoneNumber?: string): User {
    const users = this.getData<User>(STORAGE_KEYS.USERS);
    if (users.find(u => u.email === email)) throw new Error("Email already exists");

    const newUser: User = {
      id: generateId(),
      name,
      email,
      phoneNumber: phoneNumber || '',
      role: 'user',
      subscription: 'free',
      createdAt: new Date().toISOString(),
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`
    };

    users.push(newUser);
    this.setData(STORAGE_KEYS.USERS, users);
    this.setData(STORAGE_KEYS.CURRENT_USER, newUser);
    this.logActivity(newUser.id, "Register", "New user registered");
    
    // Create initial affiliate data
    this.createAffiliateData(newUser.id);
    
    return newUser;
  }

  logout(): void {
    const user = this.getCurrentUser();
    if (user) this.logActivity(user.id, "Logout", "User logged out");
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
  }

  // History
  getHistory(userId: string): HistoryItem[] {
    return this.getData<HistoryItem>(STORAGE_KEYS.HISTORY).filter(h => h.userId === userId);
  }

  saveHistory(userId: string, inputText: string, result: ExpertiseClassification): HistoryItem {
    const history = this.getData<HistoryItem>(STORAGE_KEYS.HISTORY);
    const newItem: HistoryItem = {
      id: generateId(),
      userId,
      inputText,
      result,
      createdAt: new Date().toISOString()
    };
    history.unshift(newItem);
    this.setData(STORAGE_KEYS.HISTORY, history);
    this.logActivity(userId, "Classification", "New expertise classification saved");
    return newItem;
  }

  deleteHistory(id: string): void {
    const history = this.getData<HistoryItem>(STORAGE_KEYS.HISTORY);
    this.setData(STORAGE_KEYS.HISTORY, history.filter(h => h.id !== id));
  }

  // Subscription
  upgradeToPro(userId: string): void {
    const users = this.getData<User>(STORAGE_KEYS.USERS);
    const userIndex = users.findIndex(u => u.id === userId);
    if (userIndex !== -1) {
      users[userIndex].subscription = 'pro';
      this.setData(STORAGE_KEYS.USERS, users);
      
      // Update current user if it's the same
      const currentUser = this.getCurrentUser();
      if (currentUser && currentUser.id === userId) {
        currentUser.subscription = 'pro';
        this.setData(STORAGE_KEYS.CURRENT_USER, currentUser);
      }

      // Create transaction record
      this.createTransaction(userId, 29.99, 'success', 'pro');
      this.logActivity(userId, "Subscription", "Upgraded to Pro plan");
      this.createNotification(userId, "Welcome to Pro!", "You now have unlimited access to all features.", "success");
    }
  }

  setSubscriptionPlan(userId: string, plan: 'free' | 'pro'): void {
    const users = this.getData<User>(STORAGE_KEYS.USERS);
    const userIndex = users.findIndex(u => u.id === userId);
    if (userIndex !== -1) {
      users[userIndex].subscription = plan;
      this.setData(STORAGE_KEYS.USERS, users);
      
      // Update current user if it's the same
      const currentUser = this.getCurrentUser();
      if (currentUser && currentUser.id === userId) {
        currentUser.subscription = plan;
        this.setData(STORAGE_KEYS.CURRENT_USER, currentUser);
      }
      this.logActivity(userId, "Subscription", `Subscription plan updated to ${plan}`);
      this.createNotification(userId, plan === 'pro' ? "Pro Plan Activated (Full Access)" : "Free Plan Activated (Limited Access)", plan === 'pro' ? "Congratulations! Enjoy unlimited access." : "Your plan has been changed to Free. Some features are now locked.", "info");
    }
  }

  updateUserProfile(userId: string, updatedFields: Partial<User>): User {
    const users = this.getData<User>(STORAGE_KEYS.USERS);
    const userIndex = users.findIndex(u => u.id === userId);
    if (userIndex === -1) throw new Error("User not found");

    const updatedUser = {
      ...users[userIndex],
      ...updatedFields
    };

    users[userIndex] = updatedUser;
    this.setData(STORAGE_KEYS.USERS, users);

    // Update current user session if it matches
    const currentUser = this.getCurrentUser();
    if (currentUser && currentUser.id === userId) {
      this.setData(STORAGE_KEYS.CURRENT_USER, updatedUser);
    }

    this.logActivity(userId, "Profile Update", "Updated profile information");
    return updatedUser;
  }

  deleteAllUserData(userId: string): void {
    // 1. Delete history for this user
    const history = this.getData<HistoryItem>(STORAGE_KEYS.HISTORY);
    this.setData(STORAGE_KEYS.HISTORY, history.filter(h => h.userId !== userId));

    // 2. Delete notifications for this user
    const notifications = this.getData<Notification>(STORAGE_KEYS.NOTIFICATIONS);
    this.setData(STORAGE_KEYS.NOTIFICATIONS, notifications.filter(n => n.userId !== userId));

    // 3. Delete transactions for this user
    const transactions = this.getData<Transaction>(STORAGE_KEYS.TRANSACTIONS);
    this.setData(STORAGE_KEYS.TRANSACTIONS, transactions.filter(t => t.userId !== userId));

    // 4. Delete activity logs for this user
    const logs = this.getData<ActivityLog>(STORAGE_KEYS.ACTIVITY_LOGS);
    this.setData(STORAGE_KEYS.ACTIVITY_LOGS, logs.filter(l => l.userId !== userId));

    // 5. Reset affiliate data of this user
    const affiliatesList = this.getData<Record<string, AffiliateData>>(STORAGE_KEYS.AFFILIATE);
    const current = affiliatesList[0] || {};
    if (current && current[userId]) {
      current[userId] = {
        referralCode: current[userId].referralCode || `BV-${userId.substring(0, 5).toUpperCase()}`,
        referrals: 0,
        totalCommission: 0,
        pendingCommission: 0
      };
      this.setData(STORAGE_KEYS.AFFILIATE, [current]);
    }

    // 6. Reset user profile custom fields
    const users = this.getData<User>(STORAGE_KEYS.USERS);
    const userIndex = users.findIndex(u => u.id === userId);
    if (userIndex !== -1) {
      const cleanedUser = {
        ...users[userIndex],
        phoneNumber: "",
        twitterHandle: "",
        linkedinUrl: "",
        portfolioWebsite: ""
      };
      users[userIndex] = cleanedUser;
      this.setData(STORAGE_KEYS.USERS, users);

      const currentUser = this.getCurrentUser();
      if (currentUser && currentUser.id === userId) {
        this.setData(STORAGE_KEYS.CURRENT_USER, cleanedUser);
      }
    }

    this.logActivity(userId, "Database Reset", "Deleted all personal user data records");
  }

  resetToDefaultSeed(userId: string): void {
    // Clear everything
    localStorage.removeItem(STORAGE_KEYS.USERS);
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    localStorage.removeItem(STORAGE_KEYS.HISTORY);
    localStorage.removeItem(STORAGE_KEYS.TRANSACTIONS);
    localStorage.removeItem(STORAGE_KEYS.AFFILIATE);
    localStorage.removeItem(STORAGE_KEYS.NOTIFICATIONS);
    localStorage.removeItem(STORAGE_KEYS.ACTIVITY_LOGS);
    localStorage.removeItem(STORAGE_KEYS.SETTINGS);

    // Call standard seed to reinitialize everything
    this.seedData();

    // Since we cleared current user, log back in as default
    const users = this.getData<User>(STORAGE_KEYS.USERS);
    let defaultUser = users.find(u => u.id === userId);
    if (!defaultUser) {
      // Fallback if that specific user isn't found
      defaultUser = users.find(u => u.email === 'demo@brandvision.ai') || users[0];
    }

    if (defaultUser) {
      this.setData(STORAGE_KEYS.CURRENT_USER, defaultUser);
      this.logActivity(defaultUser.id, "Database Reset", "Restored system database to initial seeded defaults");
    }
  }

  // Transactions
  getTransactions(userId: string): Transaction[] {
    return this.getData<Transaction>(STORAGE_KEYS.TRANSACTIONS).filter(t => t.userId === userId);
  }

  private createTransaction(userId: string, amount: number, status: 'success' | 'pending' | 'failed', plan: 'pro'): void {
    const transactions = this.getData<Transaction>(STORAGE_KEYS.TRANSACTIONS);
    transactions.unshift({
      id: generateId(),
      userId,
      amount,
      status,
      plan,
      createdAt: new Date().toISOString()
    });
    this.setData(STORAGE_KEYS.TRANSACTIONS, transactions);
  }

  // Affiliate
  getAffiliateData(userId: string): AffiliateData {
    const allAffiliate = this.getData<Record<string, AffiliateData>>(STORAGE_KEYS.AFFILIATE)[0] || {};
    return allAffiliate[userId] || {
      referralCode: `BV-${userId.substring(0, 5).toUpperCase()}`,
      referrals: 0,
      totalCommission: 0,
      pendingCommission: 0
    };
  }

  private createAffiliateData(userId: string): void {
    const allData = this.getData<Record<string, AffiliateData>>(STORAGE_KEYS.AFFILIATE);
    const current = allData[0] || {};
    current[userId] = {
      referralCode: `BV-${userId.substring(0, 5).toUpperCase()}`,
      referrals: 0,
      totalCommission: 0,
      pendingCommission: 0
    };
    this.setData(STORAGE_KEYS.AFFILIATE, [current]);
  }

  // Notifications
  getNotifications(userId: string): Notification[] {
    return this.getData<Notification>(STORAGE_KEYS.NOTIFICATIONS).filter(n => n.userId === userId);
  }

  createNotification(userId: string, title: string, message: string, type: Notification['type']): void {
    const notifications = this.getData<Notification>(STORAGE_KEYS.NOTIFICATIONS);
    notifications.unshift({
      id: generateId(),
      userId,
      title,
      message,
      type,
      read: false,
      createdAt: new Date().toISOString()
    });
    this.setData(STORAGE_KEYS.NOTIFICATIONS, notifications);
  }

  markNotificationRead(id: string): void {
    const notifications = this.getData<Notification>(STORAGE_KEYS.NOTIFICATIONS);
    const index = notifications.findIndex(n => n.id === id);
    if (index !== -1) {
      notifications[index].read = true;
      this.setData(STORAGE_KEYS.NOTIFICATIONS, notifications);
    }
  }

  // Activity Logs
  getActivityLogs(userId: string): ActivityLog[] {
    return this.getData<ActivityLog>(STORAGE_KEYS.ACTIVITY_LOGS).filter(l => l.userId === userId);
  }

  private logActivity(userId: string, action: string, details: string): void {
    const logs = this.getData<ActivityLog>(STORAGE_KEYS.ACTIVITY_LOGS);
    logs.unshift({
      id: generateId(),
      userId,
      action,
      details,
      createdAt: new Date().toISOString()
    });
    this.setData(STORAGE_KEYS.ACTIVITY_LOGS, logs.slice(0, 100)); // Keep last 100
  }

  // Seed Data
  seedData(): void {
    const existingUsers = this.getData<User>(STORAGE_KEYS.USERS);
    
    // 1. Users seeding
    const admin: User = {
      id: 'admin-1',
      name: 'BellCorp Admin',
      email: 'bellcorpadm@gmail.com',
      role: 'admin',
      subscription: 'pro',
      createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=admin'
    };

    const user: User = {
      id: 'user-1',
      name: 'John Doe',
      email: 'user@example.com',
      role: 'user',
      subscription: 'pro',
      createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=user'
    };

    const demo: User = {
      id: 'demo-user',
      name: 'Demo Account',
      email: 'demo@brandvision.ai',
      role: 'user',
      subscription: 'pro',
      createdAt: new Date().toISOString(),
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=demo'
    };

    const affiliator: User = {
      id: 'aff-1',
      name: 'Jane Smith',
      email: 'affiliate@example.com',
      role: 'affiliator',
      subscription: 'free',
      createdAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=affiliate'
    };

    // If we're merging, avoid duplicates
    const usersToSeed = [admin, user, demo, affiliator];
    const finalUsers = [...existingUsers];
    
    let userSeeded = false;
    usersToSeed.forEach(u => {
      if (!finalUsers.some(existing => existing.email === u.email)) {
        finalUsers.push(u);
        userSeeded = true;
      }
    });

    if (userSeeded || existingUsers.length === 0) {
      this.setData(STORAGE_KEYS.USERS, finalUsers);
    }

    // 2. Sample History seeding (ensure there are 5 more items, total at least 6 for demo-user)
    const currentHistory = this.getData<HistoryItem>(STORAGE_KEYS.HISTORY);
    const demoHistoryItems = currentHistory.filter(h => h.userId === 'demo-user');
    
    if (demoHistoryItems.length < 6) {
      const demoSampleHistory: HistoryItem[] = [
        {
          id: 'demo-h1',
          userId: 'demo-user',
          inputText: "I am a creative director with a passion for minimalistic design and brand storytelling.",
          result: {
            expertiseAreas: ["Creative Direction", "Minimalist Design", "Brand Storytelling", "Visual Identity"],
            summary: "A visionary creative leader focused on crafting impactful narratives through elegant and intentional design."
          },
          createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString()
        },
        {
          id: 'demo-h2',
          userId: 'demo-user',
          inputText: "I am a senior user experience researcher with a backend background in psychological behaviors, specializing in wireframing, high-ticket SaaS usability testing and heuristics analysis.",
          result: {
            expertiseAreas: ["UX Research", "Usability Testing", "Heuristics Analysis", "SaaS Interface Design"],
            summary: "A dedicated design researcher merging behavioral science with intuitive enterprise architecture."
          },
          createdAt: new Date(Date.now() - 1 * 24 * 65 * 60 * 1000).toISOString()
        },
        {
          id: 'demo-h3',
          userId: 'demo-user',
          inputText: "Cloud infrastructure engineer focusing on Kubernetes, AWS, continuous integration pipelines, and high-availability database replication structures.",
          result: {
            expertiseAreas: ["DevOps", "Cloud Infrastructure", "Kubernetes Orchestration", "CI/CD Automations"],
            summary: "A system resilience expert designing elastic cloud configurations and zero-downtime microservice environments."
          },
          createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          id: 'demo-h4',
          userId: 'demo-user',
          inputText: "Growth marketing specialist and digital copywriting lead with rich experience running automated email CRM setups, customer funnel optimization, and high-impact SEO.",
          result: {
            expertiseAreas: ["Growth Marketing", "Copywriting", "Funnel Optimization", "CRM Automation"],
            summary: "A persuasive brand marketer engineering data-driven acquisition tunnels and highly compelling messaging."
          },
          createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          id: 'demo-h5',
          userId: 'demo-user',
          inputText: "Project manager and agile scrum master skilled in coordinating remote engineering pods, strategic sprint trackers, and high-risk regulatory blockers.",
          result: {
            expertiseAreas: ["Agile Project Management", "Scrum Methodologies", "Cross-Functional Leadership", "Risk Mitigation"],
            summary: "A proactive delivery leader streamlining intricate software pipelines and cultivating collaborative agility."
          },
          createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          id: 'demo-h6',
          userId: 'demo-user',
          inputText: "Artificial intelligence researcher specialized in fine-tuning, retrieval-augmented generation architectures, and vector database structures for complex enterprise query setups.",
          result: {
            expertiseAreas: ["AI Research", "RAG Systems", "Large Language Models", "Vector Databases"],
            summary: "An advanced machine learning specialist crafting production-ready cognitive search platforms and custom LLM embeddings."
          },
          createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
        }
      ];

      const updatedHistory = [...currentHistory];
      demoSampleHistory.forEach(newItem => {
        if (!updatedHistory.some(existing => existing.id === newItem.id || (existing.userId === newItem.userId && existing.inputText === newItem.inputText))) {
          updatedHistory.unshift(newItem);
        }
      });
      this.setData(STORAGE_KEYS.HISTORY, updatedHistory);
    }

    // Ensure user-1 (John Doe) history exists as well
    const johnHistoryItems = this.getData<HistoryItem>(STORAGE_KEYS.HISTORY).filter(h => h.userId === 'user-1');
    if (johnHistoryItems.length === 0) {
      const johnSampleHistory: HistoryItem[] = [
        {
          id: 'john-h1',
          userId: 'user-1',
          inputText: "I am a senior software engineer with 10 years of experience in React, Node.js, and Cloud Architecture. I love building scalable systems and mentoring junior developers.",
          result: {
            expertiseAreas: ["Full-Stack Development", "Cloud Architecture", "Technical Leadership", "System Scalability"],
            summary: "A seasoned technical leader specialized in building high-performance web ecosystems and fostering engineering excellence."
          },
          createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          id: 'john-h2',
          userId: 'user-1',
          inputText: "Digital marketing specialist focused on SEO, SEM, and content strategy for SaaS startups. Helping brands grow their organic traffic by 300% year-over-year.",
          result: {
            expertiseAreas: ["SEO/SEM Strategy", "Content Marketing", "SaaS Growth", "Performance Analytics"],
            summary: "A growth-oriented marketer dedicated to scaling SaaS visibility through data-driven content and search optimization."
          },
          createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
        }
      ];
      const updatedHistory = this.getData<HistoryItem>(STORAGE_KEYS.HISTORY);
      johnSampleHistory.forEach(newItem => {
        if (!updatedHistory.some(existing => existing.id === newItem.id)) {
          updatedHistory.push(newItem);
        }
      });
      this.setData(STORAGE_KEYS.HISTORY, updatedHistory);
    }

    // 3. Transactions
    if (this.getData(STORAGE_KEYS.TRANSACTIONS).length === 0) {
      this.createTransaction('user-1', 29.99, 'success', 'pro');
      this.createTransaction('admin-1', 0, 'success', 'pro');
    }

    // 4. Affiliate Data - Ensure demo-user has 3 referrals
    const affiliateRecords = this.getData<Record<string, AffiliateData>>(STORAGE_KEYS.AFFILIATE);
    const affiliateMap = affiliateRecords[0] || {};
    
    let needsAffUpdate = false;
    if (!affiliateMap['demo-user'] || affiliateMap['demo-user'].referrals < 3) {
      affiliateMap['demo-user'] = {
        referralCode: 'BV-DEMO',
        referrals: 3,
        totalCommission: 45.0,
        pendingCommission: 45.0
      };
      needsAffUpdate = true;
    }
    if (!affiliateMap['user-1']) {
      affiliateMap['user-1'] = { referralCode: 'BV-JOHN1', referrals: 3, totalCommission: 45, pendingCommission: 15 };
      needsAffUpdate = true;
    }
    if (!affiliateMap['aff-1']) {
      affiliateMap['aff-1'] = { referralCode: 'BV-JANE2', referrals: 12, totalCommission: 180, pendingCommission: 60 };
      needsAffUpdate = true;
    }
    if (!affiliateMap['admin-1']) {
      affiliateMap['admin-1'] = { referralCode: 'BV-ADMIN', referrals: 0, totalCommission: 0, pendingCommission: 0 };
      needsAffUpdate = true;
    }

    if (needsAffUpdate || affiliateRecords.length === 0) {
      this.setData(STORAGE_KEYS.AFFILIATE, [affiliateMap]);
    }

    // 5. Notifications
    const currentNotifications = this.getData<Notification>(STORAGE_KEYS.NOTIFICATIONS);
    if (currentNotifications.length === 0) {
      this.createNotification('user-1', "Subscription Active", "Your Pro subscription is active until next month.", "success");
      this.createNotification('user-1', "New Referral", "Someone just used your referral code! You earned $15.", "info");
      this.createNotification('demo-user', "Welcome to Demo!", "Your account has been loaded with demo state analytics.", "success");
    }

    // 6. Activity Logs
    if (this.getData(STORAGE_KEYS.ACTIVITY_LOGS).length === 0) {
      this.logActivity('user-1', "Login", "User logged in");
      this.logActivity('user-1', "Export", "Exported brand profile to PDF");
      this.logActivity('demo-user', "Database Setup", "Loaded 6 history records and 3 custom referrals statistics successfully");
    }
  }
}

export const mockBackend = new MockBackend();
