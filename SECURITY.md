# Security Policy

## Reporting a Vulnerability
Open a **private security advisory** in GitHub (Security > Advisories) or email the maintainers.

## Hardening Checklist
- Enable **Code scanning** (CodeQL)
- Enable **Dependabot alerts**
- Enable **Secret scanning**
- Protect `main` branch (PR reviews + status checks)
- Use **Environments** for secrets; never commit secrets
