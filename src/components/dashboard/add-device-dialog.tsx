"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Device } from "@/lib/types";

const formSchema = z.object({
  name: z.string().min(1, "Device name is required"),
  ip: z.string().ip({ message: "Invalid IP address" }),
  mac: z.string().regex(/^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$/, "Invalid MAC address"),
  type: z.enum(['Laptop', 'Smartphone', 'Tablet', 'IoT', 'Camera', 'TV', 'Router', 'Unknown']),
});

type AddDeviceFormValues = z.infer<typeof formSchema>;

interface AddDeviceDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (device: Omit<Device, 'id'>) => void;
}

export function AddDeviceDialog({ isOpen, onOpenChange, onSave }: AddDeviceDialogProps) {
  const form = useForm<AddDeviceFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      ip: "",
      mac: "",
      type: "Unknown",
    },
  });

  const onSubmit = (values: AddDeviceFormValues) => {
    const newDevice: Omit<Device, 'id'> = {
      ...values,
      status: 'Online',
      bandwidthUsage: 0,
      dataUsage: { download: 0, upload: 0 },
      lastSeen: new Date().toISOString(),
      openPorts: [],
      dns: '8.8.8.8',
      dhcp: true,
      firewallRules: [],
      blockedCategories: [],
    };
    onSave(newDevice);
    onOpenChange(false);
    form.reset();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add a New Device</DialogTitle>
          <DialogDescription>
            Manually add a device to your network for monitoring and management.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Device Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Living Room TV" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="ip"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>IP Address</FormLabel>
                    <FormControl>
                      <Input placeholder="192.168.1.100" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="mac"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>MAC Address</FormLabel>
                    <FormControl>
                      <Input placeholder="A8:DB:03:CE:9B:A1" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Device Type</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a device type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {['Laptop', 'Smartphone', 'Tablet', 'IoT', 'Camera', 'TV', 'Router', 'Unknown'].map(type => (
                        <SelectItem key={type} value={type}>{type}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit">Add Device</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
