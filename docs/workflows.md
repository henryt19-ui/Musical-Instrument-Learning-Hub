# Proposed Key Workflows

Based on §6.3 of MIH draft design v1.0.

## Registration and email verification
1. Learner submits email, password and display name.
2. Client sends `POST /api/v1/auth/register` to API Gateway.
3. Auth Service validates email, password policy and uniqueness.
4. Auth Service creates a Cognito User Pool account; Cognito sends verification.
5. User Service creates PostgreSQL user with Learner role and Free tier.
6. Learner verifies email; account transitions to Active, then authenticates.

## Lesson playback and practice
1. Learner selects a lesson from the catalog.
2. Client requests `GET /api/v1/lessons/{lessonId}`.
3. Lesson Service returns metadata and signed CloudFront URLs.
4. Client streams media from CloudFront, not through the backend.
5. Client starts session via `POST /api/v1/lessons/{lessonId}/start`, establishing a feedback WebSocket.
6. Microphone PCM chunks of 250 ms go to Feedback Service and TFLite inference.
7. Pitch/timing/rhythm scores stream back for on-screen visual overlays.
8. On session end, client PUTs final progress to `/api/v1/progress/{lessonId}`.
9. Progress Service updates records and publishes `lesson.completed`; notification/XP/badge handling follows.

## Subscription upgrade
1. Learner chooses Premium or Pro.
2. Client POSTs plan to `/api/v1/subscriptions/checkout`.
3. Payment Service creates Stripe-hosted Checkout session.
4. Learner enters payment details only on Stripe.
5. Stripe posts `checkout.session.completed` to the verified webhook.
6. Payment Service verifies signature and updates Subscription and User tier.
7. `subscription.upgraded` event triggers email; refreshed auth claims convey entitlements.

All sequences are intended flows. Failure handling, retry/idempotency and async consistency require concrete contracts and tests.
