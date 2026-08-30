# Security Policy

The security of Vellira and its users is important to us.

## Supported Versions

Security updates are provided for the latest published version of Vellira.

| Version | Supported |
| ------- | --------- |
| Latest  | ✅        |
| Older   | ❌        |

Users are encouraged to upgrade to the latest available version before
reporting an issue.

## Reporting a Vulnerability

Please do not report security vulnerabilities through public GitHub issues,
pull requests, discussions, or social media.

Report vulnerabilities privately using one of the following methods:

1. Submit a private vulnerability report through GitHub Security Advisories.
2. Email **security@vellira.dev**.

When reporting a vulnerability, include as much relevant information as
possible:

- affected package and version;
- vulnerability description;
- reproduction steps or proof of concept;
- potential impact;
- suggested mitigation, when available.

## Response Process

After receiving a report, we aim to:

- acknowledge receipt as soon as reasonably possible;
- investigate and assess the report;
- communicate progress when appropriate;
- prepare and publish a fix when the vulnerability is confirmed;
- coordinate public disclosure with the reporter.

Response and resolution times may vary depending on the complexity and severity
of the issue.

## Responsible Disclosure

Please allow reasonable time for investigation and remediation before publicly
disclosing a vulnerability.

We ask reporters to:

- avoid accessing or modifying data that does not belong to them;
- avoid disrupting services or availability;
- keep vulnerability details private until a fix or coordinated disclosure is
  available;
- act in good faith.

We appreciate responsible security research and thank everyone who helps improve
the security of Vellira.

## Temporary Dependency Exceptions

Temporary vulnerability exceptions for non-reachable transitive tooling
dependencies are documented in
[docs/SECURITY_VULNERABILITY_EXCEPTIONS.md](docs/SECURITY_VULNERABILITY_EXCEPTIONS.md).
Each exception must include dependency paths, exposure analysis, upstream
tracking, and removal conditions.

Thank you for helping keep Vellira and its users secure.
