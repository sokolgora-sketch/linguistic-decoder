'use client';
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { createPublicShare } from '@/lib/publicShareClient';
import type { AnalyzeWordResultUI } from '@/shared/resultsUI';

type Props = {
  result: AnalyzeWordResultUI;
};

export default function ShareSnippetPublicButton({ result }: Props) {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [shareUrl, setShareUrl] = useState<string | null>(null);

  async function handleShare() {
    try {
      setStatus('loading');
      const id = await createPublicShare(result);
      const url = `${window.location.origin}/share/${id}`;
      await navigator.clipboard.writeText(url);
      setShareUrl(url);
      setStatus('success');
    } catch (err) {
      console.error('Share failed:', err);
      setStatus('error');
    }
  }

  return (
    <div className="flex items-center gap-2">
      <Button
        disabled={status === 'loading'}
        onClick={handleShare}
        className="text-sm"
      >
        {status === 'loading'
          ? 'Sharing...'
          : status === 'success'
          ? 'Copied link!'
          : 'Share public link'}
      </Button>
      {shareUrl && (
        <a
          href={shareUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs underline text-muted-foreground hover:text-foreground"
        >
          View link
        </a>
      )}
    </div>
  );
}
