# Version 1.0 Requirements and Scope

Based on sections 1–2 of Team 3's October 2026 draft design document. The requirements below describe **proposed**, not implemented, functionality.

## Functional scope
| ID | Requirement |
|---|---|
| MIH-001 | User registration, email verification, sign-in and authorization |
| MIH-002 | Lesson modules with on-demand video, audio and sheet music, filterable by instrument/difficulty/tags |
| MIH-003 | Real-time audio feedback on pitch accuracy, timing deviation and rhythm consistency |
| MIH-004 | Progress dashboard with completion percentage and performance metrics |
| MIH-005 | XP points, achievements, badges and practice streaks |
| MIH-006 | Instructor portal for lesson creation, publication and management |
| MIH-007 | Free, Premium and Pro tiers with Stripe subscription/checkout |
| MIH-008 | Responsive React web app and React Native iOS/Android apps |
| MIH-009 | CDN-backed video/audio/PDF delivery via S3 and CloudFront |
| MIH-010 | RBAC roles: Learner, Instructor, Admin |

**Identifiers MIH-001 to MIH-010 are repository documentation IDs**, not IDs printed in the design source.

Supported instruments include guitar, piano, violin, drums, bass and ukulele; the design permits additional instruments. Difficulties are Beginner, Intermediate and Advanced.

## Excluded from Version 1.0
- Specialized hardware integration beyond basic plug-and-play MIDI controllers
- Third-party instrument rental services
- Live one-on-one tutoring (Phase 2)
- Offline-only lesson packs (future)
- Social feed and peer challenges (Phase 2, flag-disabled)

## Cross-cutting constraints
- JWT/OIDC auth via Cognito; RBAC
- TLS transport, encrypted data at rest, managed secrets
- AWS ECS Fargate deployment with PostgreSQL and media storage
- Event-driven notifications/rewards via SNS/SQS
- Responsive and accessible client design
- Versioned `/api/v1` API and standardized traceable errors

The document mentions a QA load-testing target of 10,000 concurrent users; this is an engineering target, not a demonstrated capacity.

## Completion and validation
Acceptance criteria, release milestones and test cases require team approval; they are not specified comprehensively in the source. See [implementation plan](implementation-plan.md) and [open questions](open-questions.md).
