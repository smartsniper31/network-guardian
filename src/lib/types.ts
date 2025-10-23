
import { z } from 'zod';

export const DeviceSchema = z.object({
  id: z.string(),
  ip: z.string(),
  mac: z.string(),
  name: z.string(),
  type: z.enum(['Laptop', 'Smartphone', 'Tablet', 'IoT', 'Camera', 'TV', 'Router', 'Unknown']),
  status: z.enum(['Online', 'Offline', 'Blocked', 'Paused']),
  bandwidthUsage: z.number(),
  dataUsage: z.object({
    download: z.number(),
    upload: z.number(),
  }),
  lastSeen: z.string(),
  openPorts: z.array(z.number()),
  dns: z.string(),
  dhcp: z.boolean(),
  firewallRules: z.array(z.string()),
  blockedCategories: z.array(z.string()).optional(),
});
export type Device = z.infer<typeof DeviceSchema>;

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

// AI Flow Schemas and Types

// analyze-device-vulnerabilities
export const AnalyzeDeviceVulnerabilitiesInputSchema = DeviceSchema;
export type AnalyzeDeviceVulnerabilitiesInput = z.infer<typeof AnalyzeDeviceVulnerabilitiesInputSchema>;

export const AnalyzeDeviceVulnerabilitiesOutputSchema = z.object({
  analysisSummary: z.string().describe("A brief, one-sentence summary of the device's security posture."),
  vulnerabilities: z.array(z.object({
    severity: z.enum(['low', 'medium', 'high', 'critical']).describe('The severity of the vulnerability.'),
    description: z.string().describe('A detailed description of the vulnerability found.'),
    recommendation: z.string().describe('The recommended action to mitigate the vulnerability.'),
  })).describe('A list of identified vulnerabilities and recommendations.'),
});
export type AnalyzeDeviceVulnerabilitiesOutput = z.infer<typeof AnalyzeDeviceVulnerabilitiesOutputSchema>;


// detect-anomalous-network-activity
export const DetectAnomalousNetworkActivityInputSchema = z.object({
  networkData: z.string().describe('Network activity data in JSON format.'),
});
export type DetectAnomalousNetworkActivityInput = z.infer<typeof DetectAnomalousNetworkActivityInputSchema>;

export const AnomalyAlertSchema = z.object({
  deviceId: z.string().describe('The ID of the device with anomalous activity.'),
  anomalyType: z
    .string()
    .describe('The type of anomaly detected (e.g., excessive bandwidth usage, unauthorized connection).'),
  severity: z.enum(['low', 'medium', 'high']).describe('The severity of the anomaly.'),
  timestamp: z.string().describe('The timestamp of when the anomaly was detected.'),
  details: z.string().describe('Additional details about the anomaly.'),
});

export const DetectAnomalousNetworkActivityOutputSchema = z.object({
  alerts: z.array(AnomalyAlertSchema).describe('A list of anomaly alerts.'),
});
export type DetectAnomalousNetworkActivityOutput = z.infer<typeof DetectAnomalousNetworkActivityOutputSchema>;


// filter-content
export const FilterContentInputSchema = z.object({
  deviceId: z.string().describe('The ID of the device to apply filters to.'),
  categories: z.array(z.string()).describe('A list of content categories to block (e.g., "Social Media", "Gaming", "Adult Content").'),
});
export type FilterContentInput = z.infer<typeof FilterContentInputSchema>;

export const FilterContentOutputSchema = z.object({
  success: z.boolean().describe('Whether the filtering rules were applied successfully.'),
  message: z.string().describe('A confirmation message.'),
});
export type FilterContentOutput = z.infer<typeof FilterContentOutputSchema>;


// generate-weekly-report
export const GenerateWeeklyReportInputSchema = z.object({
  devices: z.array(DeviceSchema).describe("The list of all devices on the network."),
  logs: z.array(z.object({
    action: z.string(),
    target: z.string(),
    timestamp: z.string(),
    details: z.string(),
  })).describe("A list of activity and security logs from the past week."),
});
export type GenerateWeeklyReportInput = z.infer<typeof GenerateWeeklyReportInputSchema>;

export const GenerateWeeklyReportOutputSchema = z.object({
  overallSummary: z.string().describe("A brief, two-sentence overview of the week's network activity and security posture."),
  screenTimeAnalysis: z.array(z.object({
    deviceName: z.string().describe("The name of the device."),
    deviceId: z.string().describe("The ID of the device."),
    usageHours: z.number().describe("Estimated total hours of active usage for the week."),
  })).describe("An analysis of screen time for the top 3-5 most active devices."),
  threatsSummary: z.object({
    totalThreats: z.number().describe("Total number of threats detected during the week."),
    threats: z.array(z.object({
        details: z.string().describe("Description of a significant threat that was detected."),
        recommendation: z.string().describe("Recommendation to handle this type of threat."),
    })).describe("A list of the most significant threats found."),
  }).describe("A summary of security threats detected."),
  recommendations: z.array(z.object({
    title: z.string().describe("The title of the recommendation."),
    description: z.string().describe("A detailed description of the recommendation for improving security or digital well-being."),
    severity: z.enum(['low', 'medium', 'high']).describe("The importance of the recommendation."),
  })).describe("Actionable recommendations for the user."),
});
export type GenerateWeeklyReportOutput = z.infer<typeof GenerateWeeklyReportOutputSchema>;


// suggest-compromised-devices
export const SuggestCompromisedDevicesInputSchema = z.object({
  deviceData: z
    .array(z.object({
      ip: z.string().describe('The IP address of the device.'),
      mac: z.string().describe('The MAC address of the device.'),
      deviceName: z.string().describe('The name of the device.'),
      deviceType: z.string().describe('The type of the device.'),
      bandwidthUsage: z.number().describe('The current bandwidth usage of the device in Mbps.'),
      openPorts: z.array(z.number()).describe('A list of open ports on the device.'),
    }))
    .describe('A list of devices connected to the network and their data.'),
  threatIntelligenceFeeds: z
    .array(z.string())
    .describe('Real-time threat intelligence feeds.'),
  sensitivity: z.enum(['normal', 'high', 'paranoid']).describe('The sensitivity level for the analysis. "Paranoid" will flag even minor deviations.'),
});
export type SuggestCompromisedDevicesInput = z.infer<
  typeof SuggestCompromisedDevicesInputSchema
>;

export const SuggestCompromisedDevicesOutputSchema = z.object({
  compromisedDevices: z
    .array(z.object({
      ip: z.string().describe('The IP address of the compromised device.'),
      reason: z.string().describe('The reason why the device is suspected to be compromised.'),
    }))
    .describe('A list of potentially compromised devices and the reasons for suspicion.'),
});
export type SuggestCompomisedDevicesOutput = z.infer<
  typeof SuggestCompromisedDevicesOutputSchema
>;
