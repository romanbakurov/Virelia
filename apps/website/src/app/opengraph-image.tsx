import { ImageResponse } from 'next/og';

export const alt = 'Vellira design system';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

export default function Image() {
  return new ImageResponse(
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        width: '100%',
        height: '100%',
        padding: 72,
        color: '#f8fafc',
        background:
          'linear-gradient(135deg, #0f172a 0%, #241b4f 48%, #5b3dff 100%)',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 20,
          fontSize: 34,
          fontWeight: 700,
        }}
      >
        <div
          style={{
            width: 54,
            height: 54,
            borderRadius: 14,
            background: '#a78bfa',
          }}
        />
        Vellira
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
        <div
          style={{
            maxWidth: 920,
            fontSize: 78,
            fontWeight: 800,
            lineHeight: 0.96,
            letterSpacing: 0,
          }}
        >
          React and React Native components for production interfaces.
        </div>

        <div
          style={{
            color: '#ddd6fe',
            fontSize: 30,
            lineHeight: 1.35,
          }}
        >
          Shared APIs. Semantic tokens. Accessible foundations.
        </div>
      </div>
    </div>,
    size
  );
}
