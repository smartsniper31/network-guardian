export type Device = {
  id: string;
  ip: string;
  mac: string;
  name: string;
  type: 'Laptop' | 'Smartphone' | 'Tablet' | 'IoT' | 'Camera' | 'TV' | 'Router' | 'Unknown';
  status: 'Online' | 'Offline' | 'Blocked' | 'Paused';
  bandwidthUsage: number;
  dataUsage: {
    download: number;
    upload: number;
  };
  lastSeen: string;
  openPorts: number[];
  dns: string;
  dhcp: boolean;
  firewallRules: string[];
};

export type LogEntry = {
  id: string;
  timestamp: string;
  user: string;
  action: string;
  details: string;
  target: string;
};

export type User = {
  id: string;
  name: string;
  avatar: string;
  role: 'Admin' | 'User';
};
