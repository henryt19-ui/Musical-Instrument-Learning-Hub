# Musical Instrument Learning Hub (MIH)

**Team 3 — Design Document v1.0 (Draft, October 2026)**

> CONFIDENTIAL — INTERNAL USE ONLY. Keep this repository private. This is a **design and planning starter**, not a working application.

The Musical Instrument Learning Hub (MIH) is a proposed cloud-native digital music education platform providing a structured library of instrument lessons, live audio-performance feedback, progress tracking, gamification, instructor content management, and Free/Premium/Pro subscriptions.

## Version 1.0 scope
- Registration, email verification, authentication and Learner/Instructor/Admin role permissions
- Guitar, piano, violin, drums, bass, ukulele and other instrument lessons; video, audio and sheet music
- Real-time pitch, timing and rhythm analysis using TensorFlow Lite
- Progress dashboard with completion, scores, XP, badges and practice streaks
- Instructor-managed lesson catalog and Stripe subscriptions
- Responsive React/TypeScript web app and React Native iOS/Android clients

Out of scope: live individual tutoring, social/peer challenges, third-party instrument rentals, offline-only packs and advanced hardware integration.

## Proposed architecture
| Layer | Proposed design |
|---|---|
| Web | React 18, TypeScript, Tailwind CSS, Redux Toolkit, React Query |
| Mobile | React Native |
| API | AWS API Gateway, Cognito JWT/OIDC |
| Backend | Auth, User, Lesson, Feedback, Progress, Notification, Payment services; ECS Fargate |
| Data | RDS PostgreSQL, S3 and CloudFront, Redis, Kinesis, Redshift |
| Practice feedback | WebSocket + 250 ms PCM audio frames, TensorFlow Lite scoring |
| Payments | Stripe Checkout and verified webhooks |

## Repository structure
- `apps/web`, `apps/mobile`: future client applications
- `services/{auth,user,lesson,feedback,progress,notification,payment}`: future microservices
- `packages/shared`: shared types/tokens
- `models/audio`: proposed inference model documentation
- `infra`: infrastructure planning
- `docs/`: requirements, architecture, API, data models, workflows, configuration, security, open questions
- `.github/`: proposed issue/PR templates and documentation CI

## Start here
1. Read [requirements](docs/requirements.md) and [architecture](docs/architecture.md).
2. Review [unresolved architecture decisions](docs/open-questions.md) before implementation.
3. Consult [API contracts](docs/api.md) and [data models](docs/data-models.md).
4. Reconcile the linked [Figma prototype](https://www.figma.com/design/mlWVGoH2XnbJj7UMM53Gio/Untitled?node-id=1-21) with [design notes](docs/design-spec.md). The actual frames have not been inspected.
5. Follow [setup](SETUP.md) and [contributing](CONTRIBUTING.md) guidance.

**Source:** Team 3, *Musical Instrument Learning Hub – Design Document*, version 1.0, October 2026, draft. Original confidential DOCX intentionally not committed. [Source references](docs/source-links.md).
