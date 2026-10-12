# Open Architecture and Design Questions

These are issues inferred from discrepancies or missing details in **draft** MIH Technical Design Document v1.0; they are not settled decisions.

| ID | Question | Why it matters |
|---|---|---|
| OQ-01 | Is audio inference on-device, server-side or hybrid? | §2.1 mentions both, §4.4 details ECS sidecar |
| OQ-02 | What is the exact feedback WebSocket URL/protocol? | §6.2 labels `POST /feedback/analyze` as WebSocket |
| OQ-03 | Do service-owned data schemas permit cross-service relational foreign keys? | §3 says independent schemas, §6.1 includes cross-domain FKs |
| OQ-04 | What is the chosen backend framework and service-to-service auth mechanism? | Not fully defined |
| OQ-05 | Should the User table store `passwordHash` when Cognito manages credentials? | Identity security and data ownership |
| OQ-06 | How are Stripe webhooks made idempotent and replay-safe? | Subscription consistency |
| OQ-07 | How are API payload schemas, error codes and endpoint versioning specified? | Client compatibility |
| OQ-08 | How do user-subscription JWT claims refresh after a plan upgrade? | Access-control consistency |
| OQ-09 | What are concrete accessibility and mobile UI acceptance criteria? | Figma/design delivery |
| OQ-10 | What are the ML training dataset, scores/thresholds and measured performance? | Appendix C remains placeholder |
| OQ-11 | What is the approved deployment, database migration and rollback plan? | Appendix D remains placeholder |
| OQ-12 | Which proposed cloud services/versions remain supported and cost appropriate? | Infrastructure feasibility and lifecycle |
| OQ-13 | What are security, retention and consent policies for captured audio? | User privacy and compliance |
| OQ-14 | What is each role's complete permission matrix? | RBAC completeness |
| OQ-15 | How are progress and gamification updates protected against duplicate events? | Correct scoring and XP |

## Decision workflow
1. Assign owner and source reference.
2. Record alternatives, security/cost impact and preferred approach.
3. Obtain team review and approval.
4. Update affected requirements, API models, diagrams and acceptance criteria.

Do not silently translate these open questions into implemented behavior.
