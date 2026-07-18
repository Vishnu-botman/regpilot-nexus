import { ToolDecorator as Tool, Injectable, z } from '@nitrostack/core';

@Injectable()
export class EnterpriseTools {
  private githubToken: string;
  private slackToken: string;

  constructor() {
    this.githubToken = process.env.GITHUB_TOKEN || '';
    this.slackToken = process.env.SLACK_BOT_TOKEN || '';
  }

  @Tool({
    name: 'create_github_issue',
    description: 'Create a GitHub issue for a compliance task',
    inputSchema: z.object({
      repository: z.string().describe('GitHub repository (owner/repo)'),
      title: z.string().describe('Issue title'),
      body: z.string().describe('Issue description'),
      labels: z.array(z.string()).optional().describe('Issue labels'),
    })
  })
  async createGitHubIssue(input: {
    repository: string;
    title: string;
    body: string;
    labels?: string[];
  }) {
    if (!this.githubToken) {
      return {
        success: false,
        error: 'GitHub token not configured',
        issueUrl: null,
        mockResponse: {
          repository: input.repository,
          title: input.title,
          body: input.body,
          labels: input.labels || [],
          created: false,
        },
      };
    }

    try {
      const response = await fetch(
        `https://api.github.com/repos/${input.repository}/issues`,
        {
          method: 'POST',
          headers: {
            'Authorization': `token ${this.githubToken}`,
            'Accept': 'application/vnd.github.v3+json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            title: input.title,
            body: input.body,
            labels: input.labels || [],
          }),
        }
      );

      if (!response.ok) {
        const error = await response.text();
        throw new Error(`GitHub API error: ${error}`);
      }

      const issue: any = await response.json();
      return {
        success: true,
        issueUrl: issue.html_url,
        issueNumber: issue.number,
        repository: input.repository,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : String(error),
        issueUrl: null,
      };
    }
  }

  @Tool({
    name: 'notify_slack',
    description: 'Send a compliance notification to Slack',
    inputSchema: z.object({
      channel: z.string().describe('Slack channel name or ID'),
      message: z.string().describe('Message to send'),
      priority: z.enum(['low', 'medium', 'high', 'critical']).optional(),
    })
  })
  async notifySlack(input: {
    channel: string;
    message: string;
    priority?: string;
  }) {
    if (!this.slackToken) {
      return {
        success: false,
        error: 'Slack token not configured',
        mockResponse: {
          channel: input.channel,
          message: input.message,
          priority: input.priority || 'medium',
          sent: false,
        },
      };
    }

    try {
      const priorityEmoji: Record<string, string> = {
        low: '🟢',
        medium: '🟡',
        high: '🟠',
        critical: '🔴',
      };

      const emoji = priorityEmoji[input.priority || 'medium'] || '📋';
      const formattedMessage = `${emoji} *Compliance Alert*\n\n${input.message}`;

      const response = await fetch('https://slack.com/api/chat.postMessage', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.slackToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          channel: input.channel,
          text: formattedMessage,
        }),
      });

      const result: any = await response.json();

      if (!result.ok) {
        throw new Error(`Slack API error: ${result.error}`);
      }

      return {
        success: true,
        channel: input.channel,
        timestamp: result.ts,
        message: 'Notification sent successfully',
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : String(error),
      };
    }
  }
}
