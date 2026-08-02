# Civitas - Implementation

## Overview
This document describes the CI/CD, security, infrastructure, GraphQL, and PWA integrations added to Civitas.

## Technologies Added

### 1. GitHub Actions
- CI pipeline
- Test execution
- Docker build
- Artifact upload

### 2. SonarQube
- Code quality analysis
- Security hotspots
- Code coverage
- Technical debt

### 3. OWASP Dependency-Check
- Vulnerability scanning
- Dependency analysis
- HTML report generation

### 4. Snyk
- Security scanning
- Severity threshold
- Dependency monitoring

### 5. Terraform
- AWS infrastructure
- VPC and subnets
- EKS cluster
- RDS PostgreSQL
- ElastiCache Redis

### 6. GraphQL
- Schema definitions
- Resolvers
- User, Citizen, Service types

### 7. tRPC
- End-to-end type safety
- Router with procedures
- Zod validation schemas

### 8. GraphQL Yoga
- GraphQL server
- Executable schema
- Type definitions

### 9. Apollo Federation
- Subgraph architecture
- Users subgraph
- Citizens subgraph
- Entity relationships

### 10. PWA
- Service Worker
- Web App Manifest
- Offline support

## Files Created

### CI/CD
- `.github/workflows/ci.yml` - Main CI pipeline
- `.github/workflows/sonarqube.yml` - SonarQube analysis

### Terraform
- `terraform/main.tf` - AWS infrastructure
- `terraform/variables.tf` - Terraform variables

### GraphQL
- `backend/graphql/schema.graphql` - GraphQL schema
- `backend/graphql/resolvers.py` - GraphQL resolvers

### tRPC
- `backend/trpc/router.ts` - tRPC router

### GraphQL Yoga
- `backend/graphql-yoga/server.ts` - Yoga server

### Apollo Federation
- `backend/apollo-federation/users.ts` - Users subgraph
- `backend/apollo-federation/citizens.ts` - Citizens subgraph

### PWA
- `frontend/public/manifest.json` - PWA manifest
- `frontend/public/sw.js` - Service Worker

## Features

### GitHub Actions
- Test execution with pytest
- Coverage reporting with codecov
- SonarQube integration
- OWASP Dependency-Check
- Snyk security scanning
- Docker build and push

### SonarQube
- Code quality analysis
- Security hotspot detection
- Technical debt tracking
- Coverage integration

### OWASP Dependency-Check
- Dependency vulnerability scanning
- HTML report generation
- Artifact upload

### Snyk
- Security vulnerability scanning
- Severity threshold filtering
- Dependency monitoring

### Terraform
- VPC creation
- Public subnets
- EKS cluster
- EKS node group
- RDS PostgreSQL
- ElastiCache Redis

### GraphQL
- User, Citizen, Address, Document types
- Service and ServiceRequest types
- Query and mutation resolvers
- CRUD operations

### tRPC
- Type-safe procedures
- Zod validation
- User and citizen queries
- User and citizen mutations

### GraphQL Yoga
- Standalone GraphQL server
- Executable schema
- Type definitions and resolvers

### Apollo Federation
- Users subgraph with User entity
- Citizens subgraph with Citizen entity
- Entity relationships
- Federation v2.0

### PWA
- Service Worker for caching
- Web App Manifest
- Offline support
- Installability

## Installation Required

Add to `backend/requirements.txt`:
```
pytest==7.4.0
pytest-cov==4.1.0
```

Add to `backend/package.json`:
```json
{
  "dependencies": {
    "@trpc/server": "^11.0.0",
    "@apollo/server": "^4.10.0",
    "@apollo/subgraph": "^2.7.0",
    "graphql-yoga": "^5.0.0",
    "@graphql-tools/schema": "^10.0.0",
    "zod": "^3.23.0"
  }
}
```

Run:
```bash
cd backend && pip install -r requirements.txt
cd backend && npm install
```

## Notes
- All code is written but packages are not installed (per user request)
- Requires GitHub secrets for SonarQube, Snyk, Docker Hub
- Terraform requires AWS credentials and Terraform CLI
- Apollo Federation requires Apollo Router for gateway
