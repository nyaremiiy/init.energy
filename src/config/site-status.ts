/**
 * Global availability switch. The server's `./maintenance.sh` toggles it,
 * rebuilds the application and restarts the service.
 */
export const maintenance = {
  enabled: false,
} as const;
