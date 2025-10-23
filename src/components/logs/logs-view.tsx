"use client";

import React, { useState, useMemo } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Download, Search, X } from "lucide-react";
import { mockLogs } from "@/lib/data";
import { formatDistanceToNow } from 'date-fns';

export function LogsView() {
  const [filter, setFilter] = useState('');

  const filteredLogs = useMemo(() => {
    if (!filter) return mockLogs;
    return mockLogs.filter(log =>
      log.action.toLowerCase().includes(filter.toLowerCase()) ||
      log.user.toLowerCase().includes(filter.toLowerCase()) ||
      log.target.toLowerCase().includes(filter.toLowerCase()) ||
      log.details.toLowerCase().includes(filter.toLowerCase())
    );
  }, [filter]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Activity Log</CardTitle>
        <CardDescription>A detailed record of all actions performed in the application.</CardDescription>
        <div className="flex items-center justify-between pt-4">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search logs..."
              className="pl-9"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            />
            {filter && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-1 top-0.5 h-8 w-8"
                onClick={() => setFilter('')}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export CSV
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Timestamp</TableHead>
                <TableHead>User</TableHead>
                <TableHead>Action</TableHead>
                <TableHead>Target</TableHead>
                <TableHead className="hidden md:table-cell">Details</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLogs.map((log) => (
                <TableRow key={log.id}>
                  <TableCell>
                    <div className="flex flex-col">
                        <span className="font-medium">{formatDistanceToNow(new Date(log.timestamp), { addSuffix: true })}</span>
                        <span className="text-xs text-muted-foreground">{new Date(log.timestamp).toLocaleString()}</span>
                    </div>
                  </TableCell>
                  <TableCell>{log.user}</TableCell>
                  <TableCell>
                    <span className="font-medium">{log.action}</span>
                  </TableCell>
                  <TableCell>{log.target}</TableCell>
                  <TableCell className="hidden md:table-cell">{log.details}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        {filteredLogs.length === 0 && (
            <div className="text-center py-16 text-muted-foreground">
                <p>No logs match your search.</p>
            </div>
        )}
      </CardContent>
    </Card>
  );
}
