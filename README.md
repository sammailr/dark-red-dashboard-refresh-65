
# Mailr - Email Inbox Management Platform

## Project Overview

Mailr is a web application for managing and ordering email inboxes, particularly Google inboxes. The platform provides tools for domain management, ordering new inboxes, and configuring display names with automatically generated email prefixes.

## Features

- **Order Google Inboxes**: Create and manage Google inboxes with custom display names
- **Multiple Email Prefixes**: Automatically generate email variations (firstname.lastname@, firstname@, lastname@)
- **Sending Platform Integration**: Select from existing sending platforms or add new ones
- **Bulk Management**: Tools for adding domains and display names in bulk
- **Customizable Display Names**: Configure multiple display names per domain

## Tech Stack

This project is built with modern web technologies:

- **Vite**: Next generation frontend tooling
- **TypeScript**: Type-safe JavaScript
- **React**: UI component library
- **Shadcn UI**: Beautiful, accessible UI components
- **Tailwind CSS**: Utility-first CSS framework
- **React Router**: Declarative routing for React
- **React Query**: Data fetching library for React

## Getting Started

### Prerequisites

- Node.js & npm - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

### Local Development

```sh
# Clone the repository
git clone https://github.com/lovable-23/af1bb6b9-ca34-40bd-8b5c-3e9a8ccb2e8b.git

# Navigate to the project directory
cd mailr

# Install dependencies
npm i

# Start the development server
npm run dev
```

## Project Structure

- `/src/components`: Reusable UI components
- `/src/pages`: Individual pages of the application
- `/src/hooks`: Custom React hooks
- `/src/contexts`: React context providers
- `/src/lib`: Utility functions and helpers

## Deployment

The project can be deployed using Lovable's built-in deployment tools. Visit the [Lovable Project](https://lovable.dev/projects/399c0db2-54bb-4581-8443-3587115d3cdb) and click on Share -> Publish.

For custom domain deployment, we recommend using Netlify. See our [docs](https://docs.lovable.dev/tips-tricks/custom-domain/) for more details.

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.
