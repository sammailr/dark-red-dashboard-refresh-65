
# Mailr - Email Inbox Management Platform

## Project Overview

Mailr is a comprehensive web application for managing and ordering email inboxes, particularly Google and Microsoft inboxes. The platform provides sophisticated tools for domain management, inbox ordering, subscription management, and email configuration with automatically generated email prefixes.

## Recent Updates

- **Updated Authentication UI**: Login and signup pages now feature the official Mailr logo
- **Enhanced Visual Identity**: Consistent branding across all authentication flows
- **Improved User Experience**: Streamlined authentication interface with modern design

## Core Features

### 🚀 Inbox Management
- **Order Google & Microsoft Inboxes**: Create and manage inboxes with custom display names
- **Multiple Email Prefixes**: Automatically generate email variations (firstname.lastname@, firstname@, lastname@)
- **Bulk Management**: Tools for adding domains and display names in bulk
- **Status Tracking**: Real-time progress monitoring for inbox creation

### 🌐 Domain Management
- **Domain Registration**: Register and manage multiple domains
- **Nameserver Configuration**: Update nameservers with guided tutorials
- **Domain Swapping**: Transfer domains between different configurations
- **Bulk Operations**: Import and manage domains in bulk

### 💳 Subscription & Billing
- **Flexible Subscriptions**: Manage multiple active subscriptions
- **Usage Tracking**: Monitor domain slots and usage limits
- **Invoice Management**: Complete billing history and PDF downloads
- **Payment Methods**: Secure payment processing integration

### 🔧 Advanced Tools
- **Sending Platform Integration**: Connect with existing sending platforms or add custom ones
- **Master Inbox Management**: Centralized inbox configuration
- **Affiliate Program**: Built-in affiliate tracking and management
- **Comprehensive Settings**: User profile and account management

## Tech Stack

This project is built with cutting-edge web technologies:

### Frontend Framework
- **React 18.3.1**: Modern UI component library with hooks
- **TypeScript**: Type-safe JavaScript for enhanced development experience
- **Vite**: Next generation frontend tooling for fast development

### UI & Styling
- **Tailwind CSS**: Utility-first CSS framework for rapid styling
- **Shadcn UI**: Beautiful, accessible UI component library
- **Radix UI**: Low-level UI primitives for custom components
- **Lucide React**: Modern icon library

### State Management & Data Fetching
- **React Query (@tanstack/react-query)**: Powerful data fetching and caching
- **React Context API**: Global state management for orders and subscriptions
- **React Hook Form**: Performant forms with easy validation

### Routing & Navigation
- **React Router DOM 6.26.2**: Declarative routing for single-page applications

### Development Tools
- **ESLint**: Code linting and formatting
- **PostCSS**: CSS processing and optimization

## Data Types & Schema

### Order Management

```typescript
type Domain = {
  id: string;
  name: string;
  status: 'pending' | 'active' | 'failed' | 'cancelled';
  progress: number;
  url: string;
  nameservers: string;
};

type Order = {
  id: string;
  date: string;
  status: 'processing' | 'completed' | 'cancelled';
  domains: Domain[];
  provider: 'google' | 'microsoft';
};
```

### Subscription Management

```typescript
type Invoice = {
  id: string;
  subscriptionId: string;
  amount: number;
  date: string;
  status: 'paid' | 'pending' | 'failed';
  pdfUrl?: string;
};

type Subscription = {
  id: string;
  status: 'active' | 'canceled' | 'trial' | 'expired';
  price: number;
  billingDate: string;
  quantity: number;
  daysRemaining?: number;
  lastBillingDate?: string;
  orderId?: string;
  availableDomainSlots?: number;
};
```

### Authentication Forms

```typescript
// Login Form Data
type LoginFormData = {
  email: string;
  password: string;
};

// Signup Form Data
type SignupFormData = {
  email: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
  company: string;
};
```

### Context State Types

```typescript
// Subscription Context State
type SubscriptionState = {
  isFreeTrial: boolean;
  daysRemaining: number;
  hasPaymentMethod: boolean;
  subscriptions: Subscription[];
  invoices: Invoice[];
  toggleSubscriptionStatus: () => void;
  togglePaymentMethodStatus: () => void;
  addSubscription: (subscription: Subscription) => void;
  removeSubscription: (id: string) => void;
  updateSubscription: (id: string, updates: Partial<Subscription>) => void;
  updateSubscriptionQuantity: (id: string, newQuantity: number) => boolean;
  getSubscriptionById: (id: string) => Subscription | undefined;
  getInvoicesForSubscription: (subscriptionId: string) => Invoice[];
  cancelSubscription: (id: string) => void;
  reactivateSubscription: (id: string) => void;
};

// Order Context State
type OrderContextType = {
  orders: Order[];
  getOrderById: (id: string) => Order | undefined;
  cancelDomain: (orderId: string, domainId: string) => void;
  cancelOrder: (orderId: string) => void;
};
```

## Project Structure

```
src/
├── components/           # Reusable UI components
│   ├── ui/              # Shadcn UI components
│   ├── layout/          # Layout components (Header, Sidebar, MainLayout)
│   ├── domain/          # Domain management components
│   └── order/           # Order management components
├── pages/               # Application pages/routes
├── contexts/            # React context providers
├── hooks/               # Custom React hooks
├── lib/                 # Utility functions and helpers
└── main.tsx            # Application entry point
```

## Getting Started

### Prerequisites

- **Node.js & npm** - [Install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)
- **Modern web browser** with JavaScript enabled

### Local Development

```bash
# Clone the repository
git clone https://github.com/lovable-23/af1bb6b9-ca34-40bd-8b5c-3e9a8ccb2e8b.git

# Navigate to the project directory
cd mailr

# Install dependencies
npm install

# Start the development server
npm run dev
```

The application will be available at `http://localhost:5173`

### Build for Production

```bash
# Create production build
npm run build

# Preview production build locally
npm run preview
```

## Key Pages & Routes

- **/** - Dashboard/Homepage with order overview
- **/login** - User authentication (login)
- **/signup** - User registration
- **/order-google-inboxes** - Google inbox ordering interface
- **/order-microsoft-inboxes** - Microsoft inbox ordering interface
- **/domains** - Domain management dashboard
- **/settings** - User account settings
- **/nameserver-update/:domainId** - Nameserver configuration guide

## Deployment

### Lovable Platform
The project can be deployed using Lovable's built-in deployment tools:
1. Visit the [Lovable Project](https://lovable.dev/projects/399c0db2-54bb-4581-8443-3587115d3cdb)
2. Click on **Share → Publish**

### Custom Domain Deployment
For custom domain deployment, we recommend using **Netlify**:
- See our [deployment docs](https://docs.lovable.dev/tips-tricks/custom-domain/) for detailed instructions

### GitHub Integration
This project supports bidirectional sync with GitHub:
- Changes in Lovable automatically push to GitHub
- Changes pushed to GitHub automatically sync to Lovable
- Supports parallel development workflows

## Environment Configuration

The application uses environment variables for configuration. Create a `.env.local` file for local development:

```env
# Add your environment variables here
VITE_API_URL=your_api_url
VITE_APP_NAME=Mailr
```

## Contributing

1. **Fork the repository**
2. **Create your feature branch** (`git checkout -b feature/amazing-feature`)
3. **Commit your changes** (`git commit -m 'Add some amazing feature'`)
4. **Push to the branch** (`git push origin feature/amazing-feature`)
5. **Open a Pull Request**

### Development Guidelines

- Follow TypeScript best practices
- Use the existing component patterns
- Maintain consistent styling with Tailwind CSS
- Write descriptive commit messages
- Test changes thoroughly before submitting PRs

## Browser Support

- **Chrome** (latest)
- **Firefox** (latest)
- **Safari** (latest)
- **Edge** (latest)

## License

This project is licensed under the **MIT License** - see the LICENSE file for details.

## Support & Documentation

- **Lovable Documentation**: [https://docs.lovable.dev/](https://docs.lovable.dev/)
- **Lovable Discord Community**: [Join Discord](https://discord.com/channels/1119885301872070706/1280461670979993613)
- **Project Issues**: Use GitHub Issues for bug reports and feature requests

---

**Built with ❤️ using Lovable - The AI-powered web development platform**
