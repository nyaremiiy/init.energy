# Local lead storage

Validated form submissions are appended to `leads.jsonl` by the server action.
The data file is ignored by Git because it contains personal data.

This is temporary storage for a persistent Node.js server. Replace it with the
CRM integration before deploying to a serverless or read-only filesystem.

Set `LEAD_STORAGE_FILE` to use a different writable path in a deployed Node.js
environment.
