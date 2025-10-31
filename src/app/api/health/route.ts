import { NextResponse } from 'next/server'

export async function GET() {
  try {
    // Check if required environment variables are set
    const requiredEnvVars = [
      'NEXT_PUBLIC_SITE_URL',
      'NEXT_PUBLIC_SITE_NAME',
    ]

    const missingEnvVars = requiredEnvVars.filter(envVar => !process.env[envVar])

    if (missingEnvVars.length > 0) {
      return NextResponse.json(
        {
          status: 'error',
          message: 'Missing environment variables',
          missing: missingEnvVars
        },
        { status: 500 }
      )
    }

    // Check if Stripe is configured
    const stripeConfigured = !!process.env.STRIPE_SECRET_KEY

    return NextResponse.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV,
      version: process.env.npm_package_version || '1.0.0',
      services: {
        stripe: stripeConfigured ? 'configured' : 'not configured',
        email: process.env.SMTP_HOST ? 'configured' : 'not configured',
      },
      uptime: process.uptime(),
    })
  } catch (error) {
    return NextResponse.json(
      {
        status: 'error',
        message: 'Health check failed',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}