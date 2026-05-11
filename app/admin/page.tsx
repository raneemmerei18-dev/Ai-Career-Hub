"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Users,
  FileText,
  Zap,
  TrendingUp,
  TrendingDown,
  Activity,
  DollarSign,
  Clock,
  CheckCircle,
  AlertTriangle,
  ArrowUpRight,
  ArrowDownRight,
  MoreHorizontal,
} from 'lucide-react'

const stats = [
  {
    title: 'Total Users',
    value: '12,847',
    change: '+12.5%',
    trend: 'up',
    icon: Users,
    description: 'Active accounts',
  },
  {
    title: 'Resumes Created',
    value: '34,291',
    change: '+8.2%',
    trend: 'up',
    icon: FileText,
    description: 'This month',
  },
  {
    title: 'AI Requests',
    value: '1.2M',
    change: '+23.1%',
    trend: 'up',
    icon: Zap,
    description: 'API calls this month',
  },
  {
    title: 'Revenue',
    value: '$48,352',
    change: '+18.7%',
    trend: 'up',
    icon: DollarSign,
    description: 'Monthly recurring',
  },
]

const recentActivity = [
  { user: 'john.doe@email.com', action: 'Upgraded to Pro', time: '2 min ago', type: 'upgrade' },
  { user: 'jane.smith@email.com', action: 'Created resume', time: '5 min ago', type: 'action' },
  { user: 'mike.wilson@email.com', action: 'Completed interview', time: '12 min ago', type: 'action' },
  { user: 'sarah.jones@email.com', action: 'Registered account', time: '15 min ago', type: 'signup' },
  { user: 'alex.brown@email.com', action: 'Reported issue', time: '23 min ago', type: 'support' },
]

const systemHealth = [
  { service: 'API Server', status: 'healthy', uptime: '99.99%', latency: '45ms' },
  { service: 'Database', status: 'healthy', uptime: '99.95%', latency: '12ms' },
  { service: 'AI Service', status: 'healthy', uptime: '99.87%', latency: '230ms' },
  { service: 'Storage', status: 'warning', uptime: '99.90%', latency: '85ms' },
  { service: 'Email Service', status: 'healthy', uptime: '99.98%', latency: '120ms' },
]

export default function AdminDashboardPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Dashboard Overview</h1>
          <p className="text-muted-foreground">
            Welcome back, Admin. Here&apos;s what&apos;s happening today.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline">Export Report</Button>
          <Button>View Analytics</Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <div className="flex items-center gap-1 text-xs">
                {stat.trend === 'up' ? (
                  <ArrowUpRight className="h-3 w-3 text-green-500" />
                ) : (
                  <ArrowDownRight className="h-3 w-3 text-red-500" />
                )}
                <span className={stat.trend === 'up' ? 'text-green-500' : 'text-red-500'}>
                  {stat.change}
                </span>
                <span className="text-muted-foreground">from last month</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* User Growth Chart Placeholder */}
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>User Growth</CardTitle>
            <CardDescription>New user registrations over time</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] flex items-center justify-center bg-muted/50 rounded-lg">
              <p className="text-muted-foreground">Chart visualization</p>
            </div>
          </CardContent>
        </Card>

        {/* AI Usage Chart Placeholder */}
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>AI Usage</CardTitle>
            <CardDescription>API requests by feature</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] flex items-center justify-center bg-muted/50 rounded-lg">
              <p className="text-muted-foreground">Chart visualization</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Recent Activity */}
        <Card className="col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Recent Activity</CardTitle>
              <Button variant="ghost" size="sm">View all</Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
                      {activity.type === 'upgrade' && <TrendingUp className="h-4 w-4 text-green-500" />}
                      {activity.type === 'action' && <Activity className="h-4 w-4 text-blue-500" />}
                      {activity.type === 'signup' && <Users className="h-4 w-4 text-purple-500" />}
                      {activity.type === 'support' && <AlertTriangle className="h-4 w-4 text-yellow-500" />}
                    </div>
                    <div>
                      <p className="text-sm font-medium">{activity.user}</p>
                      <p className="text-xs text-muted-foreground">{activity.action}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">{activity.time}</span>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* System Health */}
        <Card>
          <CardHeader>
            <CardTitle>System Health</CardTitle>
            <CardDescription>Service status overview</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {systemHealth.map((service) => (
                <div key={service.service} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{service.service}</span>
                    <Badge
                      variant={service.status === 'healthy' ? 'default' : 'secondary'}
                      className={
                        service.status === 'healthy'
                          ? 'bg-green-100 text-green-700 hover:bg-green-100'
                          : 'bg-yellow-100 text-yellow-700 hover:bg-yellow-100'
                      }
                    >
                      {service.status === 'healthy' ? (
                        <CheckCircle className="h-3 w-3 mr-1" />
                      ) : (
                        <AlertTriangle className="h-3 w-3 mr-1" />
                      )}
                      {service.status}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>Uptime: {service.uptime}</span>
                    <span>Latency: {service.latency}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            <Button variant="outline">
              <Users className="h-4 w-4 mr-2" />
              Manage Users
            </Button>
            <Button variant="outline">
              <FileText className="h-4 w-4 mr-2" />
              View Reports
            </Button>
            <Button variant="outline">
              <Zap className="h-4 w-4 mr-2" />
              AI Settings
            </Button>
            <Button variant="outline">
              <DollarSign className="h-4 w-4 mr-2" />
              Billing
            </Button>
            <Button variant="outline">
              <Activity className="h-4 w-4 mr-2" />
              System Logs
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
