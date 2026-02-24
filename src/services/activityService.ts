import { mockActivities } from '@/data/activities';
import { ActivityItem } from '@/components/ui/ActivityFeed';

export const activityService = {
          async list(): Promise<ActivityItem[]> {
                    return [...mockActivities].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
          },

          async getByUser(userName: string): Promise<ActivityItem[]> {
                    return mockActivities
                              .filter(a => a.userName === userName)
                              .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
          },

          async getByRole(role: 'student' | 'teacher' | 'admin'): Promise<ActivityItem[]> {
                    return mockActivities
                              .filter(a => a.userRole === role)
                              .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
          },

          async getRecent(limit: number = 5): Promise<ActivityItem[]> {
                    return [...mockActivities]
                              .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
                              .slice(0, limit);
          },
};
