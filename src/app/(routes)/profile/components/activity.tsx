// components/admin/profile/ActivityLog.tsx
"use client";
import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";
import { listSessions } from "@/lib/auth-client";

export function ActivityLog({ userId }: { userId: string }) {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchActivities = async () => {
      let res: any = await listSessions();

      setActivities(res?.data || []);
      setLoading(false);
    };
    fetchActivities();
  }, [userId]);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Event</TableHead>
              <TableHead>IP Address</TableHead>
              <TableHead>Device</TableHead>
              <TableHead>Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {activities.map((activity: any) => (
              <TableRow key={activity.id}>
                <TableCell className="font-medium">
                  {activity.event || "Signin"}
                </TableCell>
                <TableCell>{activity.ipAddress || "Unknown"}</TableCell>
                <TableCell>
                  <p className="w-[400px] line-clamp-2">{activity.userAgent}</p>
                </TableCell>
                <TableCell>
                  {format(new Date(activity.createdAt), "PPpp")}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
