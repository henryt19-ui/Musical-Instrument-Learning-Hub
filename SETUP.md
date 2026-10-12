# Working with this GitHub repository

Repository: https://github.com/henryt19-ui/Musical-Instrument-Learning-Hub

This **private** repository contains a technical documentation/architecture starter for Team 3's Musical Instrument Learning Hub, based on the confidential October 2026 draft. No running application has been deployed.

## Clone
```bash
git clone https://github.com/henryt19-ui/Musical-Instrument-Learning-Hub.git
cd Musical-Instrument-Learning-Hub
```

## Team collaboration
1. Add team members with the appropriate GitHub repository permissions (**Settings → Collaborators**).
2. Create a separate branch for each task (`docs/...`, `feature/...`, `fix/...`).
3. Review source-backed requirements and unresolved decisions under `docs/`.
4. Open pull requests and link issues; review changes before merging into `main`.
5. Verify the documentation-check GitHub Action after changes.

## Before implementation
- Resolve the [open architectural questions](docs/open-questions.md) with Team 3.
- Confirm Figma screens against the source design. The linked Figma frames were not imported during the preparation of this starter.
- Agree on technology/runtime versions, API contracts, microservice boundaries, and test approach.
- This repo currently has **documentation and planning placeholders only**, not a running React app, mobile app, database, ML model, or AWS deployment.

## Confidentiality and credentials
- Keep the repository private until the team authorizes broader access.
- Do not commit the original confidential Word design document unless authorized.
- Store actual secrets in a protected secret manager; `.env.example` contains only empty placeholders.
- Never commit real environment credentials, signing keys, payment credentials, or production data.
