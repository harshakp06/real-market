# Real Market

A modern real estate marketplace built with Next.js, Tailwind CSS, and Appwrite.

## Features

- Property listings with search and filtering
- Blog with custom subdomain
- Admin dashboard for managing properties and content
- Authentication with NextAuth and Appwrite
- Image uploads to Appwrite Storage
- Responsive design with Tailwind CSS

## Prerequisites

- Node.js 18+ and npm
- Appwrite instance (self-hosted or cloud)
- AWS S3 bucket (optional, for additional storage)

## Setup

1. Clone the repository:
```bash
git clone https://github.com/yourusername/real-market.git
cd real-market
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env.local` file with your configuration:
```env
# Appwrite Configuration
NEXT_PUBLIC_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
NEXT_PUBLIC_APPWRITE_PROJECT_ID=your-project-id
APPWRITE_API_KEY=your-api-key

# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-nextauth-secret

# AWS S3 Configuration (optional)
AWS_ACCESS_KEY_ID=your-aws-access-key
AWS_SECRET_ACCESS_KEY=your-aws-secret-key
AWS_REGION=your-aws-region
AWS_BUCKET_NAME=your-bucket-name
```

4. Initialize Appwrite:
```bash
npx ts-node scripts/init-appwrite.ts
```

This script will:
- Create the database and collections
- Set up the required attributes
- Create a storage bucket for media

5. Run the development server:
```bash
npm run dev
```

6. Access the application:
- Main site: http://real.harshafix.diy:3000
- Blog: http://blog.real.harshafix.diy:3000
- Admin: http://real.harshafix.diy:3000/admin

## Development

### Project Structure

```
real-market/
├── app/                    # Next.js App Router pages
│   ├── api/               # API routes
│   ├── blog/              # Blog pages
│   ├── properties/        # Property pages
│   └── admin/            # Admin dashboard
├── scripts/               # Setup scripts
└── public/               # Static assets
```

### Key Technologies

- **Frontend**: Next.js 14, React 19, Tailwind CSS 3
- **Backend**: Appwrite (Database, Auth, Storage)
- **Authentication**: NextAuth.js with Appwrite provider
- **Storage**: Appwrite Storage + AWS S3 (optional)

### Adding Content

1. Create an admin account in Appwrite
2. Log in to the admin dashboard
3. Add properties, blog posts, and other content

## Deployment

1. Build the application:
```bash
npm run build
```

2. Deploy to your hosting platform of choice (Vercel recommended)

3. Configure custom domains:
- Main site: real.harshafix.diy
- Blog: blog.real.harshafix.diy

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
