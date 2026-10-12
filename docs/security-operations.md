# Security, Reliability and Operations

From §§4.6, 6.4–6.5 of the confidential MIH draft (October 2026). This does not assert deployed compliance.

## Identity and authorization
- Amazon Cognito using OAuth 2.0/OpenID Connect and JWT bearer tokens
- Learner, Instructor and Admin role-based access
- JWT access-token lifetime described as 1 hour, with refresh token rotation
- API Gateway performs authentication/rate limiting; service-level validation still required
- Apply object-level ownership checks on user-scoped and lesson-scoped endpoints

## Data protection
- TLS 1.3 intended for client/service transport; HSTS
- AES-256 encryption at rest for RDS, S3 and Redis with AWS KMS keys
- AWS Secrets Manager for API keys, DB credentials and sensitive config
- Payment card data handled by Stripe-hosted checkout; no raw card data in MIH
- Parameterized SQL and OWASP API Security Top 10 practices

## Reliability and error handling
- Standard JSON error envelope `{ "error": { "code": "...", "message": "...", "traceId": "..." } }`
- Circuit breaker: 5 successive failures/30s, open 60s
- SQS dead-letter queues after 3 failed deliveries, alert on DLQ depth > 0
- Exponential backoff with jitter on async consumers; max 3 retries

## Logging and observability
- Structured JSON logs with timestamp, level, service, traceId, userId (when appropriate), message
- CloudWatch log groups: source proposes INFO retention 30 days and WARN/ERROR 90 days
- AWS X-Ray traces: draft 5% sampling, 100% for errors
- CloudWatch metrics: sessions, p50/p95/p99 audio feedback latency, payment conversions, error rates
- Alarms and PagerDuty: critical immediate, performance/dead-letter alerts after 5 minutes, low priority as tickets

## Operational documentation required
The original document leaves the deployment/rollback runbook and ML evaluation appendix as placeholders. Define environment promotion, migration rollback strategy, smoke testing, on-call roster and model quality criteria before production release.
