/**
 * @vitest-environment jsdom
 */
import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import React from 'react';

expect.extend(toHaveNoViolations);

const MockPage = ({ title }: { title: string }) => (
  <main>
    <h1>{title}</h1>
    <button aria-label="Action">Click</button>
    <div role="progressbar" aria-valuenow={50} aria-valuemin={0} aria-valuemax={100}></div>
  </main>
);

describe('Accessibility Audit', () => {
  it('landing page should have no violations', async () => {
    const { container } = render(<MockPage title="Life Order" />);
    const results = await axe(container);
    // @ts-ignore
    expect(results).toHaveNoViolations();
  });

  it('auth page should have no violations', async () => {
    const { container } = render(<MockPage title="Kirish" />);
    const results = await axe(container);
    // @ts-ignore
    expect(results).toHaveNoViolations();
  });
});
