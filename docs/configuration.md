# Proposed Configuration Specification

Based on §5 of the MIH draft. Never commit actual secrets. Per-service variables should be injected only where needed (AWS Secrets Manager for sensitive values).

## Service variables
| Variable | Purpose |
|---|---|
| DATABASE_URL | PostgreSQL connection information; secret |
| COGNITO_USER_POOL_ID | User pool identifier |
| COGNITO_CLIENT_ID | User pool client ID |
| STRIPE_SECRET_KEY | Server-side Stripe API secret |
| STRIPE_WEBHOOK_SECRET | Verify Stripe webhook signatures |
| CDN_BASE_URL | CloudFront base URL |
| REDIS_HOST | ElastiCache Redis host |
| REDIS_PORT | Redis port, source example 6379 |
| AUDIO_MODEL_PATH | TFLite model path in Feedback Service sidecar |
| AWS_REGION | AWS SDK region |
| LOG_LEVEL | Optional; default info |
| MAX_UPLOAD_SIZE_MB | Optional; default 50 |
| CORS_ALLOWED_ORIGINS | Permitted browser origins |

Copy `.env.example` locally only for development templates; it contains **no production credentials**.

## Feature flags — AWS AppConfig
| Flag | Draft default | Release phase |
|---|---|---|
| ENABLE_GAMIFICATION | true | 1.0 |
| ENABLE_AUDIO_FEEDBACK | true | 1.0 |
| ENABLE_SOCIAL_FEATURES | false | Phase 2 |
| ENABLE_OFFLINE_MODE | false | Future |
| ENABLE_LIVE_TUTORING | false | Phase 2 |

Design specifies AppConfig refresh every 60 seconds.

## Draft scaling parameters
- ECS each service: minimum 2 tasks, maximum 20, scaling target ~70% CPU
- Cooldowns: scale-out 60s, scale-in 300s
- PostgreSQL RDS Multi-AZ with read replicas for Lesson and Progress workloads
- Redis three-node cluster with failover
- CloudFront signed URL expiry 3,600 seconds

These are proposed settings only; production load and cost validation remain pending.
