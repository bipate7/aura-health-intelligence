
import { HealthLog, Insight, User, ReadinessScore, AIMemoryNode } from '../types';

const LOGS_KEY = 'aura_health_logs';
const INSIGHTS_KEY = 'aura_health_insights';
const USERS_KEY = 'aura_users';
const MEMORY_KEY = 'aura_ai_memory';

export const StorageService = {
  getMemory: (userId: string): AIMemoryNode[] => {
    try {
        const all = JSON.parse(localStorage.getItem(MEMORY_KEY) || '[]');
        return all.filter((m: AIMemoryNode) => m.userId === userId);
    } catch { return []; }
  },

  addMemoryNode: (node: Omit<AIMemoryNode, 'id'>): AIMemoryNode => {
      const all = JSON.parse(localStorage.getItem(MEMORY_KEY) || '[]');
      const newNode = { ...node, id: crypto.randomUUID() };
      localStorage.setItem(MEMORY_KEY, JSON.stringify([...all, newNode]));
      return newNode;
  },

  clearAllData: (userId: string) => {
      const logs = JSON.parse(localStorage.getItem(LOGS_KEY) || '[]').filter((l: any) => l.userId !== userId);
      const memories = JSON.parse(localStorage.getItem(MEMORY_KEY) || '[]').filter((m: any) => m.userId !== userId);
      const insights = JSON.parse(localStorage.getItem(INSIGHTS_KEY) || '[]').filter((i: any) => i.userId !== userId);
      localStorage.setItem(LOGS_KEY, JSON.stringify(logs));
      localStorage.setItem(MEMORY_KEY, JSON.stringify(memories));
      localStorage.setItem(INSIGHTS_KEY, JSON.stringify(insights));
  },

  getUsers: (): User[] => JSON.parse(localStorage.getItem(USERS_KEY) || '[]'),
  
  createUser: (name: string, email: string): User => {
    const users = StorageService.getUsers();
    const newUser: User = { id: crypto.randomUUID(), name, email, joinedDate: new Date().toISOString(), chronotype: 'Unknown' };
    localStorage.setItem(USERS_KEY, JSON.stringify([...users, newUser]));
    return newUser;
  },

  loginUser: (email: string): User | null => StorageService.getUsers().find(u => u.email === email) || null,

  getLogs: (userId: string): HealthLog[] => {
    const allLogs = JSON.parse(localStorage.getItem(LOGS_KEY) || '[]');
    return allLogs.filter((log: HealthLog) => log.userId === userId);
  },

  addLog: (log: Omit<HealthLog, 'id'>): HealthLog => {
    const allLogs = JSON.parse(localStorage.getItem(LOGS_KEY) || '[]');
    const newLog = { ...log, id: crypto.randomUUID() };
    localStorage.setItem(LOGS_KEY, JSON.stringify([...allLogs, newLog]));
    return newLog;
  },

  saveInsight: (insight: Omit<Insight, 'id' | 'dateGenerated'>): Insight => {
    const all = JSON.parse(localStorage.getItem(INSIGHTS_KEY) || '[]');
    const newI = { 
        ...insight, 
        id: crypto.randomUUID(), 
        dateGenerated: new Date().toISOString() 
    } as Insight;
    localStorage.setItem(INSIGHTS_KEY, JSON.stringify([newI, ...all]));
    return newI;
  },
};
