# Proposed API Contracts

Source: §6.2 and §6.4 of MIH design document, draft v1.0.

Base path: `/api/v1`. Authenticated endpoints require `Authorization: Bearer <JWT>`. All interfaces are **design proposals**, not live endpoints.

| Method | Route | Purpose | Auth |
|---|---|---|---|
| POST | `/auth/register` | Register and send email verification | No |
| POST | `/auth/login` | Exchange credentials for tokens | No |
| POST | `/auth/refresh` | Exchange refresh token for access token | Refresh token |
| GET | `/lessons` | Filter catalog by instrument/difficulty/tags | Yes |
| GET | `/lessons/{lessonId}` | Lesson metadata and signed media URLs | Yes |
| POST | `/lessons/{lessonId}/start` | Start lesson and audio-feedback session | Yes |
| POST | `/feedback/analyze` | Audio-chunk feedback (labeled WebSocket in design) | Yes |
| GET | `/progress/{userId}` | Aggregate progress and XP | Yes |
| GET | `/progress/{userId}/{lessonId}` | Per-lesson metrics and badges | Yes |
| PUT | `/progress/{lessonId}` | Record completed session progress | Yes |
| GET | `/users/{userId}/profile` | Read profile and subscription tier | Yes |
| PUT | `/users/{userId}/profile` | Update name, avatar, preferences | Yes |
| POST | `/subscriptions/checkout` | Create Stripe Checkout session | Yes |
| POST | `/subscriptions/webhook` | Verify Stripe signature and update subscription | Stripe HMAC |
| GET | `/subscriptions/{userId}` | Read subscription and renewal status | Yes |

## Standard errors
```json
{
  "error": {
    "code": "NOT_FOUND",
    "message": "Requested lesson was not found.",
    "traceId": "f47ac10b-58cc-4372-a567-0e02b2c3d479"
  }
}
```
| Status | Code |
|---|---|
| 400 | BAD_REQUEST |
| 401 | UNAUTHORIZED |
| 403 | FORBIDDEN |
| 404 | NOT_FOUND |
| 422 | UNPROCESSABLE_ENTITY |
| 429 | RATE_LIMITED |
| 500 | INTERNAL_ERROR |

## Contract questions requiring sign-off
- `POST /feedback/analyze` is specified as a REST-looking path while described as a WebSocket: choose a concrete upgrade URL, frame envelope and authentication strategy.
- User-scoped endpoints require object-level access controls so a learner cannot access another user's records.
- Subscription webhook requires Stripe signature verification, idempotency and replay handling.
- Source does not provide complete request/response JSON schemas or versioning/deprecation policy.
- Registration and refresh flows must be reconciled with the chosen Cognito identity flow.

See [open questions](open-questions.md) before generating controllers or API mocks.
