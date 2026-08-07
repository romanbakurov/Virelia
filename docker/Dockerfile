FROM mcr.microsoft.com/devcontainers/javascript-node:22-bookworm@sha256:941987777db5f9d90e83bc341076226c406691dd400ec2fa667a990cf0b4f25b

WORKDIR /workspace

ENV PNPM_HOME="/pnpm"
ENV PATH="${PNPM_HOME}:${PATH}"

RUN corepack enable

CMD ["sleep", "infinity"]