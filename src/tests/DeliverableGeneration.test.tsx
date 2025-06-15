
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import DeliverableGeneration from '../pages/DeliverableGeneration';
import { vi, describe, it, expect, beforeEach } from 'vitest';

// Mock fetch
global.fetch = vi.fn();

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: false },
    mutations: { retry: false }
  }
});

const renderWithProviders = (component: React.ReactElement) => {
  return render(
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        {component}
      </BrowserRouter>
    </QueryClientProvider>
  );
};

describe('F7-tests: Deliverable Generation Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Mock successful API responses
    (global.fetch as any).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({
        id: 'test-deliverable-id',
        content: 'Test generated content'
      })
    });
  });

  it('should validate BUSINESS_BUILDER length (700-800 words)', async () => {
    const searchParams = new URLSearchParams('?type=BUSINESS_BUILDER&promptId=test');
    window.history.pushState({}, '', `?${searchParams}`);
    
    renderWithProviders(<DeliverableGeneration />);
    
    await waitFor(() => {
      expect(screen.getByText(/Business Plan Generation/i)).toBeInTheDocument();
    });

    // Wait for generation to complete
    await waitFor(() => {
      const content = screen.getByText(/Sprinkle Haven Bakery Business Plan/i);
      expect(content).toBeInTheDocument();
      
      // Count words in generated content
      const contentElement = content.closest('.whitespace-pre-wrap');
      if (contentElement) {
        const wordCount = contentElement.textContent?.split(/\s+/).length || 0;
        expect(wordCount).toBeGreaterThanOrEqual(700);
        expect(wordCount).toBeLessThanOrEqual(800);
      }
    }, { timeout: 10000 });
  });

  it('should validate SOCIAL_EMAIL format (3-7 posts, 3-5 emails)', async () => {
    const searchParams = new URLSearchParams('?type=SOCIAL_EMAIL&promptId=test');
    window.history.pushState({}, '', `?${searchParams}`);
    
    renderWithProviders(<DeliverableGeneration />);
    
    await waitFor(() => {
      const content = screen.getByText(/Social Media & Email Campaign Package/i);
      expect(content).toBeInTheDocument();
      
      // Check for required number of posts and emails
      const contentElement = content.closest('.whitespace-pre-wrap');
      if (contentElement?.textContent) {
        const postCount = (contentElement.textContent.match(/\*\*Post \d+/g) || []).length;
        const emailCount = (contentElement.textContent.match(/\*\*Email \d+/g) || []).length;
        
        expect(postCount).toBeGreaterThanOrEqual(3);
        expect(postCount).toBeLessThanOrEqual(7);
        expect(emailCount).toBeGreaterThanOrEqual(3);
        expect(emailCount).toBeLessThanOrEqual(5);
      }
    }, { timeout: 10000 });
  });

  it('should validate SITE_AUDIT length (300-400 words audit + 100-150 words recommendations)', async () => {
    const searchParams = new URLSearchParams('?type=SITE_AUDIT&promptId=test');
    window.history.pushState({}, '', `?${searchParams}`);
    
    renderWithProviders(<DeliverableGeneration />);
    
    await waitFor(() => {
      const content = screen.getByText(/Website Audit Report/i);
      expect(content).toBeInTheDocument();
      
      const contentElement = content.closest('.whitespace-pre-wrap');
      if (contentElement?.textContent) {
        const analysisSection = contentElement.textContent.match(/## Current State Analysis[\s\S]*?## Strategic Recommendations/);
        const recommendationsSection = contentElement.textContent.match(/## Strategic Recommendations[\s\S]*$/);
        
        if (analysisSection) {
          const analysisWords = analysisSection[0].split(/\s+/).length;
          expect(analysisWords).toBeGreaterThanOrEqual(300);
          expect(analysisWords).toBeLessThanOrEqual(400);
        }
        
        if (recommendationsSection) {
          const recommendationsWords = recommendationsSection[0].split(/\s+/).length;
          expect(recommendationsWords).toBeGreaterThanOrEqual(100);
          expect(recommendationsWords).toBeLessThanOrEqual(150);
        }
      }
    }, { timeout: 10000 });
  });

  it('should validate emotional resonance scoring', async () => {
    // Mock Hume AI response
    (global.fetch as any).mockImplementation((url: string) => {
      if (url.includes('/api/hume/validate')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({
            arousal: 0.7,
            valence: 0.8
          })
        });
      }
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve({
          id: 'test-deliverable-id',
          content: 'Test content'
        })
      });
    });

    renderWithProviders(<DeliverableGeneration />);
    
    await waitFor(() => {
      const resonanceScore = screen.getByText(/Emotional Resonance Score/i);
      expect(resonanceScore).toBeInTheDocument();
      
      // Check that arousal > 0.5 and valence > 0.6
      const scoreElement = screen.getByText(/Arousal: 0\.70.*Valence: 0\.80/);
      expect(scoreElement).toBeInTheDocument();
    }, { timeout: 10000 });
  });

  it('should handle revision requests', async () => {
    renderWithProviders(<DeliverableGeneration />);
    
    await waitFor(() => {
      expect(screen.getByText(/Request Revision/i)).toBeInTheDocument();
    });

    const revisionInput = screen.getByPlaceholderText(/Describe what you'd like to change/i);
    const revisionButton = screen.getByRole('button', { name: /Apply Revision/i });
    
    fireEvent.change(revisionInput, { target: { value: 'Please add more detail about marketing strategy' } });
    fireEvent.click(revisionButton);
    
    expect(global.fetch).toHaveBeenCalledWith('/api/v1/request-revision', expect.objectContaining({
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: expect.stringContaining('marketing strategy')
    }));
  });

  it('should validate BUSINESS_BUILDER financials section (100 words)', async () => {
    const searchParams = new URLSearchParams('?type=BUSINESS_BUILDER&promptId=test');
    window.history.pushState({}, '', `?${searchParams}`);
    
    renderWithProviders(<DeliverableGeneration />);
    
    await waitFor(() => {
      const content = screen.getByText(/Financial Projections \(100 words\)/i);
      expect(content).toBeInTheDocument();
      
      // Validate financial section word count
      const contentElement = content.closest('.whitespace-pre-wrap');
      if (contentElement?.textContent) {
        const financialSection = contentElement.textContent.match(/## Financial Projections[\s\S]*?## Team Structure/);
        if (financialSection) {
          const financialWords = financialSection[0].split(/\s+/).length;
          expect(financialWords).toBeGreaterThanOrEqual(90);
          expect(financialWords).toBeLessThanOrEqual(110);
        }
      }
    }, { timeout: 10000 });
  });

  it('should display branding note', async () => {
    renderWithProviders(<DeliverableGeneration />);
    
    await waitFor(() => {
      const brandingNote = screen.getByText(/CanAI excludes branding/i);
      expect(brandingNote).toBeInTheDocument();
      expect(brandingNote.closest('#branding-note')).toBeInTheDocument();
    }, { timeout: 10000 });
  });

  it('should enforce regeneration limit (max 2 attempts)', async () => {
    renderWithProviders(<DeliverableGeneration />);
    
    await waitFor(() => {
      const regenerateButton = screen.getByText(/Regenerate \(0\/2\)/i);
      expect(regenerateButton).toBeInTheDocument();
    });

    // Simulate reaching the limit
    const regenerateButton = screen.getByRole('button', { name: /Regenerate/i });
    
    // Mock the component state to show limit reached
    fireEvent.click(regenerateButton);
    fireEvent.click(regenerateButton);
    
    await waitFor(() => {
      expect(screen.getByText(/Regenerate \(2\/2\)/i)).toBeInTheDocument();
    });
  });
});
