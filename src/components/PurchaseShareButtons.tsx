import { useEffect, useState } from 'react';
import { track, type SharePlatform } from '../lib/track';

interface Props {
  purchaseName: string;
  purchaseCost: number;
  primaryValue: number;
  primaryUnit: string;
  siteUrl?: string;
}

export default function PurchaseShareButtons({
  purchaseName,
  purchaseCost,
  primaryValue,
  primaryUnit,
  siteUrl = 'https://afterwage.com',
}: Props) {
  const [hasNativeShare, setHasNativeShare] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setHasNativeShare(typeof navigator !== 'undefined' && !!navigator.share);
  }, []);

  // Build the share text once and reuse
  const formatValue = (v: number) =>
    v.toLocaleString('en-US', {
      minimumFractionDigits: v < 10 ? 1 : 0,
      maximumFractionDigits: v < 10 ? 1 : 0,
    });

  const formatCost = (n: number) =>
    n.toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    });

  const thing = purchaseName.trim()
    ? `A ${purchaseName.trim().toLowerCase()} (${formatCost(purchaseCost)})`
    : `A ${formatCost(purchaseCost)} purchase`;

  const shareText = `${thing} costs me ${formatValue(primaryValue)} ${primaryUnit} of my life. Find yours:`;
  const shareTextWithUrl = `${shareText} ${siteUrl}`;

  const fireShareEvent = (platform: SharePlatform) => {
    track('share_clicked', { platform, context: 'purchase' });
  };

  // Native share (mobile-first)
  const nativeShare = async () => {
    fireShareEvent('native');
    try {
      await navigator.share({
        title: 'AfterWage',
        text: shareText,
        url: siteUrl,
      });
    } catch {
      // User canceled or share failed. No-op.
    }
  };

  const copyLink = async () => {
    fireShareEvent('copy');
    try {
      await navigator.clipboard.writeText(shareTextWithUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard permission denied or not available. Silent.
    }
  };

  // Platform-specific share URLs
  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(siteUrl)}`;
  const redditUrl = `https://www.reddit.com/submit?title=${encodeURIComponent(shareText)}&url=${encodeURIComponent(siteUrl)}`;
  const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(siteUrl)}`;
  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(shareTextWithUrl)}`;

  return (
    <div className="mt-6 pt-6 border-t border-cream/10">
      <p className="font-mono text-xs uppercase tracking-widest text-cream/50 mb-4">
        Share this reckoning
      </p>

      {/* Mobile: native share sheet (single button) */}
      {hasNativeShare && (
        <div className="sm:hidden">
          <button
            onClick={nativeShare}
            className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-cream text-ink font-display uppercase tracking-tight hover:bg-gold-light transition-colors"
          >
            <ShareIcon />
            Share
          </button>
        </div>
      )}

      {/* Desktop: platform-specific buttons. Also shown on mobile as fallback if no native share. */}
      <div className={hasNativeShare ? 'hidden sm:flex sm:flex-wrap sm:gap-3' : 'flex flex-wrap gap-3'}>
        <ShareButton href={twitterUrl} label="Twitter / X" onTrack={() => fireShareEvent('twitter')}>
          <TwitterIcon />
        </ShareButton>
        <ShareButton href={redditUrl} label="Reddit" onTrack={() => fireShareEvent('reddit')}>
          <RedditIcon />
        </ShareButton>
        <ShareButton href={linkedinUrl} label="LinkedIn" onTrack={() => fireShareEvent('linkedin')}>
          <LinkedInIcon />
        </ShareButton>
        <ShareButton href={whatsappUrl} label="WhatsApp" onTrack={() => fireShareEvent('whatsapp')}>
          <WhatsAppIcon />
        </ShareButton>
        <button
          onClick={copyLink}
          className="flex items-center gap-2 px-4 py-2 bg-cream/10 hover:bg-cream/20 border border-cream/20 text-cream text-sm font-mono uppercase tracking-wider transition-colors"
          title="Copy link and text"
        >
          <LinkIcon />
          {copied ? 'Copied ✓' : 'Copy'}
        </button>
      </div>
    </div>
  );
}

function ShareButton({
  href,
  label,
  onTrack,
  children,
}: {
  href: string;
  label: string;
  onTrack?: () => void;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onClick={onTrack}
      aria-label={`Share on ${label}`}
      title={`Share on ${label}`}
      className="flex items-center gap-2 px-4 py-2 bg-cream/10 hover:bg-cream/20 border border-cream/20 text-cream text-sm font-mono uppercase tracking-wider transition-colors"
    >
      {children}
      <span className="hidden md:inline">{label}</span>
    </a>
  );
}

/* ========== Icons (inline SVG, no external deps) ========== */

function ShareIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="18" cy="5" r="3" />
      <circle cx="6" cy="12" r="3" />
      <circle cx="18" cy="19" r="3" />
      <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
      <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
    </svg>
  );
}

function TwitterIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function RedditIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0A12 12 0 000 12a12 12 0 0012 12 12 12 0 0012-12A12 12 0 0012 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 01-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 01.042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 014.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 01.14-.197.35.35 0 01.238-.042l2.906.617a1.214 1.214 0 011.108-.701zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.687-.562-1.249-1.25-1.249zm-5.466 3.99a.327.327 0 00-.231.094.33.33 0 000 .463c.842.842 2.484.913 2.961.913.477 0 2.105-.056 2.961-.913a.361.361 0 00.029-.463.33.33 0 00-.464 0c-.547.533-1.684.73-2.512.73-.828 0-1.979-.196-2.512-.73a.326.326 0 00-.232-.095z" />
    </svg>
  );
}

function LinkedInIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.063 2.063 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

function WhatsAppIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
    </svg>
  );
}

function LinkIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71" />
      <path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71" />
    </svg>
  );
}
