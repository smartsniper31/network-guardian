"use client";

import React, { useState, useMemo, useEffect } from 'react';
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
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import { getLogs } from '@/lib/services/network-service';
import { LogEntry } from '@/lib/types';
import { Skeleton } from '../ui/skeleton';

export function LogsView() {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      const data = await getLogs();
      setLogs(data);
      setIsLoading(false);
    }
    fetchData();
  }, []);

  const filteredLogs = useMemo(() => {
    if (!filter) return logs;
    return logs.filter(log =>
      log.action.toLowerCase().includes(filter.toLowerCase()) ||
      log.user.toLowerCase().includes(filter.toLowerCase()) ||
      log.target.toLowerCase().includes(filter.toLowerCase()) ||
      log.details.toLowerCase().includes(filter.toLowerCase())
    );
  }, [filter, logs]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Journal d'activité</CardTitle>
        <CardDescription>Un enregistrement détaillé de toutes les actions effectuées dans l'application.</CardDescription>
        <div className="flex items-center justify-between pt-4">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Rechercher dans les journaux..."
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
            Exporter en CSV
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Horodatage</TableHead>
                <TableHead>Utilisateur</TableHead>
                <TableHead>Action</TableHead>
                <TableHead>Cible</TableHead>
                <TableHead className="hidden md:table-cell">Détails</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                [...Array(5)].map((_, i) => (
                  <TableRow key={i}>
                    <TableCell><Skeleton className="h-6 w-28" /></TableCell>
                    <TableCell><Skeleton className="h-6 w-24" /></TableCell>
                    <TableCell><Skeleton className="h-6 w-24" /></TableCell>
                    <TableCell><Skeleton className="h-6 w-32" /></TableCell>
                    <TableCell className="hidden md:table-cell"><Skeleton className="h-6 w-full" /></TableCell>
                  </TableRow>
                ))
              ) : (
                filteredLogs.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell>
                      <div className="flex flex-col">
                          <span className="font-medium">{formatDistanceToNow(new Date(log.timestamp), { addSuffix: true, locale: fr })}</span>
                          <span className="text-xs text-muted-foreground">{new Date(log.timestamp).toLocaleString('fr-FR')}</span>
                      </div>
                    </TableCell>
                    <TableCell>{log.user}</TableCell>
                    <TableCell>
                      <span className="font-medium">{log.action}</span>
                    </TableCell>
                    <TableCell>{log.target}</TableCell>
                    <TableCell className="hidden md:table-cell">{log.details}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
        {!isLoading && filteredLogs.length === 0 && (
            <div className="text-center py-16 text-muted-foreground">
                <p>Aucun journal ne correspond à votre recherche.</p>
            </div>
        )}
      </CardContent>
    </Card>
  );
}
