import { NextRequest, NextResponse } from 'next/server'

const SLACK_WEBHOOK_URL = process.env.SLACK_WEBHOOK_URL
const DASHBOARD_URL = 'https://wcid-dashboard.vercel.app'

export async function POST(request: NextRequest) {
  try {
    // Check if Slack webhook is configured
    if (!SLACK_WEBHOOK_URL) {
      console.error('SLACK_WEBHOOK_URL not configured')
      return NextResponse.json({ error: 'Slack webhook not configured' }, { status: 500 })
    }

    const body = await request.json()
    
    // Only alert on action documents
    if (body._type !== 'action') {
      return NextResponse.json({ message: 'Ignored: not an action' }, { status: 200 })
    }

    // Build Slack message
    const actionTitle = body.title || 'Untitled Action'
    const actionId = body._id || 'unknown'
    
    // Get category if available
    const category = body.categories?.[0]?.title || body.category || ''
    const categoryText = category ? ` (${category})` : ''

    const slackMessage = {
      blocks: [
        {
          type: 'header',
          text: {
            type: 'plain_text',
            text: '🆕 New Action Created',
            emoji: true
          }
        },
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: `*${actionTitle}*${categoryText}`
          }
        },
        {
          type: 'context',
          elements: [
            {
              type: 'mrkdwn',
              text: `<${DASHBOARD_URL}|View Dashboard> · ID: \`${actionId}\``
            }
          ]
        }
      ]
    }

    // Send to Slack
    const slackResponse = await fetch(SLACK_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(slackMessage),
    })

    if (!slackResponse.ok) {
      console.error('Slack webhook failed:', await slackResponse.text())
      return NextResponse.json({ error: 'Slack notification failed' }, { status: 500 })
    }

    return NextResponse.json({ message: 'Notification sent' }, { status: 200 })
  } catch (error) {
    console.error('Webhook error:', error)
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 })
  }
}

// Also handle GET for testing
export async function GET() {
  return NextResponse.json({ 
    status: 'Webhook endpoint active',
    configured: !!SLACK_WEBHOOK_URL,
    usage: 'POST action documents from Sanity to trigger Slack notifications'
  })
}
