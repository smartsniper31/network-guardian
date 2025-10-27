
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
  name: z.string().min(1, "Le nom de l'appareil est requis"),
  ip: z.string().ip({ message: "Adresse IP invalide" }),
  mac: z.string().regex(/^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$/, "Adresse MAC invalide"),
  type: z.enum(['Laptop', 'Smartphone', 'Tablet', 'IoT', 'Camera', 'TV', 'Router', 'Unknown']),
});

type AddDeviceFormValues = z.infer<typeof formSchema>;

interface AddDeviceDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (device: Omit<Device, 'id'>) => void;
  isRouterSetup?: boolean;
}

export function AddDeviceDialog({ isOpen, onOpenChange, onSave, isRouterSetup = false }: AddDeviceDialogProps) {
  const form = useForm<AddDeviceFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: isRouterSetup ? "Routeur Principal" : "",
      ip: isRouterSetup ? "192.168.1.1" : "",
      mac: "",
      type: isRouterSetup ? "Router" : "Unknown",
    },
  });

  const onSubmit = (values: AddDeviceFormValues) => {
    const newDevice: Omit<Device, 'id'> = {
      ...values,
      type: isRouterSetup ? 'Router' : values.type,
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
  
  const title = isRouterSetup ? "Ajouter votre routeur principal" : "Ajouter un nouvel appareil";
  const description = isRouterSetup 
    ? "Enregistrez votre routeur pour permettre à l'application de scanner votre réseau."
    : "Ajoutez manuellement un appareil à votre réseau pour le surveiller et le gérer.";


  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            {description}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nom de l'appareil</FormLabel>
                  <FormControl>
                    <Input placeholder="ex: TV du salon" {...field} />
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
                    <FormLabel>Adresse IP</FormLabel>
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
                    <FormLabel>Adresse MAC</FormLabel>
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
                  <FormLabel>Type d'appareil</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isRouterSetup}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionnez un type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {['Laptop', 'Smartphone', 'Tablet', 'IoT', 'Camera', 'TV', 'Router', 'Unknown'].map(type => (
                        <SelectItem key={type} value={type} disabled={isRouterSetup && type !== 'Router'}>{type}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>
                Annuler
              </Button>
              <Button type="submit">Ajouter l'appareil</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
