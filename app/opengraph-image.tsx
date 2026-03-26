import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'Manuel Navarro — Desarrollo Web & Mobile | APEX'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#050508',
          fontFamily: 'sans-serif',
          position: 'relative',
        }}
      >
        {/* Grid background */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage:
              'linear-gradient(rgba(0,175,204,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(0,175,204,0.06) 1px, transparent 1px)',
            backgroundSize: '48px 48px',
          }}
        />

        {/* Top radial glow */}
        <div
          style={{
            position: 'absolute',
            top: '-15%',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '900px',
            height: '500px',
            background: 'radial-gradient(ellipse, rgba(0,175,204,0.18) 0%, transparent 68%)',
          }}
        />

        {/* Content */}
        <div
          style={{
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '20px',
            padding: '0 100px',
            textAlign: 'center',
          }}
        >
          {/* Brand label */}
          <div
            style={{
              fontSize: 18,
              fontWeight: 800,
              letterSpacing: '0.5em',
              color: '#00AFCC',
              textTransform: 'uppercase',
            }}
          >
            APEX
          </div>

          {/* Main headline */}
          <div
            style={{
              fontSize: 72,
              fontWeight: 900,
              lineHeight: 1.08,
              color: '#F4F5FA',
              letterSpacing: '-0.025em',
            }}
          >
            Desarrollo Web & Mobile
          </div>

          {/* Divider */}
          <div
            style={{
              width: '100px',
              height: '3px',
              background: 'linear-gradient(90deg, transparent, #00AFCC, transparent)',
              borderRadius: '2px',
            }}
          />

          {/* Stack pills */}
          <div
            style={{
              display: 'flex',
              gap: '12px',
              alignItems: 'center',
            }}
          >
            {['Flutter', 'Next.js', 'TypeScript', 'Supabase'].map((tech) => (
              <div
                key={tech}
                style={{
                  padding: '8px 20px',
                  borderRadius: '9999px',
                  border: '1px solid rgba(0,175,204,0.35)',
                  background: 'rgba(0,175,204,0.08)',
                  color: 'rgba(244,245,250,0.75)',
                  fontSize: 20,
                  fontWeight: 600,
                }}
              >
                {tech}
              </div>
            ))}
          </div>

          {/* Author + domain */}
          <div
            style={{
              fontSize: 22,
              color: 'rgba(244,245,250,0.5)',
              fontWeight: 500,
              marginTop: '8px',
            }}
          >
            Manuel Navarro · theapexweb.com · Argentina
          </div>
        </div>
      </div>
    ),
    size,
  )
}
